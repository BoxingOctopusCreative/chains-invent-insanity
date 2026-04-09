/** Base URL for the Flask API (no trailing slash). */
export function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
}

/** Base URL of the standalone Swagger UI (no trailing slash). Matches dev-docker-compose `swagger-ui` on port 8080. */
export function getSwaggerUiUrl(): string {
  return (process.env.NEXT_PUBLIC_SWAGGER_UI_URL ?? "http://localhost:8080").replace(/\/$/, "");
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
