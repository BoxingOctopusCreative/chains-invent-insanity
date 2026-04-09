"use client";

import React, { useState, type CSSProperties, type FormEvent } from "react";
import { fetchJson, getApiBase } from "@/lib/api";

type GridRecord = {
  id?: string | number;
  image?: string;
  title?: string;
  description?: string;
};

type GridItem = string | GridRecord;

function toGridItems(data: unknown): GridItem[] {
  if (Array.isArray(data)) {
    return data as GridItem[];
  }
  return [data as GridItem];
}

export default function CardGrid() {
  const [cardType, setCardType] = useState("");
  const [results, setResults] = useState<GridItem[]>([]);
  const [itemsPerRow, setItemsPerRow] = useState(4);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const base = getApiBase();
    const path = encodeURIComponent(cardType);
    try {
      const data = await fetchJson<unknown>(
        `${base}/api/v1/${path}?num_cards=1&attempts=10000`,
      );
      setResults(toGridItems(data));
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${itemsPerRow || 4}, minmax(0, 1fr))`,
    gap: "10px",
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-black">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border border-gray-600 bg-gray-200 p-4 text-black sm:p-6"
      >
        <div className="flex flex-col gap-2">
          <label className="block font-bold sm:inline sm:space-x-2">
            <span className="mb-1 block sm:mb-0 sm:inline">Card type (e.g. answer, question):</span>
            <input
              type="text"
              value={cardType}
              onChange={(event) => setCardType(event.target.value)}
              className="mt-1 w-full rounded border border-gray-500 px-2 py-2 sm:mt-0 sm:w-auto sm:min-w-[12rem]"
            />
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <label className="block font-bold sm:inline sm:space-x-2">
            <span className="mb-1 block sm:mb-0 sm:inline">Items per row:</span>
            <input
              type="number"
              min={1}
              value={itemsPerRow}
              onChange={(event) => setItemsPerRow(parseInt(event.target.value, 10) || 4)}
              className="mt-1 w-full rounded border border-gray-500 px-2 py-2 sm:mt-0 sm:w-24"
            />
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded bg-gray-600 px-4 py-2.5 font-bold text-white hover:bg-gray-700 sm:w-auto"
        >
          Fetch
        </button>
      </form>
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch] pb-1">
        <div className="min-w-0" style={gridStyle}>
          {results.map((result, index) => (
            <GridResult key={gridKey(result, index)} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
}

function gridKey(result: GridItem, index: number): string | number {
  if (typeof result === "object" && result !== null && result.id != null) {
    return result.id;
  }
  return index;
}

function GridResult({ result }: { result: GridItem }) {
  if (typeof result === "string") {
    return (
      <div className="rounded border border-gray-500 bg-white p-3 text-sm">
        <p>{result}</p>
      </div>
    );
  }

  const r = result;
  const showJsonFallback =
    r.image == null && r.title == null && r.description == null;

  return (
    <div className="rounded border border-gray-500 bg-white p-3 text-sm">
      {r.image != null && (
        // eslint-disable-next-line @next/next/no-img-element -- dynamic API URLs
        <img src={r.image} alt={r.title ?? ""} className="mb-2 max-h-40 w-full object-contain" />
      )}
      {r.title != null && <h3 className="font-bold">{r.title}</h3>}
      {r.description != null && <p>{r.description}</p>}
      {showJsonFallback && <pre className="overflow-auto text-xs">{JSON.stringify(r, null, 2)}</pre>}
    </div>
  );
}
