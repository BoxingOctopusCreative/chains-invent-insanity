export type ClientErrorLogPayload = {
  source: string;
  /** Long-form message (e.g. TLS/CORS hints). */
  detail: string;
  meta?: Record<string, unknown>;
};

/**
 * Sends an error payload to the Next.js server, which logs a single line to **process stderr**.
 * The browser cannot write to the host’s stderr directly; this uses a same-origin POST.
 * Fails silently if the request cannot complete (offline, static-only deploy, etc.).
 */
export function sendClientErrorToStderr(payload: ClientErrorLogPayload): void {
  if (typeof window === "undefined") {
    return;
  }
  const body = JSON.stringify({
    ...payload,
    href: window.location.href,
    userAgent: navigator.userAgent,
  });
  void fetch("/api/client-error-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
