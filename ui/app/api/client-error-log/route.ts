import { NextResponse } from "next/server";

const MAX_LEN = 24_000;

/**
 * Accepts client-side error reports and writes them to the Node process stderr
 * (e.g. visible in `docker logs`, systemd journal, or the terminal running `next dev`).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const line =
    typeof body === "string"
      ? body.slice(0, MAX_LEN)
      : JSON.stringify(body).slice(0, MAX_LEN);
  process.stderr.write(`[chains-invent-insanity][client-error] ${line}\n`);

  return new NextResponse(null, { status: 204 });
}
