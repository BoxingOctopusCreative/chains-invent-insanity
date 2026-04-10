const PROD_API_BASE = "https://api.chainsinventinsanity.lol";
const DEV_API_BASE = "http://localhost:8000";
const DEV_SWAGGER_UI_URL = "http://localhost:8080";
/** OpenAPI spec URL when not using local Swagger UI (production default). */
const PROD_OPENAPI_SPEC_URL = `${PROD_API_BASE}/openapi.yaml`;
const PROD_SWAGGER_UI_URL = "https://swagger.chainsinventinsanity.lol";

function appEnv(): "production" | "development" {
  const v = (process.env.NEXT_PUBLIC_APP_ENV ?? "dev").toLowerCase();
  if (v === "production" || v === "prod") return "production";
  if (v === "development" || v === "dev") return "development";
  return "development";
}

/** Base URL for the Flask API (no trailing slash). Override with NEXT_PUBLIC_API_BASE if needed. */
export function getApiBase(): string {
  const override = process.env.NEXT_PUBLIC_API_BASE?.trim();
  if (override) {
    return override.replace(/\/$/, "");
  }
  return appEnv() === "production" ? PROD_API_BASE : DEV_API_BASE;
}

/**
 * API docs link: local Swagger UI in development; hosted OpenAPI spec in production unless overridden.
 * Override with NEXT_PUBLIC_SWAGGER_UI_URL.
 */
export function getSwaggerUiUrl(): string {
  const override = process.env.NEXT_PUBLIC_SWAGGER_UI_URL?.trim();
  if (override) {
    return override.replace(/\/$/, "");
  }
  return appEnv() === "production" ? PROD_SWAGGER_UI_URL : DEV_SWAGGER_UI_URL;
}

/**
 * JSON GET/POST/etc. via the standard Fetch API (no axios).
 * Throws if the response is not OK or body is not JSON.
 */
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const snippet = (await res.text()).slice(0, 200);
    throw new Error(`Request failed: ${res.status} ${res.statusText}${snippet ? ` — ${snippet}` : ""}`);
  }

  return res.json() as Promise<T>;
}
