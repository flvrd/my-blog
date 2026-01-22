import React from "react";
import { BlockRenderer } from "./Blockrenderer";

interface ArticleViewerProps {
  blocks: any[];
}

export default function ArticleViewer({ blocks }: ArticleViewerProps) {
  if (!blocks) {
    return <div className="p-4 text-gray-500">No content found.</div>;
  }

  return (
    // Added 'dark:prose-invert' to auto-whiten text in dark mode
    <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
      <div className="flex flex-col gap-4">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </article>
  );
}
