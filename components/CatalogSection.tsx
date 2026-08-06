import type { CatalogCard } from "@/content";
import { catalogSection } from "@/content";
import { ZoomIcon } from "./icons";

function CatalogCardItem({ card }: { card: CatalogCard }) {
  const photosPayload = JSON.stringify(
    card.photos.map((p) => ({ src: `/assets/${p.src}`, alt: p.alt, caption: p.caption, title: p.title }))
  );

  return (
    <div className="reveal card-hover group relative flex flex-col gap-6 bg-[var(--background)] p-8 sm:p-10">
      <div className="font-mono-label flex items-center justify-between text-[var(--muted-foreground)]">
        <span>{card.id}</span>
        <span className="text-signal">{card.segment}</span>
      </div>
      <div
        className="aspect-[4/3] overflow-hidden relative cursor-pointer"
        data-lightbox-trigger
        data-lightbox-photos={photosPayload}
        data-lightbox-alt={card.title}
      >
        <img loading="lazy" src={`/assets/${card.photos[0].src}`} alt={card.coverAlt} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-[var(--background)]/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIcon />
        </div>
      </div>
      <p className="font-mono-label text-[var(--muted-foreground)] mt-3">{card.captionLabel}</p>
      <h3 className="text-3xl font-semibold tracking-tight group-hover:text-signal transition-colors sm:text-4xl">{card.title}</h3>
      <dl className="font-mono-label grid grid-cols-2 gap-x-6 gap-y-3 border-t border-hair pt-6 text-[var(--muted-foreground)]">
        {card.specs.map((spec) => (
          <div key={spec.label} className="contents">
            <dt>{spec.label}</dt>
            <dd className="text-[var(--foreground)]">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function CatalogSection() {
  return (
    <section id="products" className="relative section-y scroll-anchor">
      <div className="hero-bg hero-dim-50">
        <img loading="lazy" src={`/assets/${catalogSection.bgImg}`} alt="" />
      </div>
      <div className="hero-overlay"></div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-3">{catalogSection.eyebrow}</p>
        <h2 className="reveal text-3xl font-semibold sm:text-4xl lg:text-5xl mb-4">{catalogSection.h2}</h2>
        <p className="max-w-xl text-base text-[var(--muted-foreground)] sm:text-lg mb-14">{catalogSection.p}</p>

        <p id="catalog-business" className="font-mono-label uppercase text-signal mb-6 scroll-anchor">
          {catalogSection.businessLabel}
        </p>
        <div className="card-grid md:grid-cols-2 mb-16">
          {catalogSection.business.map((card) => (
            <CatalogCardItem key={card.id} card={card} />
          ))}
        </div>

        <p id="catalog-home" className="font-mono-label uppercase text-signal mb-6 scroll-anchor">
          {catalogSection.homeLabel}
        </p>
        <div className="card-grid md:grid-cols-2 mb-16">
          {catalogSection.home.map((card) => (
            <CatalogCardItem key={card.id} card={card} />
          ))}
        </div>

        <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-6">{catalogSection.fullListLabel}</p>
        <div className="card-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {catalogSection.fullList.map((item) => (
            <div key={item.title} className="bg-[var(--background)] p-6">
              <span className={`font-mono-label uppercase${item.tag === "БІЗНЕС/ДІМ" ? " text-signal" : " text-[var(--muted-foreground)]"}`}>
                {item.tag}
              </span>
              <h3 className="font-semibold text-lg mt-2 mb-1">{item.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{item.desc}</p>
            </div>
          ))}
          <div className="hidden lg:block lg:col-span-2" aria-hidden="true"></div>
          <div className="bg-[var(--background)] p-6 sm:col-span-2 lg:col-start-2 lg:col-span-2">
            <span className="font-mono-label uppercase text-signal">{catalogSection.fullListException.tag}</span>
            <h3 className="font-semibold text-lg mt-2 mb-1">{catalogSection.fullListException.title}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">{catalogSection.fullListException.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
