import { misc } from "@/content";
import { ChevronUp, ViberIcon } from "./icons";

export function BackToTop() {
  return (
    <button
      id="scroll-top-btn"
      data-scroll-top
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center justify-center h-11 w-11 border border-hair rounded-full bg-[var(--card)]/90 backdrop-blur-sm hover:border-signal transition-opacity opacity-0 pointer-events-none"
      aria-label={misc.scrollTopLabel}
    >
      <ChevronUp />
    </button>
  );
}

export function ViberFloating() {
  return (
    <a
      id="viber-floating"
      href="viber://chat?number=%2B380668589390"
      className="min-[1140px]:hidden fixed bottom-6 right-4 sm:right-6 z-40 flex items-center justify-center h-12 w-12 border border-hair rounded-full bg-[var(--card)]/90 backdrop-blur-sm hover:border-signal transition-[bottom,border-color] duration-300"
      aria-label={misc.viberFloatingLabel}
    >
      <ViberIcon />
    </a>
  );
}
