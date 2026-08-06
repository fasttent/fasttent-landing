import { warrantySection, stepsSection } from "@/content";
import { ArrowIcon, LineIcon } from "./icons";
import ReviewsSection from "./ReviewsSection";

export default function WarrantyAndSteps() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-bg hero-dim-45">
        <img loading="lazy" src={`/assets/${warrantySection.bgImg}`} alt="" />
      </div>
      <div className="hero-overlay"></div>

      <section className="relative section-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="font-mono-label uppercase text-signal mb-3">{warrantySection.eyebrow}</p>
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
            <div className="lg:col-span-2 lg:order-1 flex flex-col h-full">
              <div className="card-grid grid-cols-2">
                {warrantySection.badges.map((badge) => (
                  <div key={badge.label} className="bg-[var(--background)] p-6 flex flex-col items-center justify-center text-center gap-2">
                    <LineIcon name={badge.icon} className="text-signal-80" />
                    <p className="text-sm">{badge.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-6 border-t border-hair">
                <p className="font-semibold mb-1">{warrantySection.ctaTitle}</p>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">{warrantySection.ctaText}</p>
                <a href={warrantySection.ctaButton.href} className="btn btn-primary">
                  {warrantySection.ctaButton.label}
                  <ArrowIcon />
                </a>
              </div>
            </div>
            <div className="lg:col-span-3 lg:order-2">
              <h2 className="reveal text-3xl font-semibold sm:text-4xl mb-6">{warrantySection.h2}</h2>
              <div className="space-y-4 text-base text-[var(--muted-foreground)] leading-relaxed">
                {warrantySection.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative section-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="font-mono-label uppercase text-signal mb-3">{stepsSection.eyebrow}</p>
          <h2 className="reveal text-3xl font-semibold sm:text-4xl mb-4">{stepsSection.h2}</h2>
          <p className="text-base text-[var(--muted-foreground)] sm:text-lg mb-12 max-w-2xl">{stepsSection.p}</p>

          <dl className="card-grid sm:grid-cols-2 lg:grid-cols-3">
            {stepsSection.steps.map((step) => (
              <div key={step.number} className="bg-[var(--background)] p-6">
                <dt className="font-mono-label text-signal mb-2">{step.number}</dt>
                <dt className="font-semibold mb-1">{step.title}</dt>
                <dd className="text-sm text-[var(--muted-foreground)]">{step.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ReviewsSection />
    </div>
  );
}
