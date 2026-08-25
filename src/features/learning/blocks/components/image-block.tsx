import React from "react";
import { z } from "zod";
import { ImageBlockSchema } from "../schema";

type ImageBlockProps = {
  block: z.infer<typeof ImageBlockSchema>;
};

export function ImageBlock({ block }: ImageBlockProps) {
  return (
    <figure className="my-6 space-y-2 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={block.src}
        alt={block.alt}
        className="rounded-xl border border-gray-200 dark:border-gray-800 mx-auto max-h-96 object-cover shadow-sm"
      />
      {block.caption && (
        <figcaption className="text-xs text-gray-500 dark:text-gray-400 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
