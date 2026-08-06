import { footerContent, contactsSection } from "@/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-hair">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-[12fr_8fr_8fr_8fr] md:gap-12">
        <div className="order-1">
          <div className="mb-5">
            <img loading="lazy" src="/assets/logo.svg" alt={footerContent.logoAlt} className="h-20 w-auto object-contain" />
          </div>
          <p className="text-[var(--muted-foreground)] text-sm max-w-xs">
            {footerContent.tagline}
            <br />
            {footerContent.taglineLine2}
            <br />
            {footerContent.taglineLine3}
          </p>
        </div>

        <div className="order-3 md:order-2">
          <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-4">{footerContent.sectionsLabel}</p>
          <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
            {footerContent.sectionsLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-[var(--foreground)] transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-4 md:order-3">
          <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-4">{footerContent.companyLabel}</p>
          <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
            {footerContent.companyLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-[var(--foreground)] transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-2 md:order-4">
          <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-4">{footerContent.contactLabel}</p>
          <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
            <li>
              <a href={contactsSection.phoneHref} className="hover:text-[var(--foreground)] transition-colors">
                {contactsSection.phoneDisplay}
              </a>
            </li>
            <li>
              <a href="viber://chat?number=%2B380668589390" className="hover:text-[var(--foreground)] transition-colors">
                Viber
              </a>
            </li>
            <li>
              <a href="https://t.me/Fast_Tent" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
                Telegram
              </a>
            </li>
            <li>
              <a href={`mailto:${contactsSection.email}`} className="hover:text-[var(--foreground)] transition-colors">
                {contactsSection.email}
              </a>
            </li>
            {contactsSection.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-hair relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between gap-3 font-mono-label text-[var(--muted-foreground)]">
          <span>
            {footerContent.copyrightLine1}
            <br className="md:hidden" /> {footerContent.copyrightLine2}
          </span>
          <span>{footerContent.copyrightAddress}</span>
        </div>
      </div>
    </footer>
  );
}
