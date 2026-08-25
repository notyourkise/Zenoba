import React from "react";
import { LessonBlock } from "./schema";
import { HeadingBlock } from "./components/heading-block";
import { TextBlock } from "./components/text-block";
import { CalloutBlock } from "./components/callout-block";
import { CodeBlock } from "./components/code-block";
import { ImageBlock } from "./components/image-block";
import { LottieBlock } from "./components/lottie-block";
import { DiagramBlock } from "./components/diagram-block";
import { SummaryBlock } from "./components/summary-block";
import { RewardBlock } from "./components/reward-block";
import { TopologyExplorer } from "./components/topology-explorer";
import { DeviceCard } from "./components/device-card";
import { PacketFlow } from "./components/packet-flow";
import { CableOrderExercise } from "./components/cable-order-exercise";
import { OSIStack } from "./components/osi-stack";
import { EncapsulationVisualizer } from "./components/encapsulation-visualizer";
import { QuizBlockPlayer } from "@/features/quiz/components/quiz-block-player";
import { FallbackBlock } from "./components/fallback-block";

// Registry of Block Components
export const BLOCK_COMPONENTS: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ComponentType<any>
> = {
  heading: HeadingBlock,
  text: TextBlock,
  callout: CalloutBlock,
  code: CodeBlock,
  image: ImageBlock,
  lottie: LottieBlock,
  diagram: DiagramBlock,
  summary: SummaryBlock,
  reward: RewardBlock,
  quiz: QuizBlockPlayer,
  topology_explorer: TopologyExplorer,
  device_card: DeviceCard,
  packet_flow: PacketFlow,
  cable_order: CableOrderExercise,
  osi_stack: OSIStack,
  encapsulation: EncapsulationVisualizer,
};

export function renderLessonBlock(block: LessonBlock, index?: number): React.ReactNode {
  // Check if interactive block specifies interactiveType
  if (block.type === "interactive" && (block as any).interactiveType) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const interactiveType = (block as any).interactiveType; // eslint-disable-line @typescript-eslint/no-explicit-any
    const InteractiveComponent = BLOCK_COMPONENTS[interactiveType];
    if (InteractiveComponent) {
      return <InteractiveComponent key={block.id || `interactive-${index}`} block={block} />;
    }
  }

  const Component = BLOCK_COMPONENTS[block.type];

  if (!Component) {
    return (
      <FallbackBlock
        key={block.id || `fallback-${index}`}
        blockType={block.type}
        error={`Tipe blok '${block.type}' belum didukung dalam renderer ini.`}
      />
    );
  }

  return <Component key={block.id || `block-${block.type}-${index}`} block={block} />;
}
