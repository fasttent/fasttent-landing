"use client";

import { useRef, useState } from "react";
import { misc } from "@/content";
import { PhoneIcon } from "./icons";

// Ringostat вантажиться асинхронно через GTM, тому його API може бути ще не готовим
declare global {
  interface Window {
    ringostatAPI?: { openCallbackForm?: () => void };
  }
}

export default function CallbackButton() {
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function tryOpen(): boolean {
    const fn = typeof window !== "undefined" ? window.ringostatAPI?.openCallbackForm : undefined;
    if (typeof fn === "function") {
      fn();
      return true;
    }
    return false;
  }

  function handleClick() {
    if (tryOpen()) return;
    // Коротко чекаємо, поки Ringostat підвантажиться через GTM (до ~6с)
    setLoading(true);
    let attempts = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      attempts += 1;
      if (tryOpen() || attempts >= 20) {
        if (timerRef.current) clearInterval(timerRef.current);
        setLoading(false);
      }
    }, 300);
  }

  // Кругла плаваюча кнопка (форма — як "Вгору"), акцентний колір, іконка телефона.
  return (
    <button
      id="callback-floating"
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={loading ? misc.callbackLoadingLabel : misc.callbackLabel}
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center justify-center h-12 w-12 rounded-full bg-[var(--signal)] text-white shadow-lg transition-[bottom,transform] duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-70 disabled:animate-pulse"
    >
      <span aria-hidden="true" className="callback-ping absolute inset-0 rounded-full bg-[var(--signal)]" />
      <PhoneIcon className="relative h-5 w-5" />
    </button>
  );
}
