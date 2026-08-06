import { serviceSection, deliverySection } from "@/content";
import { LineIcon } from "./icons";

export default function ServiceAndDelivery() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-bg hero-dim-45">
        <img loading="lazy" src={`/assets/${serviceSection.bgImg}`} alt="" />
      </div>
      <div className="hero-overlay"></div>

      <section className="relative py-16 sm:py-20 border-t border-hair">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-mono-label uppercase text-signal mb-3">{serviceSection.eyebrow}</p>
          <h2 className="text-2xl font-semibold sm:text-3xl max-w-2xl mb-8">{serviceSection.h2}</h2>
          <div className="card-grid grid-cols-1 sm:grid-cols-3">
            {serviceSection.items.map((item) => (
              <div key={item.title} className="bg-[var(--background)] p-6">
                <LineIcon name={item.icon} className="h-5 w-5 text-signal-80 mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 border-t border-hair">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-mono-label uppercase text-signal mb-3">{deliverySection.eyebrow}</p>
          <h2 className="text-2xl font-semibold sm:text-3xl max-w-2xl mb-8">{deliverySection.h2}</h2>
          <div className="card-grid grid-cols-2 sm:grid-cols-4">
            {deliverySection.steps.map((step) => (
              <div key={step.number} className="bg-[var(--background)] p-5 text-center">
                <div className="font-mono-label uppercase text-signal mb-2">{step.number}</div>
                <p className="text-sm">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
