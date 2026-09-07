import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { evaluateConsultantProject, ConsultantCaseRequirements } from "@/features/consultant/scoring/engine";
import { awardXp } from "@/features/xp/ledger";
import { prisma } from "@/lib/db/client";

const CONSULTANT_CASES_MAP: Record<string, ConsultantCaseRequirements> = {
  "small-office-notaris": {
    clientName: "Kantor Notaris & PPAT H. Suryadi, S.H.",
    clientType: "small-office",
    budget: 15000000, // 15 Juta
    wiredClientCount: 12,
    apCount: 2,
    requireVlan: false,
    requirePoe: true,
  },
  "warnet-gaming-center": {
    clientName: "CyberArena Esports Cafe",
    clientType: "warnet",
    budget: 25000000, // 25 Juta
    wiredClientCount: 30,
    apCount: 2,
    requireVlan: false,
    requireDualWan: true,
    requirePoe: false,
  },
  "medium-office-logistics": {
    clientName: "PT Nusantara Express Logistics",
    clientType: "medium-office",
    budget: 50000000, // 50 Juta
    wiredClientCount: 40,
    apCount: 3,
    requireVlan: true,
    requireDualWan: true,
    requirePoe: true,
    vlanList: [
      { vlanId: 10, name: "Staff Operasional", requiredHosts: 40 },
      { vlanId: 20, name: "Server & CCTV", requiredHosts: 10 },
      { vlanId: 30, name: "Tamu (Guest)", requiredHosts: 30 },
    ],
  },
  "smk-tkj-school-lab": {
    clientName: "SMK Negeri 1 Teknologi",
    clientType: "school",
    budget: 75000000, // 75 Juta
    wiredClientCount: 72,
    apCount: 4,
    requireVlan: true,
    requirePoe: true,
    vlanList: [
      { vlanId: 10, name: "Lab Komputer 1", requiredHosts: 36 },
      { vlanId: 20, name: "Lab Komputer 2", requiredHosts: 36 },
      { vlanId: 99, name: "Guru & Manajemen", requiredHosts: 20 },
    ],
  },
  "multi-floor-corporate": {
    clientName: "Gedung Menara Finansial 3-Lantai",
    clientType: "enterprise",
    budget: 120000000, // 120 Juta
    wiredClientCount: 100,
    apCount: 6,
    requireVlan: true,
    requireDualWan: true,
    requirePoe: true,
    vlanList: [
      { vlanId: 10, name: "Lantai 1 Front Office", requiredHosts: 30 },
      { vlanId: 20, name: "Lantai 2 Finance & HR", requiredHosts: 40 },
      { vlanId: 30, name: "Lantai 3 Executive", requiredHosts: 30 },
      { vlanId: 50, name: "Wi-Fi Tamu", requiredHosts: 50 },
    ],
  },
};

export async function POST(
  request: Request,
  props: { params: Promise<{ caseSlug: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { caseSlug } = await props.params;
    const body = await request.json();

    const requirements = CONSULTANT_CASES_MAP[caseSlug];
    if (!requirements) {
      return NextResponse.json({ error: "Studi kasus tidak ditemukan" }, { status: 404 });
    }

    // Prerequisite proof gating: small-office-notaris is foundational. Cases 2-5 require passing case 1.
    if (caseSlug !== "small-office-notaris") {
      const foundationalPassed = await prisma.consultantProject.findFirst({
        where: {
          userId: user.id,
          case: { slug: "small-office-notaris" },
          passed: true,
        },
      });

      if (!foundationalPassed) {
        return NextResponse.json(
          {
            error:
              "Prasyarat belum terpenuhi: Anda harus menyelesaikan dan lulus studi kasus fondasi SOHO Notaris terlebih dahulu.",
          },
          { status: 403 }
        );
      }
    }

    const evaluation = evaluateConsultantProject(requirements, {
      boqItems: body.boqItems || [],
      vlanPlan: body.vlanPlan || [],
    });

    let xpResult = null;
    if (evaluation.passed) {
      xpResult = await awardXp(
        user.id,
        250,
        "CONSULTANT_PROJECT_PASSED",
        `consultant-${caseSlug}`
      );
    }

    // Link or create case in DB
    let dbCase = await prisma.consultantCase.findUnique({
      where: { slug: caseSlug },
    });

    if (!dbCase) {
      dbCase = await prisma.consultantCase.create({
        data: {
          slug: caseSlug,
          title: requirements.clientName,
          clientName: requirements.clientName,
          clientType: requirements.clientType,
          description: `Studi kasus ${requirements.clientName} dengan pagu anggaran Rp ${requirements.budget.toLocaleString("id-ID")}.`,
          budget: requirements.budget,
          requirements: requirements as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          constraints: { maxBudget: requirements.budget },
          difficulty: "intermediate",
          orderIndex: 1,
          published: true,
        },
      });
    }

    if (dbCase) {
      await prisma.consultantProject.create({
        data: {
          userId: user.id,
          caseId: dbCase.id,
          boqItems: body.boqItems || [],
          topologyData: body.topologyData || {},
          ipPlan: body.ipPlan || {},
          vlanPlan: body.vlanPlan || [],
          compositeScore: {
            rubricVersion: "1.0",
            totalScore: evaluation.totalScore,
            maxTotalScore: evaluation.maxTotalScore,
            dimensions: evaluation.dimensions,
          } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          score: evaluation.totalScore,
          passed: evaluation.passed,
          feedback: {
            rubricVersion: "1.0",
            passed: evaluation.passed,
            summary: evaluation.passed
              ? "Proposal disetujui klien"
              : "Proposal perlu revisi spesifikasi teknis atau anggaran",
            dimensions: evaluation.dimensions,
          } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        },
      });
    }

    return NextResponse.json({
      passed: evaluation.passed,
      totalScore: evaluation.totalScore,
      maxTotalScore: evaluation.maxTotalScore,
      dimensions: evaluation.dimensions,
      rubricVersion: "1.0",
      xpResult,
    });
  } catch (error) {
    console.error("Consultant submit error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate consultant project proposal" },
      { status: 500 }
    );
  }
}
