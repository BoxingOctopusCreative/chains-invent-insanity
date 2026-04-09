import fs from "node:fs";
import path from "node:path";

const contentDir = path.join(process.cwd(), "content");

/** Load markdown from `content/<name>.md`. Server-only (uses filesystem). */
export function getMarkdown(name: string): string {
  const filePath = path.join(contentDir, `${name}.md`);
  return fs.readFileSync(filePath, "utf8");
}
