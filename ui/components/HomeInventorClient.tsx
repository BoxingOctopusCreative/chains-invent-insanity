"use client";

import { useState } from "react";
import Controls from "@/components/Controls";
import { AnswerCard } from "@/components/AnswerCard";
import { QuestionCard } from "@/components/QuestionCard";

const PLACEHOLDER_ANSWER = "Pithy Answer Which Probably Doesn't Make Sense";
const PLACEHOLDER_QUESTION = "Pithy Question Which Probably Doesn't Make Sense";

export function HomeInventorClient() {
  const [answerTexts, setAnswerTexts] = useState<string[]>([PLACEHOLDER_ANSWER]);
  const [questionTexts, setQuestionTexts] = useState<string[]>([PLACEHOLDER_QUESTION]);

  return (
    <>
      <div className="min-w-0 lg:col-span-3">
        <Controls
          showBothOption
          onResult={(texts, cardType) => {
            if (cardType === "answer") {
              setAnswerTexts(texts.length ? texts : ["(No answer generated — try again.)"]);
            } else {
              setQuestionTexts(texts.length ? texts : ["(No question generated — try again.)"]);
            }
          }}
        />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch] pb-1 sm:pb-0 lg:col-span-5 lg:grid-cols-[minmax(225px,1fr)_minmax(225px,1fr)] lg:gap-x-3 lg:gap-y-0 lg:overflow-visible">
        <div className="min-w-0 space-y-4 sm:min-w-[225px]">
          {questionTexts.map((text, i) => (
            <QuestionCard key={`q-${i}`}>{text}</QuestionCard>
          ))}
        </div>
        <div className="min-w-0 space-y-4 sm:min-w-[225px]">
          {answerTexts.map((text, i) => (
            <AnswerCard key={`a-${i}`}>{text}</AnswerCard>
          ))}
        </div>
      </div>
    </>
  );
}
