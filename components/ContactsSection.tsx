import dynamic from "next/dynamic";
import { contactsSection } from "@/content";
import { ArrowIcon } from "./icons";

// react-international-phone + libphonenumber-js ~176 KiB — код-спліт окремим чанком,
// щоб не вантажити його в критичному шляху initial load (форма нижче за fold, HTML
// і так SSR-иться повністю: ssr не вимикаємо, тож без JS форма все одно видима).
const ContactForm = dynamic(() => import("./ContactForm"));

export default function ContactsSection() {
  return (
    <section id="contacts" className="relative section-y scroll-anchor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-4">{contactsSection.eyebrow}</p>
          <h2 className="reveal text-3xl font-semibold sm:text-4xl lg:text-5xl mb-6">
            {contactsSection.h2Lines[0]}
            <br />
            {contactsSection.h2Lines[1]}
          </h2>
          <p className="text-[var(--muted-foreground)] text-lg max-w-md mb-8">{contactsSection.p}</p>
          <p className="text-signal font-mono-label uppercase mb-3">{contactsSection.responseFast}</p>
          <p className="text-[var(--muted-foreground)] font-mono-label uppercase mb-16">{contactsSection.responseEstimate}</p>

          <div className="grid lg:grid-cols-3 gap-12 mb-16 sm:mb-20">
            <div>
              <p className="text-[var(--foreground)] font-mono-label uppercase mb-5">{contactsSection.legalEntity}</p>
              <dl className="font-mono-label space-y-4 text-[var(--muted-foreground)] mb-8">
                <div className="flex gap-3">
                  <dt className="shrink-0">{contactsSection.phoneLabel}</dt>
                  <dd>
                    <a href={contactsSection.phoneHref} className="text-[var(--foreground)] hover:text-[var(--signal)] transition-colors">
                      {contactsSection.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0">{contactsSection.accountingLabel}</dt>
                  <dd>
                    <a href={contactsSection.accountingHref} className="text-[var(--foreground)] hover:text-[var(--signal)] transition-colors">
                      {contactsSection.accountingDisplay}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0">{contactsSection.emailLabel}</dt>
                  <dd>
                    <a href={`mailto:${contactsSection.email}`} className="text-[var(--foreground)] hover:text-[var(--signal)] transition-colors">
                      {contactsSection.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0">{contactsSection.addressLabel}</dt>
                  <dd>
                    <a
                      href={contactsSection.addressHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--foreground)] hover:text-[var(--signal)] transition-colors"
                    >
                      {contactsSection.address}
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="grid grid-cols-[repeat(3,max-content)] justify-items-start gap-x-3 gap-y-4">
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
                {contactsSection.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pl-[11px] font-mono-label uppercase text-[var(--muted-foreground)] hover:text-[var(--signal)] transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <dl className="font-mono-label space-y-3 text-[var(--muted-foreground)]">
                <div>
                  <dt className="text-[var(--foreground)] mb-2">{contactsSection.hoursManagers.title}</dt>
                  <dd>{contactsSection.hoursManagers.value}</dd>
                </div>
                <div className="mt-6">
                  <dt className="text-[var(--foreground)] mb-2">{contactsSection.hoursProduction.title}</dt>
                  <dd>{contactsSection.hoursProduction.value}</dd>
                </div>
              </dl>
              <p className="text-sm text-[var(--muted-foreground)] mt-6">{contactsSection.hoursNote}</p>
            </div>

            <div>
              <ul className="space-y-4 font-mono-label text-[var(--muted-foreground)]">
                <li data-direction-card data-trust-item className="trust-item direction-card direction-card-up relative group">
                  <div className="trust-item-trigger flex flex-col cursor-pointer relative">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-signal">✔</span>
                      <span className="underline decoration-dotted underline-offset-4 group-hover:text-[var(--foreground)] transition-colors">{contactsSection.trustDocsLabel}</span>
                    </span>
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
                            <a href={contactsSection.accountingHref} className="text-[var(--foreground)] hover:text-[var(--signal)] transition-colors">
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

          <div className="grid lg:grid-cols-2 gap-10">
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
  );
}
