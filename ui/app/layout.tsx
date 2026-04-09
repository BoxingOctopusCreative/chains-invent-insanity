import type { Metadata, Viewport } from "next";
import { Suspense, type ReactNode } from "react";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { getMarkdown } from "@/lib/content";
import { UmamiScript } from "@/components/Umami";
import { UmamiPageTracker } from "@/components/UmamiPageTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://chainsinventinsanity.com"),
  title: "Chains Invent Insanity",
  description: "Cards Against Humanity Generator",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "https://ci2-assets.chainsinventinsanity.lol/images/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const instructionsMarkdown = getMarkdown("instructions");

  return (
    <html lang="en">
      <body className="min-h-screen bg-black pb-24 pt-[4.5rem] text-white sm:pb-28 sm:pt-24">
        <UmamiScript />
        <Suspense fallback={null}>
          <UmamiPageTracker />
        </Suspense>
        <Navigation instructionsMarkdown={instructionsMarkdown} />
        <main className="mx-auto w-full max-w-[1400px] px-3 sm:px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
