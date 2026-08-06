import { aboutSection } from "@/content";
import { ArrowIcon, LineIcon } from "./icons";

export default function AboutSection() {
  return (
    <section id="about" className="section-y bg-[var(--muted)] scroll-anchor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="font-mono-label uppercase text-signal mb-3">{aboutSection.eyebrow}</p>
        <h2 className="reveal text-3xl font-semibold sm:text-4xl lg:text-5xl mb-10">{aboutSection.h2}</h2>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-2">
            <img loading="lazy" src="/assets/nadiya-founder.png" alt={aboutSection.founderImgAlt} className="w-full aspect-[4/5] object-cover object-bottom radius" />
            <p className="uppercase text-[var(--foreground)] mt-4 text-[14px]">{aboutSection.founderName}</p>
            <p className="uppercase text-[var(--muted-foreground)] text-[12px]">{aboutSection.founderRole}</p>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-5 text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
              {aboutSection.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div id="about-more" className="space-y-5 text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed mt-5 hidden">
              {aboutSection.more.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <button id="about-toggle" className="link-arrow mt-6">
              <span id="about-toggle-label">{aboutSection.readMoreLabel}</span>
              <ArrowIcon />
            </button>

            <div className="card-grid grid-cols-1 sm:grid-cols-2 mt-12">
              {aboutSection.principles.map((p) => (
                <div key={p.title} className="bg-[var(--background)] p-6">
                  <LineIcon name={p.icon} className="h-5 w-5 text-signal-80 mb-3" />
                  <h3 className="font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
