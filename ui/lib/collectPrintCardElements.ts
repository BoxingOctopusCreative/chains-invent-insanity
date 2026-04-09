/**
 * Order cards for print: when both question and answer lists are non-empty, interleave by index (Q0, A0, Q1, A1…).
 * Otherwise all questions first, then all answers.
 */
export function collectPrintCardSurfaces(
  questionTexts: string[],
  answerTexts: string[],
  questionWraps: (HTMLDivElement | null)[],
  answerWraps: (HTMLDivElement | null)[],
): HTMLElement[] {
  const surfaces: HTMLElement[] = [];
  const hasQ = questionTexts.some((t) => t.length > 0);
  const hasA = answerTexts.some((t) => t.length > 0);

  const pushQuestion = (i: number) => {
    const wrap = questionWraps[i];
    const el = wrap?.querySelector<HTMLElement>(".cah_card_inverted");
    if (el) surfaces.push(el);
  };
  const pushAnswer = (i: number) => {
    const wrap = answerWraps[i];
    const el = wrap?.querySelector<HTMLElement>(".cah_card");
    if (el) surfaces.push(el);
  };

  if (hasQ && hasA) {
    const n = Math.max(questionTexts.length, answerTexts.length);
    for (let i = 0; i < n; i++) {
      if (i < questionTexts.length) pushQuestion(i);
      if (i < answerTexts.length) pushAnswer(i);
    }
  } else {
    questionTexts.forEach((_, i) => pushQuestion(i));
    answerTexts.forEach((_, i) => pushAnswer(i));
  }

  return surfaces;
}
