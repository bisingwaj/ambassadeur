import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE } from "@/lib/site";
import "./globals.css";

// Polices auto-hébergées (offline-safe, rapides, sans requête tierce).
const schibsted = localFont({
  src: [{ path: "../public/fonts/SchibstedGrotesk-latin.woff2", weight: "400 900", style: "normal" }],
  variable: "--font-schibsted",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const plexMono = localFont({
  src: [
    { path: "../public/fonts/IBMPlexMono-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/IBMPlexMono-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/IBMPlexMono-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const viewport: Viewport = {
  themeColor: "#2E6AE0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Ambassadeurs Communautaires · Cohorte 01 Kinshasa`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Étoile Bleue", "199", "urgence médicale", "Kinshasa", "RDC",
    "ambassadeurs communautaires", "premiers secours", "santé publique",
  ],
  authors: [{ name: SITE.ministere }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Le 199, le bon réflexe.`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Ambassadeurs Communautaires`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${schibsted.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
