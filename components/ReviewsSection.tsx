import { reviewsSection } from "@/content";
import { ArrowIcon, ChevronIcon, StarIcon } from "./icons";

export default function ReviewsSection() {
  return (
    <section className="relative section-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-mono-label uppercase text-signal mb-3">{reviewsSection.eyebrow}</p>
            <h2 className="reveal text-3xl font-semibold sm:text-4xl lg:text-5xl">{reviewsSection.h2}</h2>
          </div>
          <div className="hidden sm:flex gap-2 shrink-0">
            <button id="reviews-prev" className="flex items-center justify-center h-11 w-11 border border-hair rounded-full hover:bg-[var(--card)] hover:border-signal transition-colors" aria-label={reviewsSection.prevLabel}>
              <ChevronIcon direction="left" />
            </button>
            <button id="reviews-next" className="flex items-center justify-center h-11 w-11 border border-hair rounded-full hover:bg-[var(--card)] hover:border-signal transition-colors" aria-label={reviewsSection.nextLabel}>
              <ChevronIcon direction="right" />
            </button>
          </div>
        </div>

        <div id="reviews-track" className="carousel-track flex gap-4 -mx-4 px-[10vw] sm:mx-0 sm:px-0">
          {reviewsSection.items.map((review, i) => (
            <div
              key={i}
              className="shrink-0 w-[80vw] sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)] border border-hair bg-[var(--card)]/40 backdrop-blur-sm p-6 flex flex-col snap-center sm:snap-start"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center font-semibold shrink-0 avatar-initial">{review.initial}</div>
                <div className="flex items-center gap-1 text-signal">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <StarIcon key={j} />
                  ))}
                </div>
              </div>
              <p className="text-[var(--foreground)]/90 text-base mb-4 leading-relaxed flex-1">&quot;{review.text}&quot;</p>
              <p className="font-mono-label text-[var(--muted-foreground)] uppercase">{review.name}</p>
            </div>
          ))}

          <a
            href={reviewsSection.moreCard.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-[80vw] sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)] border border-hair bg-[var(--card)]/40 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center hover:bg-[var(--card)]/70 transition-colors snap-center sm:snap-end"
          >
            <div className="text-4xl font-semibold mb-2">{reviewsSection.moreCard.rating}</div>
            <p className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors mb-4">{reviewsSection.moreCard.text}</p>
            <span className="link-arrow">
              {reviewsSection.moreCard.linkLabel}
              <ArrowIcon />
            </span>
          </a>
        </div>

        {/* Крапки-пагінація (мобільний) — центрують натяк на гортання у стилі сайту */}
        <div id="reviews-dots" className="flex sm:hidden justify-center items-center gap-2.5 mt-6">
          {Array.from({ length: reviewsSection.items.length + 1 }).map((_, i) => (
            <button
              key={i}
              data-review-dot={i}
              aria-label={`${reviewsSection.dotLabel} ${i + 1}`}
              className="h-2 w-2 rounded-full bg-[var(--border)] transition-all duration-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
