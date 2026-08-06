import { businessSection } from "@/content";
import { ArrowIcon } from "./icons";
import DirectionCardItem from "./DirectionCardItem";

export default function BusinessSection() {
  return (
    <section id="business" className="relative section-y-lg scroll-anchor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-3">{businessSection.eyebrow}</p>
        <h2 className="reveal text-3xl font-semibold sm:text-4xl lg:text-5xl max-w-2xl">{businessSection.h2}</h2>
        <p className="mt-4 max-w-xl text-base text-[var(--muted-foreground)] sm:text-lg">{businessSection.p}</p>

        <div className="flex flex-wrap gap-3 mt-8">
          <a href={businessSection.ctaPrimary.href} className="btn btn-primary">
            {businessSection.ctaPrimary.label}
            <ArrowIcon />
          </a>
          <a href={businessSection.ctaSecondary.href} className="btn btn-outline">
            {businessSection.ctaSecondary.label}
            <ArrowIcon />
          </a>
        </div>

        <div className="card-grid mt-12 md:grid-cols-2">
          {businessSection.cards.map((card) => (
            <DirectionCardItem key={card.number} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
