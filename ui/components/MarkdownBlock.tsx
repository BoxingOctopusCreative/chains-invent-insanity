"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type MarkdownVariant = "onDark" | "onLight";

const variantClass: Record<MarkdownVariant, string> = {
  onDark:
    "prose prose-invert max-w-none prose-headings:font-bold prose-p:font-bold prose-p:text-left prose-p:text-sm sm:prose-p:text-base [&_h1]:text-xl [&_h2]:text-lg sm:[&_h1]:text-2xl sm:[&_h2]:text-xl",
  onLight:
    "prose prose-neutral max-w-none prose-headings:font-bold prose-p:font-bold text-black prose-p:text-sm sm:prose-p:text-base [&_h1]:text-lg [&_h2]:text-base sm:[&_h1]:text-xl sm:[&_h2]:text-lg",
};

type MarkdownBlockProps = {
  markdown: string;
  variant: MarkdownVariant;
  className?: string;
};

export function MarkdownBlock({ markdown, variant, className = "" }: MarkdownBlockProps) {
  return (
    <div className={`${variantClass[variant]} ${className}`.trim()}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
