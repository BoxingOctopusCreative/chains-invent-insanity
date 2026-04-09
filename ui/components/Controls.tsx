"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { fetchJson, getApiBase } from "@/lib/api";
import { parseInventorTexts } from "@/lib/inventorResponse";
import { PRINTABLE_CARDS_TOOLTIP } from "@/lib/printCardsPdf";

type FormState = {
  card_type: "answer" | "question" | "both";
  num_cards: string;
  attempts: string;
};

function isApiUnreachable(error: unknown): boolean {
  const raw = error instanceof Error ? error.message : String(error);
  return /Failed to fetch|NetworkError|network|load failed|ECONNREFUSED/i.test(raw);
}

function formatRequestError(error: unknown): string {
  if (isApiUnreachable(error)) {
    return "Could not connect to the API. Make sure the backend is running and NEXT_PUBLIC_API_BASE matches it (for local dev, http://localhost:8000 is typical).";
  }
  return error instanceof Error ? error.message : String(error);
}

const swalDark = {
  background: "#171717",
  color: "#f5f5f5",
  confirmButtonColor: "#525252",
};

/** Passed on each `onResult` call when card type is “Question & answer” (two API calls). */
export type OnResultOptions = {
  partOfBoth?: boolean;
};

export type ControlsProps = {
  /** Called with generated card text when the API returns successfully (`both` invokes twice: question then answer). */
  onResult?: (texts: string[], cardType: "answer" | "question", options?: OnResultOptions) => void;
  /** When true, adds a “Question & answer” mode that runs both endpoints together. */
  showBothOption?: boolean;
  /** Called after a successful generation (e.g. to trigger PDF upload + modal when printable cards are enabled). */
  onGenerationComplete?: () => void;
  /** Renders “Generate Printable Cards” below Attempts (e.g. invent page PDF export). */
  printableCards?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** Overrides default tooltip copy (native `title` on the info control). */
    tooltip?: string;
  };
};

export default function Controls({
  onResult,
  showBothOption = false,
  onGenerationComplete,
  printableCards,
}: ControlsProps) {
  const [formData, setFormData] = useState<FormState>({
    card_type: "answer",
    num_cards: "1",
    attempts: "10000",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "card_type") {
      setFormData((prev) => ({ ...prev, card_type: value as FormState["card_type"] }));
    } else if (name === "num_cards") {
      setFormData((prev) => ({ ...prev, num_cards: value }));
    } else if (name === "attempts") {
      setFormData((prev) => ({ ...prev, attempts: value }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { card_type, num_cards, attempts } = formData;
    const params = new URLSearchParams({
      num_cards,
      attempts,
    });
    const base = getApiBase();
    try {
      if (card_type === "both") {
        const [qData, aData] = await Promise.all([
          fetchJson<unknown>(`${base}/api/v1/question?${params}`),
          fetchJson<unknown>(`${base}/api/v1/answer?${params}`),
        ]);
        const qTexts = parseInventorTexts(qData);
        const aTexts = parseInventorTexts(aData);
        onResult?.(qTexts, "question", { partOfBoth: true });
        onResult?.(aTexts, "answer", { partOfBoth: true });
      } else {
        const url = `${base}/api/v1/${card_type}?${params}`;
        const data = await fetchJson<unknown>(url);
        const texts = parseInventorTexts(data);
        onResult?.(texts, card_type);
      }
      if (printableCards?.checked) {
        onGenerationComplete?.();
      }
    } catch (e: unknown) {
      if (isApiUnreachable(e)) {
        console.error("[Chains Invent Insanity] API unreachable", { base, card_type, error: e });
      }
      await Swal.fire({
        icon: "error",
        title: "API error",
        text: formatRequestError(e),
        ...swalDark,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <h2 className="section-title text-2xl font-bold">Options</h2>
      <div>
        <label htmlFor="num_cards" className="mb-1 block font-bold">
          Number of Cards
        </label>
        <input
          id="num_cards"
          name="num_cards"
          type="number"
          min={1}
          placeholder="1"
          value={formData.num_cards}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded border border-gray-500 bg-black px-3 py-2 text-white disabled:opacity-60"
        />
        <p className="mt-1 text-sm text-gray-400">
          Number of cards to generate
          {showBothOption && formData.card_type === "both" ? " (each for question and answer)." : "."}
        </p>
      </div>
      <div>
        <label htmlFor="card_type" className="mb-1 block font-bold">
          Card type
        </label>
        <select
          id="card_type"
          name="card_type"
          value={formData.card_type}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded border border-gray-500 bg-black px-3 py-2 text-white disabled:opacity-60"
        >
          <option value="question">Question</option>
          <option value="answer">Answer</option>
          {showBothOption ? <option value="both">Question & answer</option> : null}
        </select>
      </div>
      <div>
        <label htmlFor="attempts" className="mb-1 block font-bold">
          Attempts
        </label>
        <input
          id="attempts"
          name="attempts"
          type="number"
          min={1000}
          placeholder="10000"
          value={formData.attempts}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded border border-gray-500 bg-black px-3 py-2 text-white disabled:opacity-60"
        />
        <p className="mt-1 text-sm text-gray-400">Number of attempts to generate valid cards each time</p>
      </div>
      {printableCards ? (
        <div className="flex items-start gap-2">
          <input
            id="printable-cards"
            name="printable_cards"
            type="checkbox"
            checked={printableCards.checked}
            onChange={(e) => printableCards.onChange(e.target.checked)}
            disabled={loading}
            className="mt-1 h-4 w-4 shrink-0 rounded border border-gray-500 bg-black disabled:opacity-60"
          />
          <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm text-gray-300">
            <label htmlFor="printable-cards" className="cursor-pointer font-bold">
              Generate Printable Cards
            </label>
            <span
              className="inline-flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full border border-gray-600 text-xs font-bold leading-none text-gray-500 hover:border-gray-500 hover:text-gray-400"
              title={printableCards.tooltip ?? PRINTABLE_CARDS_TOOLTIP}
              aria-label={printableCards.tooltip ?? PRINTABLE_CARDS_TOOLTIP}
            >
              <span aria-hidden="true">i</span>
            </span>
          </div>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-gray-500 px-3 py-2.5 text-center text-sm font-bold text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-4 sm:text-base"
      >
        {loading ? "Working…" : "Invent ALL THE INSANITY!!"}
      </button>
    </form>
  );
}
