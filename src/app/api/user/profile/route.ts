import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { getCurrentUser } from "@/lib/auth";

const profileUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters")
      .trim()
      .optional(),
    image: z
      .string()
      .max(2000000, "Ukuran gambar terlalu besar")
      .nullable()
      .optional(),
    headline: z
      .string()
      .max(120, "Headline maksimal 120 karakter")
      .trim()
      .optional(),
    streakCount: z
      .number()
      .int()
      .min(0)
      .optional(),
    lastStreakDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid")
      .nullable()
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.image !== undefined ||
      data.headline !== undefined ||
      data.streakCount !== undefined ||
      data.lastStreakDate !== undefined,
    {
      message: "Setidaknya satu field harus diisi",
    }
  );

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input strictly to prevent privileged field mutation
    const result = profileUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updateData: {
      name?: string;
      image?: string | null;
      headline?: string;
      streakCount?: number;
      lastStreakDate?: string | null;
    } = {};
    if (result.data.name !== undefined) {
      updateData.name = result.data.name;
    }
    if (result.data.image !== undefined) {
      updateData.image = result.data.image;
    }
    if (result.data.headline !== undefined) {
      updateData.headline = result.data.headline;
    }
    if (result.data.streakCount !== undefined) {
      updateData.streakCount = result.data.streakCount;
    }
    if (result.data.lastStreakDate !== undefined) {
      updateData.lastStreakDate = result.data.lastStreakDate;
    }

    // Update allowed fields only (never mutate role, emailVerified, or id from client)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        headline: true,
        streakCount: true,
        lastStreakDate: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        headline: true,
        streakCount: true,
        lastStreakDate: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching profile" },
      { status: 500 }
    );
  }
}
