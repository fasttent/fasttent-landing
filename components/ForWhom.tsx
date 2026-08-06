import { forWhom } from "@/content";
import { ArrowIcon } from "./icons";

export default function ForWhom() {
  return (
    <section className="py-16 sm:py-20 border-b border-hair">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-8">{forWhom.label}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {forWhom.tiles.map((tile) => (
            <a
              key={tile.href}
              href={tile.href}
              className="group relative flex flex-col justify-end overflow-hidden radius aspect-[16/10] sm:aspect-[16/9]"
            >
              <img
                loading="lazy"
                src={`/assets/${tile.img}`}
                alt={tile.imgAlt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 tile-overlay"></div>
              <div className="relative z-10 p-6 sm:p-10">
                <h3 className="text-3xl sm:text-4xl font-semibold mb-3">{tile.title}</h3>
                <p className="text-[var(--muted-foreground)] max-w-sm mb-4">{tile.description}</p>
                <span className="font-mono-label uppercase !tracking-wider text-[var(--foreground)] flex items-center group-hover:text-signal transition-colors">
                  {forWhom.goLabel}
                  <ArrowIcon className="arrow-icon group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
