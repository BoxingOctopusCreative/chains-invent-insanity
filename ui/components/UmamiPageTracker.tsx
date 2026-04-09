"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Fires a pageview on client-side navigations (Next.js App Router does not reload the page).
 * The Umami script’s default auto-track handles the initial full load; we skip the first effect
 * run to avoid double-counting that view.
 */
export function UmamiPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.umami?.track();
  }, [pathname, searchParams]);

  return null;
}
