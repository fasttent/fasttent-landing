import { footerContent, contactsSection } from "@/content";

// Прозорий розширювач тап-зони до ≥44px без зміни візуального ритму:
// py-3 збільшує зону кліку, -my-3 компенсує відступ, тож рядки лишаються компактними.
const contactLinkClass =
  "inline-flex items-center min-w-[44px] py-3 -my-3 hover:text-[var(--foreground)] transition-colors";

export default function Footer() {
  return (
    <footer className="relative border-t border-hair">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-[12fr_8fr_8fr_8fr] md:gap-12">
        <div className="order-1">
          <div className="mb-5">
            <img loading="lazy" src="/assets/logo.svg" alt={footerContent.logoAlt} width={567} height={580} className="h-20 w-auto object-contain" />
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
          <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-5">{footerContent.sectionsLabel}</p>
          <ul className="space-y-2.5 text-sm text-[var(--foreground)]/80">
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
          <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-5">{footerContent.companyLabel}</p>
          <ul className="space-y-2.5 text-sm text-[var(--foreground)]/80">
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
          <p className="font-mono-label uppercase text-[var(--muted-foreground)] mb-5">{footerContent.contactLabel}</p>
          <ul className="space-y-2.5 text-sm text-[var(--foreground)]/80">
            <li>
              <a href={contactsSection.phoneHref} className={contactLinkClass}>
                {contactsSection.phoneDisplay}
              </a>
            </li>
            <li>
              <a href="viber://chat?number=%2B380668589390" className={contactLinkClass}>
                Viber
              </a>
            </li>
            <li>
              <a href="https://t.me/Fast_Tent" className={contactLinkClass}>
                Telegram
              </a>
            </li>
            <li>
              <a href={`mailto:${contactsSection.email}`} className={contactLinkClass}>
                {contactsSection.email}
              </a>
            </li>
            {contactsSection.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={contactLinkClass}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-hair relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-[26px] flex flex-col sm:flex-row justify-between gap-3 font-mono-label text-[var(--muted-foreground)]">
          <span className="flex flex-wrap items-baseline">
            {footerContent.copyrightParts.map((part, i) => (
              <span key={part}>
                {i > 0 && <span className="sep-dot">·</span>}
                {part}
              </span>
            ))}
            <span className="sep-dot">·</span>
            <a href={footerContent.craftedByHref} target="_blank" rel="noopener noreferrer" className="group">
              <span className="group-hover:text-[var(--foreground)] transition-colors">{footerContent.craftedByPrefix} </span>
              <span className="group-hover:text-[var(--signal)] transition-colors">{footerContent.craftedByName}</span>
            </a>
          </span>
          <a
            href={contactsSection.addressHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline hover:text-[var(--foreground)] transition-colors"
          >
            {footerContent.copyrightAddress}
          </a>
        </div>
      </div>
    </footer>
  );
}
