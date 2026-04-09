/**
 * Same-origin assets so html2canvas can rasterize them into PDFs (remote CDN PNGs often
 * taint the canvas and disappear in exports).
 */
const LOGO_BLACK = "/brand/logo-black.png";
const LOGO_WHITE = "/brand/logo-white.png";

/**
 * Bottom-aligned Chains Invent Insanity wordmark on printable-style cards.
 * Answer face is the light card; question face is the dark (inverted) card.
 */
export function CardLogo({ variant }: { variant: "answer" | "question" }) {
  const src = variant === "answer" ? LOGO_WHITE : LOGO_BLACK;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="cahlogo max-w-[70%] h-auto w-auto px-2 pl-2 pb-2"
      aria-hidden
    />
  );
}
