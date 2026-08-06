import { stats } from "@/content";
import { StarIcon, LineIcon } from "./icons";

export default function Stats() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-bg hero-dim-50">
        <img loading="lazy" src="/assets/warehouse-curtains.webp" alt="" />
      </div>
      <div className="hero-overlay"></div>

      <section className="relative py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-10">
            <p className="font-mono-label uppercase text-signal">{stats.eyebrow}</p>
            <p className="font-mono-label uppercase text-[var(--muted-foreground)]">{stats.sublabel}</p>
          </div>

          <div className="card-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href={stats.reviewsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[var(--background)] p-6 hover:bg-[var(--card)]/60 transition-colors"
            >
              <div className="flex items-center gap-0.5 text-signal-80 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
                <span className="font-mono-label uppercase text-[var(--muted-foreground)] ml-1.5">{stats.reviewsLabel}</span>
              </div>
              <div className="text-2xl font-semibold mb-1">
                <span className="js-count" data-count-to="5.0" data-count-decimals="1">
                  0.0
                </span>{" "}
                <span className="text-base font-normal text-[var(--muted-foreground)]">
                  / <span className="js-count" data-count-to="66">0</span> {stats.reviewsValueSuffix}
                </span>
              </div>
              <div className="link-arrow">
                {stats.reviewsLinkLabel}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </a>

            <div className="bg-[var(--background)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <LineIcon name="geography" className="h-4 w-4 shrink-0 text-signal-80" />
                <span className="font-mono-label uppercase text-[var(--muted-foreground)]">{stats.geography.label}</span>
              </div>
              <div className="text-lg font-semibold mb-1">{stats.geography.value}</div>
              <div className="text-sm text-[var(--muted-foreground)]">{stats.geography.note}</div>
            </div>

            <div className="bg-[var(--background)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <LineIcon name="calendar" className="h-4 w-4 shrink-0 text-signal-80" />
                <span className="font-mono-label uppercase text-[var(--muted-foreground)]">{stats.onMarket.label}</span>
              </div>
              <div className="text-2xl font-semibold mb-1">
                <span className="js-count" data-count-to="2024">0</span>
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">{stats.onMarket.note}</div>
            </div>

            <div className="bg-[var(--background)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <LineIcon name="material" className="h-4 w-4 shrink-0 text-signal-80" />
                <span className="font-mono-label uppercase text-[var(--muted-foreground)]">{stats.material.label}</span>
              </div>
              <div className="text-lg font-semibold mb-1">
                {stats.material.prefix} <span className="js-count" data-count-to="650">0</span>
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">{stats.material.note}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
