"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { getSwaggerUiUrl } from "@/lib/api";
import { MarkdownBlock } from "@/components/MarkdownBlock";

const iconSrc =
  "https://ci2-assets.chainsinventinsanity.lol/images/Icon%20Black.png";

type NavigationProps = {
  instructionsMarkdown: string;
};

const navLinkClass = "block w-full rounded px-2 py-2 text-left text-white no-underline hover:bg-white/10 md:inline md:w-auto md:py-0 md:hover:bg-transparent md:hover:opacity-80";

export default function Navigation({ instructionsMarkdown }: NavigationProps) {
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const apiDocsUrl = getSwaggerUiUrl();

  useEffect(() => {
    startTransition(() => {
      setMenuOpen(false);
    });
  }, [pathname]);

  return (
    <>
      {instructionsOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="instructions-title"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-4 text-black shadow-xl sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 id="instructions-title" className="sr-only">
                Instructions
              </h3>
              <button
                type="button"
                className="ml-auto shrink-0 rounded bg-gray-200 px-3 py-1 text-sm font-bold text-black hover:bg-gray-300"
                onClick={() => setInstructionsOpen(false)}
              >
                Close
              </button>
            </div>
            <MarkdownBlock markdown={instructionsMarkdown} variant="onLight" />
          </div>
        </div>
      )}

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-800/80 bg-black/95 backdrop-blur-sm">
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
          <Link href="/" className="flex shrink-0 items-center" onClick={() => setMenuOpen(false)}>
            <Image
              src={iconSrc}
              width={50}
              height={50}
              className="navbar-brand-logo h-9 w-9 sm:h-auto sm:w-[50px]"
              alt="Chains Invent Insanity"
              unoptimized
            />
          </Link>

          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-white hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="site-nav-links"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="text-2xl leading-none" aria-hidden>
              {menuOpen ? "×" : "☰"}
            </span>
          </button>

          <div
            id="site-nav-links"
            className={
              menuOpen
                ? "absolute left-0 right-0 top-full z-50 flex max-h-[min(70vh,calc(100dvh-3.5rem))] flex-col gap-1 overflow-y-auto border-b border-gray-800 bg-black px-3 py-3 shadow-lg md:static md:ml-auto md:max-h-none md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-x-3 md:gap-y-2 md:overflow-visible md:border-0 md:bg-transparent md:p-0 md:shadow-none lg:gap-x-4"
                : "hidden md:ml-auto md:flex md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-x-3 md:gap-y-2 lg:gap-x-4"
            }
          >
            <Link href="/" className={`${navLinkClass} text-lg font-bold md:text-2xl lg:text-4xl`}>
              Home
            </Link>
            <Link href="/about" className={`${navLinkClass} text-lg font-bold md:text-2xl lg:text-4xl`}>
              Why??
            </Link>
            <button
              type="button"
              className={`${navLinkClass} text-lg font-bold md:text-2xl lg:text-4xl`}
              onClick={() => {
                setInstructionsOpen(true);
                setMenuOpen(false);
              }}
            >
              Instructions
            </button>
            <Link href="/invent" className={`${navLinkClass} text-lg font-bold md:text-2xl lg:text-4xl`}>
              Invent
            </Link>
            <Link href="/grid" className={`${navLinkClass} text-lg font-bold md:text-2xl lg:text-4xl`}>
              Card Test
            </Link>
            <a
              href={apiDocsUrl}
              target="_blank"
              rel="noreferrer"
              className={`${navLinkClass} text-lg font-bold md:text-2xl lg:text-4xl`}
            >
              API
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
