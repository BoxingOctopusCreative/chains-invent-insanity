/**
 * Real-world CAH-style dimensions: 2.5" × 3.5" (matches UI aspect ratio 225×315 px).
 */
export const CARD_WIDTH_IN = 2.5;
export const CARD_HEIGHT_IN = 3.5;
export const LETTER_WIDTH_IN = 8.5;
export const LETTER_HEIGHT_IN = 11;

/** Shown in the UI tooltip next to “Generate Printable Cards”. */
export const PRINTABLE_CARDS_TOOLTIP =
  'After a successful generation, uploads a PDF to the server and shows a download link. Cards are drawn at 2.5" × 3.5" on US Letter (8.5" × 11") pages.';

const MARGIN_IN = 0.5;
const GAP_IN = 0.125;

function computeGrid(innerW: number, innerH: number): { maxCols: number; maxRows: number; perPage: number } {
  const maxCols = Math.max(1, Math.floor((innerW + GAP_IN) / (CARD_WIDTH_IN + GAP_IN)));
  const maxRows = Math.max(1, Math.floor((innerH + GAP_IN) / (CARD_HEIGHT_IN + GAP_IN)));
  return { maxCols, maxRows, perPage: maxCols * maxRows };
}

function waitForImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll("img"));
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve();
            return;
          }
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  ).then(() => undefined);
}

/**
 * Rasterize DOM card nodes and lay them out on US Letter pages at true card size.
 * Returns a PDF blob for upload or download.
 */
export async function buildCardsPdfBlob(cardElements: HTMLElement[]): Promise<Blob> {
  if (cardElements.length === 0) {
    throw new Error("No card elements to render");
  }

  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")]);

  const pdf = new jsPDF({ unit: "in", format: "letter", orientation: "portrait" });
  const innerW = LETTER_WIDTH_IN - 2 * MARGIN_IN;
  const innerH = LETTER_HEIGHT_IN - 2 * MARGIN_IN;
  const { maxCols, perPage } = computeGrid(innerW, innerH);

  const captureCard = async (el: HTMLElement): Promise<HTMLCanvasElement> => {
    const base = {
      scale: 2,
      useCORS: true,
      backgroundColor: null as string | null,
      logging: false,
    };
    try {
      return await html2canvas(el, { ...base, allowTaint: false });
    } catch {
      return await html2canvas(el, { ...base, allowTaint: true });
    }
  };

  for (let i = 0; i < cardElements.length; i++) {
    if (i > 0 && i % perPage === 0) {
      pdf.addPage();
    }
    const local = i % perPage;
    const col = local % maxCols;
    const row = Math.floor(local / maxCols);
    const x = MARGIN_IN + col * (CARD_WIDTH_IN + GAP_IN);
    const y = MARGIN_IN + row * (CARD_HEIGHT_IN + GAP_IN);

    await waitForImages(cardElements[i]);
    const canvas = await captureCard(cardElements[i]);
    let imgData: string;
    try {
      imgData = canvas.toDataURL("image/png");
    } catch {
      const canvas2 = await html2canvas(cardElements[i], {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      imgData = canvas2.toDataURL("image/png");
    }
    pdf.addImage(imgData, "PNG", x, y, CARD_WIDTH_IN, CARD_HEIGHT_IN);
  }

  return pdf.output("blob");
}
