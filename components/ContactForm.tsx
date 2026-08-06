"use client";

import { useState } from "react";
import { formContent } from "@/content";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    setStatus(formContent.statusSending);

    try {
      const res = await fetch("/api/leads", { method: "POST", body: new FormData(form) });
      if (!res.ok) throw new Error("request failed");
      form.reset();
      setFileName("");
      setStatus(formContent.statusSuccess);
    } catch {
      setStatus(formContent.statusError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id="request-form" onSubmit={handleSubmit} className="accent-top border border-hair radius bg-[var(--background)]/95 backdrop-blur-sm p-8 space-y-5 scroll-anchor">
      <div className="flex items-center gap-3 pb-4 border-b border-hair mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-signal shrink-0">
          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
        </svg>
        <h3 className="fmono uppercase text-base tracking-wider">{formContent.title}</h3>
      </div>
      <div>
        <label htmlFor="cf-name" className="font-mono-label uppercase text-[var(--muted-foreground)] block mb-2">
          {formContent.nameLabel}
        </label>
        <input id="cf-name" name="name" type="text" required className="w-full bg-transparent border-b border-hair py-2 focus:outline-none focus:border-signal" />
      </div>
      <div>
        <label htmlFor="cf-phone" className="font-mono-label uppercase text-[var(--muted-foreground)] block mb-2">
          {formContent.phoneLabel}
        </label>
        <input id="cf-phone" name="phone" type="tel" required className="w-full bg-transparent border-b border-hair py-2 focus:outline-none focus:border-signal" />
      </div>
      <div>
        <label htmlFor="cf-email" className="font-mono-label uppercase text-[var(--muted-foreground)] block mb-2">
          {formContent.emailLabel}
        </label>
        <input id="cf-email" name="email" type="email" className="w-full bg-transparent border-b border-hair py-2 focus:outline-none focus:border-signal" />
      </div>
      <div>
        <label htmlFor="cf-message" className="font-mono-label uppercase text-[var(--muted-foreground)] block mb-2">
          {formContent.messageLabel}
        </label>
        <textarea id="cf-message" name="message" required rows={3} className="w-full bg-transparent border-b border-hair py-2 focus:outline-none focus:border-signal"></textarea>
      </div>
      <div>
        <label htmlFor="cf-file" className="font-mono-label uppercase text-[var(--muted-foreground)] block mb-2">
          {formContent.fileLabel}
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="file-btn-wrap btn btn-outline">
            {formContent.fileButtonLabel}
            <input
              id="cf-file"
              name="file"
              type="file"
              onChange={(e) => setFileName(e.currentTarget.files?.[0]?.name ?? "")}
            />
          </div>
          <span className="text-sm text-[var(--muted-foreground)]">{fileName}</span>
        </div>
      </div>
      <button id="cf-submit" type="submit" disabled={submitting} className="btn btn-primary w-full">
        {formContent.submitLabel}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon" aria-hidden="true">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </button>
      <p className="text-xs text-[var(--muted-foreground)] text-center">
        {formContent.privacyNotePrefix}{" "}
        <a href="/privacy-policy" className="underline hover:text-[var(--foreground)] transition-colors">
          {formContent.privacyNoteLink}
        </a>
      </p>
      <p className="font-mono-label text-[var(--muted-foreground)] text-center !mt-0">{status}</p>
    </form>
  );
}
