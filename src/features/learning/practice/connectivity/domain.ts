/**
 * Pure Domain Logic for Beginner Connectivity Practice & Simulation
 *
 * Implements deterministic reachability decisions, link state management,
 * and criteria evaluation for the Welcome to Networking library lab scenario.
 */

export interface TopologyLink {
  from: string;
  to: string;
  status: "connected" | "disconnected";
}

export interface PrintVerification {
  client: string;
  target: string;
  success: boolean;
}

export interface LibraryTopologyState {
  links: TopologyLink[];
  ispUplinkConnected: boolean;
  verifiedPrints: PrintVerification[];
}

export interface PracticalCriterionResult {
  id: string;
  title: string;
  passed: boolean;
  reason: string;
}

export interface PracticalEvaluationResult {
  allPassed: boolean;
  criteriaResults: PracticalCriterionResult[];
}

/**
 * Creates initial topology state for the library practical assessment scenario.
 * PC-Sirkulasi cable is initially disconnected, and ISP uplink is offline.
 */
export function createInitialLibraryState(): LibraryTopologyState {
  return {
    links: [
      { from: "pc-katalog", to: "switch-perpus", status: "connected" },
      { from: "pc-sirkulasi", to: "switch-perpus", status: "disconnected" },
      { from: "printer-barcode", to: "switch-perpus", status: "connected" },
    ],
    ispUplinkConnected: false,
    verifiedPrints: [],
  };
}

/**
 * Checks if a direct link between two nodes exists and is connected.
 */
export function isDirectLinkConnected(
  links: TopologyLink[],
  nodeA: string,
  nodeB: string
): boolean {
  return links.some(
    (l) =>
      ((l.from === nodeA && l.to === nodeB) ||
        (l.from === nodeB && l.to === nodeA)) &&
      l.status === "connected"
  );
}

/**
 * Pure reachability calculation in a star topology via an intermediary switch.
 */
export function isStarReachable(
  links: TopologyLink[],
  fromNode: string,
  toNode: string,
  switchNode = "switch-perpus"
): boolean {
  if (fromNode === toNode) return true;
  const hasFromSwitch = isDirectLinkConnected(links, fromNode, switchNode);
  const hasToSwitch = isDirectLinkConnected(links, toNode, switchNode);
  return hasFromSwitch && hasToSwitch;
}

/**
 * Deterministically sets or toggles a link status between two nodes.
 */
export function setLinkStatus(
  state: LibraryTopologyState,
  from: string,
  to: string,
  status: "connected" | "disconnected"
): LibraryTopologyState {
  const existingIndex = state.links.findIndex(
    (l) =>
      (l.from === from && l.to === to) || (l.from === to && l.to === from)
  );

  let newLinks: TopologyLink[];
  if (existingIndex >= 0) {
    newLinks = state.links.map((l, idx) =>
      idx === existingIndex ? { ...l, status } : l
    );
  } else {
    newLinks = [...state.links, { from, to, status }];
  }

  return {
    ...state,
    links: newLinks,
  };
}

/**
 * Toggles a link status between connected and disconnected.
 */
export function toggleLinkStatus(
  state: LibraryTopologyState,
  from: string,
  to: string
): LibraryTopologyState {
  const isConnected = isDirectLinkConnected(state.links, from, to);
  return setLinkStatus(
    state,
    from,
    to,
    isConnected ? "disconnected" : "connected"
  );
}

/**
 * Toggles ISP Uplink status.
 */
export function toggleIspUplink(
  state: LibraryTopologyState
): LibraryTopologyState {
  return {
    ...state,
    ispUplinkConnected: !state.ispUplinkConnected,
  };
}

/**
 * Executes a deterministic print test from client to target printer.
 * Note: Local print job ONLY requires local star reachability via switch.
 * External ISP status does NOT impede local print jobs.
 */
