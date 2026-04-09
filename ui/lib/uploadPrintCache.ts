import { getApiBase } from "@/lib/api";

export type PrintCacheUploadResponse = {
  id: string;
  downloadPath: string;
  /** Present when the API mirrors the file to S3 (PRINT_CACHE_S3_ENABLED). */
  downloadUrl?: string;
};

/**
 * POST the generated PDF to the API; it is stored under the server print-cache directory.
 */
export async function uploadPdfToPrintCache(blob: Blob): Promise<PrintCacheUploadResponse> {
  const base = getApiBase();
  const fd = new FormData();
  fd.append("file", blob, "chains-invent-cards.pdf");
  const res = await fetch(`${base}/api/v1/print-cache`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const snippet = (await res.text()).slice(0, 200);
    throw new Error(`Upload failed: ${res.status} ${snippet}`);
  }
  return res.json() as Promise<PrintCacheUploadResponse>;
}

export function absoluteUrlFromApiPath(path: string): string {
  const base = getApiBase().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Prefer S3 (or other absolute) URL from the API when provided. */
export function resolveDownloadUrl(res: PrintCacheUploadResponse): string {
  const u = res.downloadUrl?.trim();
  if (u) return u;
  return absoluteUrlFromApiPath(res.downloadPath);
}
