/**
 * Browsers usually surface CORS, bad TLS, DNS, and offline as a generic TypeError: "Failed to fetch".
 * We classify what we can (mixed content, HTTPS + cross-origin) and add actionable hints.
 */

export type ApiFetchFailureCategory =
  | "mixed_content"
  | "tls_likely"
  | "cors_or_network"
  | "network";

export class ApiFetchError extends Error {
  readonly url: string;
  readonly hints: readonly string[];
  readonly category: ApiFetchFailureCategory;

  constructor(args: {
    url: string;
    message: string;
    category: ApiFetchFailureCategory;
    hints: string[];
    cause?: unknown;
  }) {
    super(args.message, { cause: args.cause });
    this.name = "ApiFetchError";
    this.url = args.url;
    this.hints = Object.freeze([...args.hints]);
    this.category = args.category;
  }
}

function isAbortError(e: unknown): boolean {
  return e instanceof DOMException
    ? e.name === "AbortError"
    : e instanceof Error && e.name === "AbortError";
}

/**
 * Build a rich error for failed fetches (no HTTP response). Call from `catch` after `fetch` rejects.
 */
export function analyzeFetchFailure(url: string, error: unknown): ApiFetchError {
  if (isAbortError(error)) {
    throw error;
  }

  const cause = error instanceof Error ? error : new Error(String(error));
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return new ApiFetchError({
      url,
      message: `Invalid API request URL: ${url}`,
      category: "network",
      hints: ["Check NEXT_PUBLIC_API_BASE and that the path is a full URL when required."],
      cause: error,
    });
  }

  const isHttps = u.protocol === "https:";
  const win = typeof window !== "undefined" ? window : undefined;
  const pageHttps = win?.isSecureContext === true && win.location.protocol === "https:";
  const pageOrigin = win?.location.origin ?? "";
  const crossOrigin = Boolean(
    pageOrigin && u.origin !== pageOrigin,
  );

  if (pageHttps && u.protocol === "http:") {
    return new ApiFetchError({
      url,
      message: "The browser blocked this request: the page is HTTPS but the API URL is HTTP (mixed content).",
      category: "mixed_content",
      hints: [
        "Set NEXT_PUBLIC_API_BASE to an https:// API URL, or in local dev use http:// for the UI as well (see Next dev server URL).",
      ],
      cause: error,
    });
  }

  const hints: string[] = [];

  if (isHttps) {
    hints.push(
      "TLS / certificate: Browsers do not expose cert errors to JavaScript, but an untrusted (e.g. self-signed or Traefik default) certificate often shows up only as “Failed to fetch.” Open your API base URL in a new tab, complete any certificate warning, then return here and try again. For production, use a publicly trusted certificate (e.g. Let’s Encrypt) or install your private CA in the system/browser trust store.",
    );
  } else {
    hints.push(
      "If the API host is only reachable on HTTPS, you may be pointing NEXT_PUBLIC_API_BASE at http://; try https:// and fix certificate trust as above.",
    );
  }

  if (crossOrigin) {
    hints.push(
      "CORS: If DevTools → Network shows the request without a normal response (or OPTIONS fails), configure the API so your UI origin is in CORS allowlists (CORS_ORIGINS / APP_ENV). A TLS failure can look similar: rule out the certificate first by visiting the API URL directly.",
    );
  } else {
    hints.push(
      "Same-origin or server-down: confirm the API process is running and the port/host in NEXT_PUBLIC_API_BASE matches how you start the server.",
    );
  }

  hints.push(
    "In DevTools → Network, inspect the failed request: no status (failed) leans to TLS, DNS, or connection; status 2xx/4xx/5xx with a console CORS error means fix Access-Control headers on the API or proxy.",
  );

  return new ApiFetchError({
    url,
    message: `Could not reach the API (${cause.message}).`,
    category: isHttps ? "tls_likely" : "cors_or_network",
    hints,
    cause: error,
  });
}

export function isConnectionError(error: unknown): boolean {
  if (error instanceof ApiFetchError) {
    return true;
  }
  const raw = error instanceof Error ? error.message : String(error);
  return /Failed to fetch|NetworkError|network|load failed|ECONNREFUSED/i.test(raw);
}

/**
 * Long-form message for logging (TLS/CORS hints, etc.).
 * The UI POSTs this to the Next server, which writes it to **process stderr** (see `sendClientErrorToStderr`).
 */
export function formatUserFacingApiError(error: unknown): string {
  if (error instanceof ApiFetchError) {
    return [error.message, ...error.hints].join("\n\n");
  }
  return error instanceof Error ? error.message : String(error);
}

/** Short copy for modals; full TLS/CORS hints are POSTed to the Next server and written to stderr. */
export const API_UNREACHABLE_USER_MESSAGE =
  "There was an error reaching the API. See your UI server’s stderr or container logs for details.";

/** Structured fields for `console.error` / logging. */
export function apiErrorDebugInfo(error: unknown): Record<string, unknown> {
  if (error instanceof ApiFetchError) {
    return {
      kind: "ApiFetchError",
      category: error.category,
      url: error.url,
      hints: [...error.hints],
    };
  }
  return { kind: "Error", message: String(error) };
}
