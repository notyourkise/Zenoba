import { clientServerModuleData } from "./network-foundations/client-server";
import { networkDevicesModuleData } from "./network-foundations/devices";
import { howDataTravelsModuleData } from "./network-foundations/how-data-travels";
import { physicalMediaCablingModuleData } from "./network-foundations/media-cabling";
import { osiTcpipModuleData } from "./network-foundations/osi-tcpip";
import { topologyModuleData } from "./network-foundations/topology";
import { typesOfNetworksModuleData } from "./network-foundations/types-of-networks";
import { welcomeModuleData } from "./network-foundations/welcome";
import { binaryIpv4ModuleData } from "./ipv4-subnetting/binary-ipv4";
import { addressTypesModuleData } from "./ipv4-subnetting/address-types";
import { maskCidrModuleData } from "./ipv4-subnetting/mask-cidr";
import { subnetCalculationsModuleData } from "./ipv4-subnetting/subnet-calculations";
import { vlsmDesignModuleData } from "./ipv4-subnetting/vlsm-design";
import { ethernetMacModuleData } from "./switching-lan/ethernet-mac";
import { arpBroadcastModuleData } from "./switching-lan/arp-broadcast";
import { vlanSegmentationModuleData } from "./switching-lan/vlan-segmentation";
import { accessTrunkModuleData } from "./switching-lan/access-trunk";
import { gatewayRouteModuleData } from "./routing-services/gateway-route";
import { staticIntervlanModuleData } from "./routing-services/static-intervlan";
import { dhcpDnsModuleData } from "./routing-services/dhcp-dns";
import { natPatModuleData } from "./routing-services/nat-pat";
import { transportServicesModuleData } from "./routing-services/transport-services";
import { wirelessBasicsModuleData } from "./wireless-troubleshooting/wireless-basics";
import { wirelessSecurityModuleData } from "./wireless-troubleshooting/wireless-security";
import { diagnosticToolsModuleData } from "./wireless-troubleshooting/diagnostic-tools";
import { troubleshootingMethodologyModuleData } from "./wireless-troubleshooting/troubleshooting-methodology";
import { requirementsAnalysisModuleData } from "./network-planning/requirements-analysis";
import { capacityProcurementModuleData } from "./network-planning/capacity-procurement";
import { topologyIpVlanDesignModuleData } from "./network-planning/topology-ip-vlan-design";
import { proposalReviewModuleData } from "./network-planning/proposal-review";
import { appliedCasesModuleData } from "./network-planning/applied-cases";
import type { CurriculumLesson, CurriculumModule } from "./schema";

/**
 * Registry of authoritative curriculum definitions.
 * Provides rich outcomes, evidence links, and lesson blocks.
 */
