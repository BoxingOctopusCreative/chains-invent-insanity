import { getMarkdown } from "@/lib/content";
import { MarkdownBlock } from "@/components/MarkdownBlock";

export function Explainer() {
  return <MarkdownBlock markdown={getMarkdown("why")} variant="onDark" />;
}