export function executePrintTest(
  state: LibraryTopologyState,
  client: string,
  target = "printer-barcode",
  switchNode = "switch-perpus"
): {
  newState: LibraryTopologyState;
  success: boolean;
  reason: string;
} {
  const isClientConnected = isDirectLinkConnected(state.links, client, switchNode);
  const isPrinterConnected = isDirectLinkConnected(state.links, target, switchNode);

  let success = false;
  let reason = "";

  if (!isClientConnected) {
    success = false;
    reason = `Gagal: Kabel jaringan ${client} belum tersambung ke ${switchNode}.`;
  } else if (!isPrinterConnected) {
    success = false;
    reason = `Gagal: Kabel ${target} belum tersambung ke ${switchNode}.`;
  } else {
    success = true;
    reason = `Sukses: Dokumen dari ${client} berhasil dikirim dan dicetak oleh ${target} melalui jaringan LAN lokal.`;
  }

  // Update verifiedPrints record (replace if already tested from this client)
  const otherPrints = state.verifiedPrints.filter((p) => p.client !== client);
  const newVerifiedPrints = [
    ...otherPrints,
    { client, target, success },
  ];

  const newState: LibraryTopologyState = {
    ...state,
    verifiedPrints: newVerifiedPrints,
  };

  return {
    newState,
    success,
    reason,
  };
}

/**
 * Evaluates practical criteria P01, P02, and P03 identically to the authoritative server.
 */
export function evaluatePracticalCriteria(
  state: LibraryTopologyState
): PracticalEvaluationResult {
  const hasKatalog = isDirectLinkConnected(state.links, "pc-katalog", "switch-perpus");
  const hasSirkulasi = isDirectLinkConnected(state.links, "pc-sirkulasi", "switch-perpus");
  const hasPrinter = isDirectLinkConnected(state.links, "printer-barcode", "switch-perpus");

  // P01: All three essential nodes physically connected to switch
  const p01Passed = hasKatalog && hasSirkulasi && hasPrinter;

  // P02: pc-sirkulasi restored without breaking pc-katalog or printer
  const p02Passed = hasSirkulasi && hasKatalog && hasPrinter;

  // P03: ISP uplink disconnected AND verified prints succeeded from both PCs
  const katalogPrintSuccess = state.verifiedPrints.some(
    (p) =>
      p.client === "pc-katalog" &&
      p.target === "printer-barcode" &&
      p.success === true
  );

  const sirkulasiPrintSuccess = state.verifiedPrints.some(
    (p) =>
      p.client === "pc-sirkulasi" &&
      p.target === "printer-barcode" &&
      p.success === true
  );

  const p03Passed =
    !state.ispUplinkConnected &&
    katalogPrintSuccess &&
    sirkulasiPrintSuccess &&
    p01Passed;

  const criteriaResults: PracticalCriterionResult[] = [
    {
      id: "P01",
      title: "Jalur Fisik Lengkap (Physical Reachability)",
      passed: p01Passed,
      reason: p01Passed
        ? "Seluruh perangkat kerja lokal terhubung fisik ke switch perpustakaan."
        : "Ada perangkat kerja lokal yang belum terhubung ke switch.",
    },
    {
      id: "P02",
      title: "Restorasi Cabang Rusak (Fault Isolation & Repair)",
      passed: p02Passed,
      reason: p02Passed
        ? "Kabel cabang PC-Sirkulasi berhasil dipasang kembali tanpa mengganggu cabang lain."
        : "Kabel cabang PC-Sirkulasi masih belum terpasang dengan benar.",
    },
    {
      id: "P03",
      title: "Verifikasi Layanan Lokal Mandiri (Local Service Verification)",
      passed: p03Passed,
      reason: p03Passed
        ? "Uji cetak dari kedua PC berhasil diverifikasi meskipun uplink Internet sedang padam."
        : "Uji cetak lokal belum berhasil diverifikasi pada kondisi offline Internet.",
    },
  ];

  return {
    allPassed: criteriaResults.every((c) => c.passed),
    criteriaResults,
  };
}
