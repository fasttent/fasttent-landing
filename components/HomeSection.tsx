import { homeSection } from "@/content";
import { ArrowIcon } from "./icons";
import DirectionCardItem from "./DirectionCardItem";

export default function HomeSection() {
  return (
    <section id="home-segment" className="relative section-y-lg border-t border-hair scroll-anchor">
      <div className="hero-bg hero-dim-50">
        <img loading="lazy" src={`/assets/${homeSection.bgImg}`} alt="" />
      </div>
      <div className="hero-overlay"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-3">{homeSection.eyebrow}</p>
        <h2 className="reveal text-3xl font-semibold sm:text-4xl lg:text-5xl max-w-2xl">{homeSection.h2}</h2>
        <p className="mt-4 max-w-xl text-base text-[var(--muted-foreground)] sm:text-lg">{homeSection.p}</p>

        <div className="flex flex-wrap gap-3 mt-8">
          <a href={homeSection.ctaPrimary.href} className="btn btn-primary">
            {homeSection.ctaPrimary.label}
            <ArrowIcon />
          </a>
          <a href={homeSection.ctaSecondary.href} className="btn btn-outline">
            {homeSection.ctaSecondary.label}
            <ArrowIcon />
          </a>
        </div>

        <div className="card-grid mt-12 md:grid-cols-2 lg:grid-cols-3">
          {homeSection.cards.map((card) => (
            <DirectionCardItem key={card.number} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
