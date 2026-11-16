import Image from "next/image";
import { hero } from "@/content";
import { ArrowIcon, LineIcon } from "./icons";

// Слова з дефісом («ПВХ-конструкцій») не рвемо на два рядки
const keepHyphenated = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 ? <span key={i} className="whitespace-nowrap">{part}</span> : part
  );

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="photo-hero-bg">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/hero-mobile-candidate-3.webp" />
          <img src="/assets/truck-hero-ext.webp" alt={hero.imgAlt} width={1920} height={1920} fetchPriority="high" />
        </picture>
      </div>
      <div className="photo-hero-overlay"></div>

      {/* lg+: перший екран на всю висоту вікна, «Власний цех…» і кнопки притиснуті до низу */}
      <div className="relative z-10 pt-28 sm:pt-32 lg:min-h-[100svh] lg:flex lg:flex-col lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full lg:flex-1 lg:flex lg:flex-col">
          <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-6 flex flex-wrap gap-y-1">
            {hero.eyebrow.map((word, i) => (
              <span key={word} className="whitespace-nowrap">
                {word}
                {i < hero.eyebrow.length - 1 && <span className="sep-dot">·</span>}
              </span>
            ))}
          </p>

          <h1 className="whitespace-pre-line text-4xl font-semibold sm:text-5xl lg:text-[56px] lg:leading-[1.05] max-w-3xl">
            {keepHyphenated(hero.h1)}
          </h1>

          <h2 className="reveal in mt-6 sm:mt-8 max-w-[50rem] text-balance text-2xl font-light leading-tight text-[var(--muted-foreground)] sm:text-3xl lg:text-[32px]">
            {keepHyphenated(hero.h2)}
          </h2>

          <div className="lg:mt-auto">
          <p className="mt-10 sm:mt-16 max-w-2xl text-base text-[var(--muted-foreground-light)] sm:text-lg">{hero.p}</p>

          <div className="flex flex-wrap gap-3 mt-6 sm:mt-8">
            <a href={hero.ctaPrimary.href} className="btn btn-primary">
              {hero.ctaPrimary.label}
              <ArrowIcon />
            </a>
            <a href={hero.ctaSecondary.href} className="btn btn-outline">
              {hero.ctaSecondary.label}
              <ArrowIcon />
            </a>
          </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-6">{hero.partnersLabel}</p>
          <ul className="grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-8 mb-6 lg:flex lg:flex-wrap lg:justify-start lg:gap-x-10 lg:gap-y-6">
            {hero.partners.map((p) => (
              <li key={p.name} className="flex items-center">
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] opacity-70 hover:opacity-100 transition-opacity">
                  {p.img.endsWith(".svg") ? (
                    // SVG — вектор, next/image не потрібен
                    // eslint-disable-next-line @next/next/no-img-element
                    <img loading="lazy" src={`/assets/${p.img}`} alt={p.name} width={p.w} height={p.h} className={`${p.width} h-auto${p.mono ? " logo-mono" : ""}`} />
                  ) : (
                    <Image src={`/assets/${p.img}`} alt={p.name} width={p.w} height={p.h} sizes="96px" className={`${p.width} h-auto${p.mono ? " logo-mono" : ""}`} />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <ul aria-label="Trust signals" className="grid grid-cols-1 gap-3 mt-14 sm:mt-[72px] sm:grid-cols-2 lg:grid-cols-5">
            {hero.trustSignals.map((t, i) => (
              <li
                key={t.label}
                className={`flex items-center gap-3 border border-white/10 bg-[var(--card)]/40 p-5 backdrop-blur-sm${
                  i === hero.trustSignals.length - 1 ? " sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <LineIcon name={t.icon} className="h-5 w-5 shrink-0 text-signal-80" />
                <span className="font-mono-label text-[var(--muted-foreground)] uppercase">{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
