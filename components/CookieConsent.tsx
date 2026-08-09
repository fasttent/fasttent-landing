"use client";

import { useEffect, useState } from "react";
import { cookieConsent } from "@/content";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      /* noop */
    }
    if (!stored) setVisible(true);
  }, []);

  function choose(accepted: boolean) {
    try {
      localStorage.setItem(KEY, accepted ? "accepted" : "rejected");
    } catch {
      /* noop */
    }
    // Consent Mode v2: на "Прийняти" оновлюємо згоду; на "Відхилити" лишається denied
    if (accepted) {
      window.gtag?.("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={cookieConsent.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-hair bg-[var(--card)]/95 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
          {cookieConsent.text}
          <a href={cookieConsent.linkHref} className="underline hover:text-[var(--foreground)] transition-colors">
            {cookieConsent.linkLabel}
          </a>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button type="button" onClick={() => choose(false)} className="btn btn-outline">
            {cookieConsent.rejectLabel}
          </button>
          <button type="button" onClick={() => choose(true)} className="btn btn-primary">
            {cookieConsent.acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
