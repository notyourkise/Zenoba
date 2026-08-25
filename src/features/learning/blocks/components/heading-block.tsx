import React from "react";
import { z } from "zod";
import { HeadingBlockSchema } from "../schema";

type HeadingBlockProps = {
  block: z.infer<typeof HeadingBlockSchema>;
};

export function HeadingBlock({ block }: HeadingBlockProps) {
  const { level, text } = block;

  switch (level) {
    case 1:
      return (
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-8 mb-4 tracking-tight">
          {text}
        </h1>
      );
    case 2:
      return (
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3 tracking-tight border-b border-gray-100 dark:border-gray-800 pb-2">
          {text}
        </h2>
      );
    case 3:
      return (
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-5 mb-2">
          {text}
        </h3>
      );
    case 4:
      return (
        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
          {text}
        </h4>
      );
    default:
      return <h2 className="text-xl font-bold text-gray-900 dark:text-white">{text}</h2>;
  }
}
