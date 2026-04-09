/** Shape returned by GET /api/v1/answer and /api/v1/question (key is always `answer`). */
export type InventorApiPayload = {
  answer: string | string[] | null;
};

export function parseInventorTexts(data: unknown): string[] {
  if (data === null || typeof data !== "object" || !("answer" in data)) {
    return [];
  }
  const raw = (data as InventorApiPayload).answer;
  if (raw == null) {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw.filter((s): s is string => typeof s === "string");
  }
  if (typeof raw === "string") {
    return [raw];
  }
  return [];
}