const CURRICULUM_REGISTRY: Record<string, CurriculumModule> = {
  // Path 1: Network Foundations
  "welcome-to-networking": welcomeModuleData,
  "module-welcome-to-networking": welcomeModuleData,
  "types-of-networks": typesOfNetworksModuleData,
  "module-types-of-networks": typesOfNetworksModuleData,
  "client-server-communication": clientServerModuleData,
  "module-client-server-communication": clientServerModuleData,
  "network-topology": topologyModuleData,
  "module-network-topology": topologyModuleData,
  "network-devices": networkDevicesModuleData,
  "module-network-devices": networkDevicesModuleData,
  "physical-media-cabling": physicalMediaCablingModuleData,
  "module-physical-media-cabling": physicalMediaCablingModuleData,
  "how-data-travels": howDataTravelsModuleData,
  "module-how-data-travels": howDataTravelsModuleData,
  "osi-tcpip-foundations": osiTcpipModuleData,
  "module-osi-tcpip-foundations": osiTcpipModuleData,

  // Path 2: IPv4 & Subnetting
  "biner-dan-ipv4": binaryIpv4ModuleData,
  "module-biner-dan-ipv4": binaryIpv4ModuleData,
  "binary-ipv4-structure": binaryIpv4ModuleData, // Legacy alias
  "module-binary-ipv4-structure": binaryIpv4ModuleData,

  "jenis-alamat": addressTypesModuleData,
  "module-jenis-alamat": addressTypesModuleData,

  "mask-dan-cidr": maskCidrModuleData,
  "module-mask-dan-cidr": maskCidrModuleData,

  "kalkulasi-subnet": subnetCalculationsModuleData,
  "module-kalkulasi-subnet": subnetCalculationsModuleData,
  "subnet-calculations": subnetCalculationsModuleData, // Legacy alias
  "module-subnet-calculations": subnetCalculationsModuleData,

  "subnetting-dan-vlsm": vlsmDesignModuleData,
  "module-subnetting-dan-vlsm": vlsmDesignModuleData,

  // Path 3: Switching & LAN
  "ethernet-dan-mac": ethernetMacModuleData,
  "module-ethernet-dan-mac": ethernetMacModuleData,

  "arp-dan-broadcast": arpBroadcastModuleData,
  "module-arp-dan-broadcast": arpBroadcastModuleData,
  "switching-and-arp": arpBroadcastModuleData, // Legacy alias
  "module-switching-and-arp": arpBroadcastModuleData,

  "vlan-dan-segmentasi": vlanSegmentationModuleData,
  "module-vlan-dan-segmentasi": vlanSegmentationModuleData,
  "vlan-and-routing": vlanSegmentationModuleData, // Legacy alias
  "module-vlan-and-routing": vlanSegmentationModuleData,

  "access-dan-trunk": accessTrunkModuleData,
  "module-access-dan-trunk": accessTrunkModuleData,

  // Path 4: Routing & Network Services
  "gateway-dan-route": gatewayRouteModuleData,
  "module-gateway-dan-route": gatewayRouteModuleData,

  "static-intervlan": staticIntervlanModuleData,
  "module-static-intervlan": staticIntervlanModuleData,

  "dhcp-dns": dhcpDnsModuleData,
  "module-dhcp-dns": dhcpDnsModuleData,
  "dhcp-and-dns-services": dhcpDnsModuleData, // Legacy alias
  "module-dhcp-and-dns-services": dhcpDnsModuleData,

  "nat-pat": natPatModuleData,
  "module-nat-pat": natPatModuleData,
  "nat-pat-security": natPatModuleData, // Legacy alias
  "module-nat-pat-security": natPatModuleData,

  "transport-services": transportServicesModuleData,
  "module-transport-services": transportServicesModuleData,

  // Path 5: Wireless & Troubleshooting
  "wireless-basics": wirelessBasicsModuleData,
  "module-wireless-basics": wirelessBasicsModuleData,
  "wireless-technologies": wirelessBasicsModuleData, // Legacy alias
  "module-wireless-technologies": wirelessBasicsModuleData,

  "wireless-security": wirelessSecurityModuleData,
  "module-wireless-security": wirelessSecurityModuleData,

  "diagnostic-tools": diagnosticToolsModuleData,
  "module-diagnostic-tools": diagnosticToolsModuleData,
  "cli-troubleshooting-tools": diagnosticToolsModuleData, // Legacy alias
  "module-cli-troubleshooting-tools": diagnosticToolsModuleData,

  "troubleshooting-methodology": troubleshootingMethodologyModuleData,
  "module-troubleshooting-methodology": troubleshootingMethodologyModuleData,

  // Path 6: Network Planning & IT Consultant
  "requirements-analysis": requirementsAnalysisModuleData,
  "module-requirements-analysis": requirementsAnalysisModuleData,

  "capacity-procurement": capacityProcurementModuleData,
  "module-capacity-procurement": capacityProcurementModuleData,

  "topology-ip-vlan-design": topologyIpVlanDesignModuleData,
  "module-topology-ip-vlan-design": topologyIpVlanDesignModuleData,

  "proposal-review": proposalReviewModuleData,
  "module-proposal-review": proposalReviewModuleData,

  "applied-cases": appliedCasesModuleData,
  "module-applied-cases": appliedCasesModuleData,
};

/**
 * Legacy lesson slug alias mappings for backward compatibility.
 */
const LESSON_SLUG_ALIASES: Record<string, string> = {
  "binary-fundamentals": "biner-8-bit",
  "subnet-calculator-lab": "network-broadcast",
  "arp-resolution-flow": "arp-request-reply",
  "vlan-segmentation-practice": "broadcast-domain-vlan",
  "nat-pat-translation": "pat-port-address-translation",
  "wifi-bands-and-security": "band-frekuensi-wifi",
  "terminal-diagnostics-lab": "ipconfig-ping-diagnostic",
};

/**
 * Retrieves curriculum module metadata and lessons by slug or id.
 */
export function getCurriculumModule(
  slugOrId: string
): CurriculumModule | undefined {
  return CURRICULUM_REGISTRY[slugOrId];
}

/**
 * Retrieves a specific curriculum lesson by module and lesson slug or id.
 */
export function getCurriculumLesson(
  moduleSlugOrId: string,
  lessonSlugOrId: string
): CurriculumLesson | undefined {
  const mod = getCurriculumModule(moduleSlugOrId);
  if (!mod) return undefined;

  const targetSlug = LESSON_SLUG_ALIASES[lessonSlugOrId] || lessonSlugOrId;

  return mod.lessons.find(
    (l) =>
      l.slug === targetSlug ||
      l.id === targetSlug ||
      l.slug === lessonSlugOrId ||
      l.id === lessonSlugOrId
  );
}
