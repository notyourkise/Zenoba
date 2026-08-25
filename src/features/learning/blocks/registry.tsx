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
import { QuizBlockPlayer } from "@/features/quiz/components/quiz-block-player";
import { FallbackBlock } from "./components/fallback-block";

// Registry of Block Components
export const BLOCK_COMPONENTS: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ComponentType<{ block: any }>
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
};

export function renderLessonBlock(block: LessonBlock, index?: number): React.ReactNode {
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
