import { misc } from "@/content";
import { ChevronIcon, CloseIcon } from "./icons";

export default function Lightbox() {
  return (
    <div id="lightbox" role="dialog" aria-modal="true" aria-label={misc.lightboxDialogLabel} className="fixed inset-0 z-[100] hidden flex-col lightbox-backdrop">
      <button id="lightbox-close" className="absolute top-6 right-6 z-10 flex items-center justify-center h-11 w-11 border border-hair rounded-full hover:bg-[var(--card)] hover:border-signal transition-colors" aria-label={misc.lightboxCloseLabel}>
        <CloseIcon />
      </button>
      <button
        id="lightbox-prev"
        className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-11 w-11 border border-hair rounded-full hover:bg-[var(--card)] hover:border-signal transition-colors before:content-[''] before:absolute before:-inset-4"
        aria-label={misc.lightboxPrevLabel}
      >
        <ChevronIcon direction="left" />
      </button>
      <button
        id="lightbox-next"
        className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-11 w-11 border border-hair rounded-full hover:bg-[var(--card)] hover:border-signal transition-colors before:content-[''] before:absolute before:-inset-4"
        aria-label={misc.lightboxNextLabel}
      >
        <ChevronIcon direction="right" />
      </button>

      {/* Сцена зображення — flex-1, фото центроване; висота сцени стала (підпис у footer нижче) */}
      <div className="flex-1 min-h-0 flex items-center justify-center w-full px-4 pt-16 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" id="lightbox-img" src="" alt="" className="max-w-[85vw] max-h-full object-contain radius" />
      </div>

      {/* Підпис + лічильник — footer фіксованої мін-висоти (1–3 рядки не зсувають фото) */}
      <div className="shrink-0 w-full px-6 pt-2 pb-6 flex flex-col items-center justify-start gap-1 text-center min-h-[7.5rem]">
        <p id="lightbox-caption" className="text-sm text-[var(--muted-foreground)] max-w-[85vw]"></p>
        <p id="lightbox-counter" className="font-mono-label text-[var(--muted-foreground)]"></p>
      </div>
    </div>
  );
}
