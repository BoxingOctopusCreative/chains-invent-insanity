import Script from "next/script";

const baseUrl = process.env.NEXT_PUBLIC_UMAMI_URL?.replace(/\/$/, "");
const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

/**
 * Loads the Umami analytics script. Set NEXT_PUBLIC_UMAMI_URL and NEXT_PUBLIC_UMAMI_WEBSITE_ID
 * (from your Umami site settings). Omit either to disable analytics.
 */
export function UmamiScript() {
  if (!baseUrl || !websiteId) {
    return null;
  }

  return (
    <Script
      src={`${baseUrl}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
