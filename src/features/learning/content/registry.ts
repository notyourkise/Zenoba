import { clientServerModuleData } from "./network-foundations/client-server";
import { networkDevicesModuleData } from "./network-foundations/devices";
import { howDataTravelsModuleData } from "./network-foundations/how-data-travels";
import { physicalMediaCablingModuleData } from "./network-foundations/media-cabling";
import { osiTcpipModuleData } from "./network-foundations/osi-tcpip";
import { topologyModuleData } from "./network-foundations/topology";
import { typesOfNetworksModuleData } from "./network-foundations/types-of-networks";
import { welcomeModuleData } from "./network-foundations/welcome";
import type { CurriculumLesson, CurriculumModule } from "./schema";

/**
 * Registry of authoritative curriculum definitions.
 * Provides rich outcomes, evidence links, and lesson blocks.
 */
const CURRICULUM_REGISTRY: Record<string, CurriculumModule> = {
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
  return mod.lessons.find(
    (l) => l.slug === lessonSlugOrId || l.id === lessonSlugOrId
  );
}
