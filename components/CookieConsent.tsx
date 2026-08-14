"use client";

import { useEffect, useState } from "react";
import { cookieConsent } from "@/content";
import { ArrowIcon, CloseIcon } from "./icons";

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
    // Consent Mode v2: на "Прийняти" оновлюємо згоду; на "Відхилити"/закрити лишається denied
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
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-3xl"
    >
      <div className="relative flex items-center gap-6 rounded-[var(--radius-card)] border border-hair bg-[var(--card)] shadow-2xl pl-6 pr-12 py-4">
        <button
          type="button"
          onClick={() => choose(false)}
          aria-label={cookieConsent.closeLabel}
          className="absolute top-2 right-2 flex items-center justify-center h-8 w-8 rounded-full border border-hair bg-transparent text-[var(--muted-foreground)] hover:border-signal hover:text-[var(--foreground)] transition-colors"
        >
          <CloseIcon size={16} />
        </button>
        <p className="flex-1 text-sm text-[var(--muted-foreground)]">
          <span className="block">{cookieConsent.text}</span>
          <span className="block">
            {cookieConsent.detailsPrefix}
            <a href={cookieConsent.linkHref} className="underline hover:text-[var(--foreground)] transition-colors">
              {cookieConsent.linkLabel}
            </a>
            .
          </span>
        </p>
        <div className="flex flex-col gap-2 shrink-0 w-40">
          <button type="button" onClick={() => choose(true)} className="btn btn-primary w-full">
            {cookieConsent.acceptLabel}
            <ArrowIcon />
          </button>
          <button type="button" onClick={() => choose(false)} className="btn btn-outline w-full">
            {cookieConsent.rejectLabel}
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
