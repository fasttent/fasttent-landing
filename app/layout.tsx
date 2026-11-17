import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import { meta, siteUrl, jsonLd, faqSection } from "@/content";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import CookieConsent from "@/components/CookieConsent";
import { isConsentRequiredCountry } from "@/lib/geo";

// Google Ads (gtag.js) — тег відстеження конверсій клієнта
const GTAG_ID = "AW-16805820064";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: meta.ogTitle,
    description: meta.ogDescription,
    url: siteUrl + "/",
    locale: "uk_UA",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: meta.ogTitle,
    description: meta.ogDescription,
    images: ["/assets/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/assets/favicon.ico?v=2" },
      { url: "/assets/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/assets/favicon-180.png?v=2" }],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqSection.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer.replace(/\n\n/g, " ") },
  })),
};

// Google Consent Mode v2: у EEA/UK/CH default — denied до вибору користувача
// (чекає на update від банера); поза цим списком (включно з UA) — одразу granted,
// банер не рендериться, теги вантажаться без затримки.
function buildConsentDefaultScript(consentRequired: boolean) {
  if (!consentRequired) {
    return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});`;
  }
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}var __c=null;try{__c=localStorage.getItem('cookie-consent');}catch(e){}var __g=__c==='accepted'?'granted':'denied';gtag('consent','default',{ad_storage:__g,analytics_storage:__g,ad_user_data:__g,ad_personalization:__g,wait_for_update:500});`;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const country = (await headers()).get("x-vercel-ip-country");
  const consentRequired = isConsentRequiredCountry(country);

  return (
    <html lang="uk" className={`dark ${plexSans.variable} ${plexMono.variable}`}>
      <head>
        {/* Preload саме того hero-зображення, що реально показується на кожному брейкпоінті (LCP) */}
        <link rel="preload" as="image" href="/assets/hero-video-mobile-poster.webp" media="(max-width: 767px) and (prefers-reduced-motion: no-preference)" fetchPriority="high" />
        <link rel="preload" as="image" href="/assets/hero-mobile-candidate-3.webp" media="(max-width: 767px) and (prefers-reduced-motion: reduce)" fetchPriority="high" />
        <link rel="preload" as="image" href="/assets/hero-video-poster.webp" media="(min-width: 768px) and (prefers-reduced-motion: no-preference)" fetchPriority="high" />
        <link rel="preload" as="image" href="/assets/truck-hero-ext.webp" media="(min-width: 768px) and (prefers-reduced-motion: reduce)" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.localBusiness) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {/* Google Consent Mode v2 — значення default залежить від країни (ставимо ПЕРЕД GTM) */}
        <Script id="consent-default" strategy="beforeInteractive">
          {buildConsentDefaultScript(consentRequired)}
        </Script>
        {/* Google Tag Manager — контейнер клієнта (містить Ringostat, GA4, Ads-теги) */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W8FTJL2L');`}
        </Script>
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) — одразу після відкриття <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W8FTJL2L"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <a href="#main-content" className="skip-link">{meta.skipToContent}</a>
        {children}
        {consentRequired && <CookieConsent />}
        <SpeedInsights />
        <Analytics />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GTAG_ID}');`}
        </Script>
      </body>
    </html>
  );
}
