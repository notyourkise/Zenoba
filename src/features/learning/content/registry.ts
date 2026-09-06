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
};

/**
 * Legacy lesson slug alias mappings for backward compatibility.
 */
const LESSON_SLUG_ALIASES: Record<string, string> = {
  "binary-fundamentals": "biner-8-bit",
  "subnet-calculator-lab": "network-broadcast",
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
