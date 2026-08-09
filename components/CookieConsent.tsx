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
      className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-6 sm:bottom-6 z-[70] sm:max-w-sm"
    >
      <div className="relative rounded-2xl border border-hair bg-[var(--card)] shadow-2xl px-5 pt-5 pb-4 text-center">
        <button
          type="button"
          onClick={() => choose(false)}
          aria-label={cookieConsent.closeLabel}
          className="absolute top-2 right-2 flex items-center justify-center h-8 w-8 rounded-full border border-hair bg-transparent text-[var(--muted-foreground)] hover:border-signal hover:text-[var(--foreground)] transition-colors"
        >
          <CloseIcon size={16} />
        </button>
        <p className="text-sm text-[var(--muted-foreground)] px-2">
          {cookieConsent.text}
          <a href={cookieConsent.linkHref} className="underline hover:text-[var(--foreground)] transition-colors">
            {cookieConsent.linkLabel}
          </a>
          .
        </p>
        <div className="flex gap-3 mt-4">
          <button type="button" onClick={() => choose(false)} className="btn btn-outline flex-1">
            {cookieConsent.rejectLabel}
            <ArrowIcon />
          </button>
          <button type="button" onClick={() => choose(true)} className="btn btn-primary flex-1">
            {cookieConsent.acceptLabel}
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
