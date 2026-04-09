"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Controls from "@/components/Controls";
import { AnswerCard } from "@/components/AnswerCard";
import { QuestionCard } from "@/components/QuestionCard";
import { collectPrintCardSurfaces } from "@/lib/collectPrintCardElements";
import { buildCardsPdfBlob } from "@/lib/printCardsPdf";
import { resolveDownloadUrl, uploadPdfToPrintCache } from "@/lib/uploadPrintCache";

const PLACEHOLDER = "pithy phrase here";

const swalDark = {
  background: "#171717",
  color: "#f5f5f5",
  confirmButtonColor: "#525252",
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function normalize(texts: string[], kind: "question" | "answer"): string[] {
  return texts.length ? texts : [`(No ${kind} generated — try again.)`];
}

export function InventPageClient() {
  const [questionTexts, setQuestionTexts] = useState<string[]>([]);
  const [answerTexts, setAnswerTexts] = useState<string[]>([PLACEHOLDER]);
  const [printablePdf, setPrintablePdf] = useState(false);

  const questionTextsRef = useRef(questionTexts);
  const answerTextsRef = useRef(answerTexts);
  useEffect(() => {
    questionTextsRef.current = questionTexts;
    answerTextsRef.current = answerTexts;
  }, [questionTexts, answerTexts]);

  const questionWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const answerWrapRefs = useRef<(HTMLDivElement | null)[]>([]);

  const runPrintPdf = useCallback(async () => {
    try {
      const surfaces = collectPrintCardSurfaces(
        questionTextsRef.current,
        answerTextsRef.current,
        questionWrapRefs.current,
        answerWrapRefs.current,
      );
      if (surfaces.length === 0) {
        await Swal.fire({
          icon: "info",
          title: "Nothing to print",
          text: "Generate at least one card before creating a PDF.",
          ...swalDark,
        });
        return;
      }
      const blob = await buildCardsPdfBlob(surfaces);
      const upload = await uploadPdfToPrintCache(blob);
      const href = resolveDownloadUrl(upload);
      const safeHref = escapeHtml(href);
      await Swal.fire({
        title: "PDF ready",
        html: `<p class="text-left text-gray-300">Your printable cards are on the server.</p>
<p class="mt-3"><a href="${safeHref}" class="font-bold text-white underline" download target="_blank" rel="noreferrer">Download PDF</a></p>`,
        icon: "success",
        ...swalDark,
      });
    } catch (e: unknown) {
      console.error("[Chains Invent Insanity] PDF export failed", e);
      await Swal.fire({
        icon: "error",
        title: "PDF export failed",
        text: e instanceof Error ? e.message : String(e),
        ...swalDark,
      });
    }
  }, []);

  return (
    <>
      <div className="min-w-0 lg:col-span-3">
        <Controls
          showBothOption
          printableCards={{
            checked: printablePdf,
            onChange: setPrintablePdf,
          }}
          onGenerationComplete={
            printablePdf
              ? () => {
                  window.setTimeout(() => void runPrintPdf(), 150);
                }
              : undefined
          }
          onResult={(texts, cardType, opts) => {
            if (opts?.partOfBoth) {
              if (cardType === "question") {
                setQuestionTexts(normalize(texts, "question"));
              } else {
                setAnswerTexts(normalize(texts, "answer"));
              }
            } else if (cardType === "question") {
              setQuestionTexts(normalize(texts, "question"));
              setAnswerTexts([]);
            } else {
              setAnswerTexts(normalize(texts, "answer"));
              setQuestionTexts([]);
            }
          }}
        />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch] pb-1 sm:pb-0 lg:col-span-9 lg:grid-cols-[minmax(225px,1fr)_minmax(225px,1fr)] lg:gap-x-3 lg:gap-y-0 lg:items-start lg:overflow-visible">
        <div className="min-w-0 space-y-4 sm:min-w-[225px]">
          {questionTexts.map((text, i) => (
            <div
              key={`q-${i}`}
              ref={(el) => {
                questionWrapRefs.current[i] = el;
              }}
            >
              <QuestionCard>{text}</QuestionCard>
            </div>
          ))}
        </div>
        <div className="min-w-0 space-y-4 sm:min-w-[225px]">
          {answerTexts.map((text, i) => (
            <div
              key={`a-${i}`}
              ref={(el) => {
                answerWrapRefs.current[i] = el;
              }}
            >
              <AnswerCard>{text}</AnswerCard>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
