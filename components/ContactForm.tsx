"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneInput, type PhoneInputRefType } from "react-international-phone";
import type { CountryIso2 } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { formContent } from "@/content";
import { ArrowIcon } from "./icons";

type FieldErrors = { name?: string; phone?: string; email?: string; message?: string };
type Status = "idle" | "sending" | "error";

const inputBase = "w-full bg-transparent border-b py-2 focus:outline-none transition-colors";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState("");
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const phoneRef = useRef<PhoneInputRefType>(null);
  const phoneTouched = useRef(false);

  // Підставляємо код країни за геолокацією відвідувача (Vercel edge-заголовок).
  // Fallback — Україна. Не перезаписуємо, якщо користувач уже почав вводити номер.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const c = data?.country as string | null;
        if (!cancelled && c && !phoneTouched.current) {
          phoneRef.current?.setCountry(c as CountryIso2);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function validate(fd: FormData): FieldErrors {
    const e: FieldErrors = {};
    if (!String(fd.get("name") || "").trim()) e.name = formContent.errorRequired;

    // Телефон: код країни обирається селектором; порожнім вважаємо лише сам код.
    // Валідність номера перевіряємо за правилами конкретної країни (libphonenumber).
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length <= dialCode.length) e.phone = formContent.errorRequired;
    else if (!isValidPhoneNumber(phone)) e.phone = formContent.errorPhone;

    if (!String(fd.get("message") || "").trim()) e.message = formContent.errorRequired;
    const email = String(fd.get("email") || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = formContent.errorEmail;
    return e;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("phone", phone); // чистий E.164 замість відформатованого значення інпута

    const errs = validate(fd);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = (["name", "phone", "email", "message"] as const).find((k) => errs[k]);
      if (firstKey === "phone") phoneRef.current?.focus();
      else if (firstKey) form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      if (!res.ok) throw new Error("request failed");
      form.reset();
      setFileName("");
      setPhone("");
      setStatus("idle");
      setSuccess(true);
    } catch {
      setStatus("error");
    }
  }

  function clearError(field: keyof FieldErrors) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  if (success) {
    return (
      <div
        id="request-form"
        className="accent-top border border-hair radius bg-[var(--background)]/95 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center min-h-[420px] scroll-anchor"
      >
        <div className="flex items-center justify-center h-16 w-16 rounded-full border border-[var(--signal)] text-signal mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="fmono uppercase text-base tracking-wider mb-3">{formContent.successTitle}</h3>
        <p className="text-[var(--muted-foreground)] max-w-xs">{formContent.statusSuccess}</p>
      </div>
    );
  }

  return (
    <form id="request-form" noValidate onSubmit={handleSubmit} className="accent-top border border-hair radius bg-[var(--background)]/95 backdrop-blur-sm p-8 space-y-5 scroll-anchor">
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
        <input
          id="cf-name"
          name="name"
          type="text"
          aria-invalid={!!errors.name}
          onInput={() => clearError("name")}
          className={`${inputBase} ${errors.name ? "border-[var(--signal)]" : "border-hair focus:border-[var(--signal)]"}`}
        />
        {errors.name && <p className="font-mono-label text-signal mt-1.5 normal-case">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="cf-phone" className="font-mono-label uppercase text-[var(--muted-foreground)] block mb-2">
          {formContent.phoneLabel}
        </label>
        <PhoneInput
          ref={phoneRef}
          defaultCountry={formContent.defaultCountry as CountryIso2}
          value={phone}
          onChange={(value, meta) => {
            phoneTouched.current = true;
            setPhone(value);
            setDialCode(meta.country.dialCode);
            clearError("phone");
          }}
          inputProps={{ id: "cf-phone", "aria-invalid": !!errors.phone }}
          className={`cf-phone-field${errors.phone ? " cf-phone-field--invalid" : ""}`}
        />
        {errors.phone && <p className="font-mono-label text-signal mt-1.5 normal-case">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="cf-email" className="font-mono-label uppercase text-[var(--muted-foreground)] block mb-2">
          {formContent.emailLabel}
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          aria-invalid={!!errors.email}
          onInput={() => clearError("email")}
          className={`${inputBase} ${errors.email ? "border-[var(--signal)]" : "border-hair focus:border-[var(--signal)]"}`}
        />
        {errors.email && <p className="font-mono-label text-signal mt-1.5 normal-case">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="cf-message" className="font-mono-label uppercase text-[var(--muted-foreground)] block mb-2">
          {formContent.messageLabel}
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={3}
          aria-invalid={!!errors.message}
          onInput={() => clearError("message")}
          className={`${inputBase} ${errors.message ? "border-[var(--signal)]" : "border-hair focus:border-[var(--signal)]"}`}
        ></textarea>
        {errors.message && <p className="font-mono-label text-signal mt-1.5 normal-case">{errors.message}</p>}
      </div>
      <div>
        <label htmlFor="cf-file" className="font-mono-label uppercase text-[var(--muted-foreground)] block mb-2">
          {formContent.fileLabel}
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="file-btn-wrap btn btn-outline">
            {formContent.fileButtonLabel}
            <input id="cf-file" name="file" type="file" onChange={(e) => setFileName(e.currentTarget.files?.[0]?.name ?? "")} />
          </div>
          <span className="text-sm text-[var(--muted-foreground)]">{fileName}</span>
        </div>
      </div>
      <button id="cf-submit" type="submit" disabled={status === "sending"} className="btn btn-primary w-full">
        {status === "sending" ? formContent.statusSending : formContent.submitLabel}
        {status !== "sending" && <ArrowIcon />}
      </button>
      <p className="text-xs text-[var(--muted-foreground)] text-center">
        {formContent.privacyNotePrefix}{" "}
        <a href="/privacy-policy" className="underline hover:text-[var(--foreground)] transition-colors">
          {formContent.privacyNoteLink}
        </a>
      </p>
      {status === "error" && <p className="font-mono-label text-signal text-center !mt-2">{formContent.statusError}</p>}
    </form>
  );
}
