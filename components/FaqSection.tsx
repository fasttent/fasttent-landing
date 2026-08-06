import { faqSection } from "@/content";
import { DownloadIcon } from "./icons";

function FaqItem({ item, isLast }: { item: (typeof faqSection.items)[number]; isLast: boolean }) {
  return (
    <div data-faq className={`faq-item border-hair${isLast ? " lg:border-b-0" : ""}`}>
      <dt>
        <button data-faq-toggle className="w-full flex items-center justify-between gap-4 py-6 px-5 text-left bg-transparent border-0 cursor-pointer">
          <span className="text-lg font-semibold tracking-tight faq-question">{item.question}</span>
          <span className="faq-icon shrink-0 text-signal text-2xl leading-none transition-transform duration-200">+</span>
        </button>
      </dt>
      <dd className="pb-6 px-5 text-base leading-relaxed text-[var(--muted-foreground)] hidden">
        {item.answer.split("\n\n").map((para, i) => (
          <p key={i} className={i < item.answer.split("\n\n").length - 1 ? "mb-4" : undefined}>
            {para}
          </p>
        ))}
        {item.downloads && (
          <div className="flex flex-col gap-3">
            {item.downloads.map((d) => (
              <a key={d.href} href={d.href} target="_blank" className="link-arrow link-download">
                <DownloadIcon />
                {d.label}
              </a>
            ))}
          </div>
        )}
      </dd>
    </div>
  );
}

export default function FaqSection() {
  const left = faqSection.items.slice(0, 7);
  const right = faqSection.items.slice(7);

  return (
    <section id="faq" className="section-y">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[0.65fr_1fr_1fr] gap-x-10 gap-y-2">
          <div className="lg:col-span-1">
            <p data-faq-close-all className="font-mono-label uppercase text-signal mb-3 cursor-pointer select-none hover:opacity-70 transition-opacity" title={faqSection.eyebrowTitle}>
              {faqSection.eyebrow}
            </p>
            <h2 className="reveal text-3xl font-semibold sm:text-4xl lg:text-5xl">{faqSection.h2}</h2>
          </div>

          <dl className="lg:col-span-1 divide-y divide-hair border-t border-hair lg:border-t-0">
            {left.map((item, i) => (
              <FaqItem key={item.question} item={item} isLast={i === left.length - 1} />
            ))}
          </dl>

          <dl className="lg:col-span-1 divide-y divide-hair border-t border-hair lg:border-t-0">
            {right.map((item, i) => (
              <FaqItem key={item.question} item={item} isLast={i === right.length - 1} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
