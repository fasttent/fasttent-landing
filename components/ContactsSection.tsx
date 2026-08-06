import { contactsSection } from "@/content";
import { ArrowIcon } from "./icons";
import ContactForm from "./ContactForm";

export default function ContactsSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-bg hero-dim-40">
        <img loading="lazy" src={`/assets/${contactsSection.bgImg}`} alt="" />
      </div>
      <div className="hero-overlay"></div>

      <section id="contacts" className="relative section-y scroll-anchor">
        <div className="max-w-7xl mx-auto px-6 relative">
          <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-3">{contactsSection.eyebrow}</p>
          <h2 className="reveal text-3xl font-semibold sm:text-4xl lg:text-5xl mb-6">
            {contactsSection.h2Lines[0]}
            <br />
            {contactsSection.h2Lines[1]}
          </h2>
          <p className="text-[var(--muted-foreground)] text-lg max-w-md mb-4">{contactsSection.p}</p>
          <p className="text-signal font-mono-label uppercase mb-2">{contactsSection.responseFast}</p>
          <p className="text-[var(--muted-foreground)] font-mono-label uppercase mb-10">{contactsSection.responseEstimate}</p>

          <div className="grid lg:grid-cols-3 gap-8 mb-14">
            <div>
              <dl className="font-mono-label space-y-3 text-[var(--muted-foreground)] mb-6">
                <div className="flex gap-3">
                  <dt className="shrink-0">{contactsSection.phoneLabel}</dt>
                  <dd>
                    <a href={contactsSection.phoneHref} className="text-[var(--foreground)] hover:text-signal transition-colors">
                      {contactsSection.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0">{contactsSection.accountingLabel}</dt>
                  <dd>
                    <a href={contactsSection.accountingHref} className="text-[var(--foreground)] hover:text-signal transition-colors">
                      {contactsSection.accountingDisplay}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0">{contactsSection.emailLabel}</dt>
                  <dd>
                    <a href={`mailto:${contactsSection.email}`} className="text-[var(--foreground)] hover:text-signal transition-colors">
                      {contactsSection.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0">{contactsSection.addressLabel}</dt>
                  <dd className="text-[var(--foreground)]">{contactsSection.address}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-3">
                {contactsSection.buttons.map((btn) => (
                  <a
                    key={btn.label}
                    href={btn.href}
                    target={btn.external ? "_blank" : undefined}
                    rel={btn.external ? "noopener noreferrer" : undefined}
                    className="btn btn-outline"
                  >
                    {btn.label}
                    <ArrowIcon />
                  </a>
                ))}
              </div>
              <div className="flex gap-4 mt-4 font-mono-label uppercase text-[var(--muted-foreground)]">
                {contactsSection.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-signal transition-colors">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <dl className="font-mono-label space-y-3 text-[var(--muted-foreground)]">
                <div>
                  <dt className="text-[var(--foreground)] mb-1">{contactsSection.hoursManagers.title}</dt>
                  <dd>{contactsSection.hoursManagers.value}</dd>
                </div>
                <div className="mt-3">
                  <dt className="text-[var(--foreground)] mb-1">{contactsSection.hoursProduction.title}</dt>
                  <dd>{contactsSection.hoursProduction.value}</dd>
                </div>
              </dl>
              <p className="text-sm text-[var(--muted-foreground)] mt-3">{contactsSection.hoursNote}</p>
            </div>

            <div>
              <ul className="space-y-2 font-mono-label text-[var(--muted-foreground)]">
                <li data-direction-card data-trust-item className="trust-item direction-card direction-card-up relative">
                  <div className="trust-item-trigger inline-flex items-center gap-2 cursor-pointer relative">
                    <span className="text-signal">✔</span>{" "}
                    <span className="underline decoration-dotted underline-offset-4">{contactsSection.trustDocsLabel}</span>
                    <div className="direction-detail">
                      <div className="direction-detail-inner">
                        <ul className="direction-detail-list direction-detail-list--2col">
                          {contactsSection.trustDocsItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <div className="trust-item-info mt-3 pt-3 border-t border-hair text-xs normal-case">
                          <p>{contactsSection.trustDocsFooter.line1}</p>
                          <p className="mt-2">
                            {contactsSection.trustDocsFooter.line2prefix}
                            <br />
                            {contactsSection.trustDocsFooter.line2accounting}{" "}
                            <a href={contactsSection.accountingHref} className="text-[var(--foreground)] hover:text-signal transition-colors">
                              {contactsSection.accountingDisplay}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                {contactsSection.trustList.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-signal">✔</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="border border-hair radius overflow-hidden aspect-[4/3] lg:aspect-auto">
              <iframe
                src={contactsSection.mapSrc}
                className="w-full h-full min-h-[320px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={contactsSection.mapTitle}
              ></iframe>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
