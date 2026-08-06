import type { DirectionCard } from "@/content";
import { DirectionIcon } from "./icons";

export default function DirectionCardItem({ card }: { card: DirectionCard }) {
  return (
    <div
      data-direction-card
      className={`reveal card-hover direction-card${card.openUp ? " direction-card-up" : ""} relative flex flex-col bg-[var(--background)] p-8`}
    >
      <div className="flex items-center gap-4">
        <DirectionIcon name={card.icon} />
        <div className="flex items-center justify-between flex-1 font-mono-label text-[var(--muted-foreground)] uppercase">
          <span className="text-signal">{card.number}</span>
          <span>{card.tag}</span>
        </div>
      </div>
      <h3 className="text-2xl font-semibold mt-6 mb-3">{card.title}</h3>
      <p className="text-[var(--muted-foreground)] text-base flex-1">{card.description}</p>
      <div className="direction-detail">
        <div className="direction-detail-inner">
          <ul className={`direction-detail-list${card.twoCol ? " direction-detail-list--2col" : ""}`}>
            {card.subitems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
