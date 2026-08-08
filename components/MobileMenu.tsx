import { header, nav, mobileMenu } from "@/content";
import { ArrowIcon, CloseIcon, PhoneIcon } from "./icons";

export default function MobileMenu() {
  return (
    <div id="mobile-menu" className="fixed inset-0 z-[60] hidden flex-col bg-[var(--background)] overflow-y-auto overscroll-contain">
      <div className="flex items-center justify-between px-6 h-14 border-b border-hair shrink-0">
        <a href="#" data-scroll-top aria-label="На початок сторінки" className="flex items-center gap-3">
          <img loading="lazy" src="/assets/icon-only.svg" alt="" width={443} height={308} className="h-8 w-auto object-contain" />
          <img loading="lazy" src="/assets/wordmark-only.svg" alt="Fast Tent" width={558} height={234} className="h-8 w-auto object-contain" />
        </a>
        <button id="mobile-menu-close" className="flex items-center justify-center h-9 w-9 border border-hair rounded-full hover:border-signal transition-colors" aria-label={header.mobileMenuCloseLabel}>
          <CloseIcon />
        </button>
      </div>
      <nav className="flex flex-col px-6 py-6 font-mono-label uppercase text-lg text-[var(--muted-foreground)]">
        {nav.map((item) => (
          <a key={item.href} href={item.href} className="py-3 border-b border-hair hover:text-signal transition-colors">
            {item.label}
          </a>
        ))}
        <a href={header.phoneHref} className="py-4 mt-4 flex items-center gap-2 normal-case text-[var(--foreground)] hover:text-signal transition-colors">
          <PhoneIcon />
          {header.phoneDisplay}
        </a>
        <div className="grid grid-cols-1 gap-2 mt-2 w-max normal-case">
          {mobileMenu.buttons.map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              target={btn.external ? "_blank" : undefined}
              rel={btn.external ? "noopener noreferrer" : undefined}
              className="btn btn-outline btn-px-20"
            >
              {btn.label}
              <ArrowIcon />
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
