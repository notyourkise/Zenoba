/**
 * Realistic Fictional Device Catalog for Zenoba IT Consultant Mode
 * Specifications and pricing structured in IDR (Rupiah).
 */

export interface DeviceSpec {
  id: string;
  name: string;
  category: "router" | "switch" | "access_point" | "cable_rack" | "server";
  price: number; // in IDR
  portCount: number;
  portSpeed: "100M" | "1G" | "10G";
  managed: boolean;
  vlanSupport: boolean;
  poeSupport: boolean;
  poeBudgetWatts?: number;
  rackmount: boolean;
  wirelessStandard?: "Wi-Fi 5 (802.11ac)" | "Wi-Fi 6 (802.11ax)" | "Wi-Fi 7";
  description: string;
}

export const DEVICE_CATALOG: DeviceSpec[] = [
  // --- Routers ---
  {
    id: "router-sbr-5g",
    name: "Zenoba SmallBranch Router ER-5G",
    category: "router",
    price: 1250000,
    portCount: 5,
    portSpeed: "1G",
    managed: true,
    vlanSupport: true,
    poeSupport: false,
    rackmount: false,
    description: "Router 5-port Gigabit untuk kantor cabang kecil & SOHO. Mendukung VLAN trunking, firewall, dan DHCP Server.",
  },
  {
    id: "router-pro-8g-dualwan",
    name: "Zenoba ProRouter ER-8G Dual-WAN",
    category: "router",
    price: 3200000,
    portCount: 8,
    portSpeed: "1G",
    managed: true,
    vlanSupport: true,
    poeSupport: false,
    rackmount: true,
    description: "Router performa tinggi dengan dukungan Dual-WAN Failover, Load Balancing, dan throughput hingga 2 Gbps.",
  },
  {
    id: "router-core-sfp-10g",
    name: "Zenoba CoreRouter CR-10G Enterprise",
    category: "router",
    price: 8500000,
    portCount: 12,
    portSpeed: "10G",
    managed: true,
    vlanSupport: true,
    poeSupport: false,
    rackmount: true,
    description: "Enterprise Core Router dengan 4x SFP+ 10G dan 8x GbE, cocok untuk kampus, sekolah besar, dan gedung multi-floor.",
  },

  // --- Switches ---
  {
    id: "switch-unmanaged-8g",
    name: "Zenoba LiteSwitch SW-8G (Unmanaged)",
    category: "switch",
    price: 450000,
    portCount: 8,
    portSpeed: "1G",
    managed: false,
    vlanSupport: false,
    poeSupport: false,
    rackmount: false,
    description: "Switch unmanaged 8-port GbE plug-and-play ekonomis untuk ekstensi workstation sederhana tanpa VLAN.",
  },
  {
    id: "switch-managed-24g",
    name: "Zenoba SmartSwitch L2-24G (Managed)",
    category: "switch",
    price: 2400000,
    portCount: 24,
    portSpeed: "1G",
    managed: true,
    vlanSupport: true,
    poeSupport: false,
    rackmount: true,
    description: "Switch Managed Layer 2 24-Port GbE + 2x SFP uplink. Mendukung 802.1Q VLAN, STP, dan Port Security.",
  },
  {
    id: "switch-poe-24g-370w",
    name: "Zenoba PowerSwitch L2-24G-PoE+ (370W)",
    category: "switch",
    price: 4800000,
    portCount: 24,
    portSpeed: "1G",
    managed: true,
    vlanSupport: true,
    poeSupport: true,
    poeBudgetWatts: 370,
    rackmount: true,
    description: "Switch Managed 24-Port Gigabit dengan 802.3at PoE+ (Total 370W) untuk menyuplai daya Access Point dan IP Phone.",
  },
  {
    id: "switch-core-48g-4sfp-10g",
    name: "Zenoba CoreSwitch L3-48G-10G (Enterprise)",
    category: "switch",
    price: 9800000,
    portCount: 48,
    portSpeed: "1G",
    managed: true,
    vlanSupport: true,
    poeSupport: false,
    rackmount: true,
    description: "Layer 3 Distribution/Core Switch 48-port GbE + 4x 10G SFP+ uplink dengan routing hardware berkecepatan tinggi.",
  },

  // --- Access Points ---
  {
    id: "ap-wifi6-ax3000",
    name: "Zenoba Wave6 AP-AX3000 (Ceiling Mount)",
    category: "access_point",
    price: 1350000,
    portCount: 1,
    portSpeed: "1G",
    managed: true,
    vlanSupport: true,
    poeSupport: true,
    rackmount: false,
    wirelessStandard: "Wi-Fi 6 (802.11ax)",
    description: "Access Point Wi-Fi 6 Dual-Band AX3000 dengan Multi-SSID VLAN tagging. Mampu menangani hingga 120 perangkat aktif.",
  },
  {
    id: "ap-wifi6-pro-ax5400",
    name: "Zenoba Wave6 Pro-AX5400 (High-Density)",
    category: "access_point",
    price: 2650000,
    portCount: 1,
    portSpeed: "1G",
    managed: true,
    vlanSupport: true,
    poeSupport: true,
    rackmount: false,
    wirelessStandard: "Wi-Fi 6 (802.11ax)",
    description: "Access Point High-Density 4x4 MU-MIMO untuk aula, lab komputer, dan lingkungan dengan lebih dari 200 perangkat simultan.",
  },

  // --- Passive & Infrastructure ---
  {
    id: "cable-cat6-roll-305m",
    name: "Zenoba Cat6 UTP Cable Roll (305 Meter)",
    category: "cable_rack",
    price: 1450000,
    portCount: 0,
    portSpeed: "1G",
    managed: false,
    vlanSupport: false,
    poeSupport: true,
    rackmount: false,
    description: "Kabel UTP Kategori 6 100% Solid Copper 23 AWG untuk transmisi data Gigabit berkecepatan tinggi dan PoE handal.",
  },
  {
    id: "patch-panel-cat6-24p",
    name: "Zenoba Patch Panel Cat6 24-Port (1U)",
    category: "cable_rack",
    price: 450000,
    portCount: 24,
    portSpeed: "1G",
    managed: false,
    vlanSupport: false,
    poeSupport: true,
    rackmount: true,
    description: "Panel terminasi kabel 24-port 19 inci untuk manajemen kabel server/rack yang rapi dan terorganisir.",
  },
  {
    id: "rack-wallmount-12u",
    name: "Zenoba Wallmount Server Rack 12U (Depth 600mm)",
    category: "cable_rack",
    price: 1850000,
    portCount: 0,
    portSpeed: "1G",
    managed: false,
    vlanSupport: false,
    poeSupport: false,
    rackmount: true,
    description: "Rak server wallmount 12U dilengkapi kaca temper, kipas pendingin exhaust, dan PDU colokan listrik 6-socket.",
  },
  {
    id: "sfp-fiber-pair-10g",
    name: "Zenoba SFP+ 10G Multi-Mode Transceiver (Pair)",
    category: "cable_rack",
    price: 950000,
    portCount: 2,
    portSpeed: "10G",
    managed: false,
    vlanSupport: true,
    poeSupport: false,
    rackmount: false,
    description: "Modul optik transceiver 10Gbps SFP+ 850nm untuk backbone antar switch atau antar lantai hingga 300 meter.",
  },
];
