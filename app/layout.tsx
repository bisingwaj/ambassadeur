import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { SITE } from "@/lib/site";
import "./globals.css";

// Identifiants de mesure d'audience / marketing. Configurables via env,
// sinon les valeurs fournies par la Coordination.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-JC3VFEC9CF";
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "1349940203756240";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-MQCVDT63";

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
      {GTM_ID && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      <body>
        {GTM_ID && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
          </noscript>
        )}
        {children}
      </body>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
      {FB_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img height="1" width="1" style={{ display: "none" }} alt=""
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`} />
          </noscript>
        </>
      )}
    </html>
  );
}
