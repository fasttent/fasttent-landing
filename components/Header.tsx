import { header, nav } from "@/content";
import { ArrowIcon, PhoneIcon, HamburgerIcon } from "./icons";

export default function Header() {
  return (
    <header id="site-header" className="fixed top-0 left-0 right-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <a href="#" data-scroll-top className="flex items-center gap-3 shrink-0" aria-label="На початок сторінки">
          <img loading="lazy" src="/assets/icon-only.svg" alt="" width={443} height={308} className="h-8 w-auto object-contain" />
          <img loading="lazy" src="/assets/wordmark-only.svg" alt="Fast Tent" width={558} height={234} className="h-8 w-auto object-contain" />
        </a>

        <nav className="hidden min-[1140px]:flex items-center gap-6 font-mono-label uppercase text-[var(--muted-foreground)]">
          <div className="flex items-center border border-hair radius p-0.5">
            <a href={nav[0].href} className="px-3 py-1.5 radius hover:text-[var(--foreground)] transition-colors">
              {nav[0].label}
            </a>
            <a href={nav[1].href} className="px-3 py-1.5 radius hover:text-[var(--foreground)] transition-colors">
              {nav[1].label}
            </a>
          </div>
          {nav.slice(2).map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[var(--foreground)] transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <a href={header.phoneHref} className="hidden sm:flex items-center gap-2 font-mono-label text-[var(--foreground)] hover:text-signal transition-colors">
            <PhoneIcon />
            {header.phoneDisplay}
          </a>
          <span id="cta-long" className="hidden sm:inline-flex">
            <a href="#request-form" className="btn btn-primary">
              {header.ctaLong}
              <ArrowIcon />
            </a>
          </span>
          <span id="cta-short" className="sm:hidden">
            <a href="#contacts" className="btn btn-primary btn-sm">
              {header.ctaShort}
              <ArrowIcon />
            </a>
          </span>
          <span id="cta-tablet" className="hidden">
            <a href="#request-form" className="btn btn-primary btn-sm">
              {header.ctaTablet}
              <ArrowIcon />
            </a>
          </span>
          <button id="mobile-menu-btn" className="min-[1140px]:hidden flex items-center justify-center h-9 w-9 border border-hair rounded-full hover:border-signal transition-colors" aria-label={header.mobileMenuOpenLabel} aria-controls="mobile-menu" aria-expanded="false">
            <HamburgerIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
