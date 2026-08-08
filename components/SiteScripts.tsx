"use client";

import { useEffect } from "react";

type LightboxPhoto = { src: string; alt?: string; caption?: string; title?: string };

const ANCHOR_GAP = 50;
const ANCHOR_IDS = ["business", "home-segment", "products", "about", "contacts"];

export default function SiteScripts() {
  useEffect(() => {
    // Єдиний AbortController для всіх listeners — гарантує повне очищення
    // при unmount/remount (важливо в React StrictMode, де ефект монтується двічі).
    const controller = new AbortController();
    const { signal } = controller;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Reveal-анімація при скролі ──
    const revealEls = document.querySelectorAll<HTMLElement>(".reveal:not(.in)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));

    // ── Анімований підрахунок цифр ──
    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const target = parseFloat(el.dataset.countTo || "0");
          const decimals = parseInt(el.dataset.countDecimals || "0", 10);
          if (prefersReduced) {
            el.textContent = decimals ? target.toFixed(decimals) : String(Math.round(target));
            countIo.unobserve(el);
            return;
          }
          const duration = 1800;
          const start = performance.now();
          el.style.color = "var(--signal)";
          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = decimals ? value.toFixed(decimals) : String(Math.round(value));
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.style.transition = "color .5s ease";
              el.style.color = "";
            }
          }
          requestAnimationFrame(tick);
          countIo.unobserve(el);
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll<HTMLElement>(".js-count").forEach((el) => countIo.observe(el));

    // ── Компенсований скрол до якорів (фіксований хедер) ──
    function scrollToSectionTop(id: string) {
      const header = document.getElementById("site-header");
      const section = document.getElementById(id);
      const eyebrow = section ? section.querySelector("p.font-mono-label") : null;
      const target = (eyebrow || section) as HTMLElement | null;
      if (!target || !header) return;
      const headerHeight = header.getBoundingClientRect().height;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight - ANCHOR_GAP;
      window.scrollTo({ top: Math.max(0, targetY) });
    }

    document
      .querySelectorAll<HTMLAnchorElement>(ANCHOR_IDS.map((id) => `a[href="#${id}"]`).join(","))
      .forEach((a) => {
        a.addEventListener(
          "click",
          (e) => {
            const id = a.getAttribute("href")?.slice(1);
            if (!id) return;
            e.preventDefault();
            scrollToSectionTop(id);
            history.pushState(null, "", "#" + id);
          },
          { signal }
        );
      });

    if (ANCHOR_IDS.includes(location.hash.slice(1))) {
      window.addEventListener("load", () => scrollToSectionTop(location.hash.slice(1)), { signal });
    }

    // ── Header scrolled + позиції плаваючих кнопок ──
    // Стек у кутку (знизу вгору): "Вгору" → Viber → "Передзвоніть мені" (найвище).
    // Viber вторинний і займає нижній динамічний слот; callback завжди над ним.
    // Коли "Вгору" зʼявляється — весь стек піднімається на слот вище.
    const header = document.getElementById("site-header");
    const topBtn = document.getElementById("scroll-top-btn");
    const viberBtn = document.getElementById("viber-floating");
    const callbackBtn = document.getElementById("callback-floating");
    function positionFloating() {
      const upVisible = window.scrollY > 200;
      // Viber (моб., вторинний) — нижній динамічний слот bottom-6 ↔ bottom-20
      viberBtn?.classList.toggle("bottom-20", upVisible);
      viberBtn?.classList.toggle("bottom-6", !upVisible);
      // Callback — вище за Viber (на моб., де Viber є) або вище за "Вгору" (на десктопі)
      if (callbackBtn) {
        const viberPresent = window.matchMedia("(max-width: 1139px)").matches;
        const px = viberPresent ? (upVisible ? 136 : 80) : upVisible ? 80 : 24;
        callbackBtn.style.bottom = `${px}px`;
      }
    }
    function onScroll() {
      if (window.scrollY > 40) header?.classList.add("scrolled");
      else header?.classList.remove("scrolled");
      if (window.scrollY > 200) topBtn?.classList.remove("opacity-0", "pointer-events-none");
      else topBtn?.classList.add("opacity-0", "pointer-events-none");
      positionFloating();
    }
    window.addEventListener("scroll", onScroll, { passive: true, signal });
    window.addEventListener("resize", positionFloating, { passive: true, signal });
    onScroll();

    // ── Скрол угору (лого хедера + кнопка "Вгору") ──
    document.querySelectorAll<HTMLElement>("[data-scroll-top]").forEach((el) => {
      el.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          // Прибираємо застарілий якір (#request-form тощо) з URL при скролі на початок
          history.replaceState(null, "", location.pathname + location.search);
        },
        { signal }
      );
    });

    // ── Мобільне меню ──
    const menuBtn = document.getElementById("mobile-menu-btn");
    const menuCloseBtn = document.getElementById("mobile-menu-close");
    const menu = document.getElementById("mobile-menu");
    function toggleMobileMenu() {
      if (!menu) return;
      const isOpen = !menu.classList.contains("hidden");
      menu.classList.toggle("hidden", isOpen);
      menu.classList.toggle("flex", !isOpen);
      document.body.style.overflow = isOpen ? "" : "hidden";
      menuBtn?.setAttribute("aria-expanded", String(!isOpen));
    }
    menuBtn?.addEventListener("click", toggleMobileMenu, { signal });
    menuCloseBtn?.addEventListener("click", toggleMobileMenu, { signal });
    menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", toggleMobileMenu, { signal }));

    // iOS Safari: overflow:hidden на body не блокує тач-скрол фону під меню.
    // Якщо контент меню вміщається (нема внутрішнього скролу) — глушимо touchmove,
    // щоб фон не прокручувався. Якщо меню довше за екран — дозволяємо його власний
    // скрол (overscroll-contain не дає передати прокрутку на сторінку).
    menu?.addEventListener(
      "touchmove",
      (e: TouchEvent) => {
        const el = e.currentTarget as HTMLElement;
        if (el.scrollHeight <= el.clientHeight) e.preventDefault();
      },
      { signal, passive: false }
    );

    // ── Картки напрямків: hover/tap toggle ──
    function positionTrustDropdown() {
      const card = document.querySelector<HTMLElement>("[data-trust-item]");
      if (!card) return;
      const detail = card.querySelector<HTMLElement>(".direction-detail");
      if (!detail) return;
      const rect = card.getBoundingClientRect();
      const neededHeight = detail.scrollHeight + 40;
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      card.classList.toggle("direction-card-up", spaceAbove >= neededHeight || spaceAbove > spaceBelow);
    }
    document.querySelector("[data-trust-item]")?.addEventListener("mouseenter", positionTrustDropdown, { signal });

    function toggleDirectionCard(card: HTMLElement, event: Event) {
      const target = event.target as HTMLElement;
      if (target.closest("a, button")) return;
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const sel = window.getSelection();
      if (sel && sel.toString().length > 0) return;
      if (card.hasAttribute("data-trust-item") && !card.classList.contains("is-expanded")) positionTrustDropdown();
      card.classList.toggle("is-expanded");
    }

    document.querySelectorAll<HTMLElement>("[data-direction-card]").forEach((card) => {
      card.addEventListener("click", (e) => toggleDirectionCard(card, e), { signal });
      card.addEventListener(
        "mouseleave",
        () => {
          const sel = window.getSelection();
          if (sel && sel.anchorNode && card.contains(sel.anchorNode)) sel.removeAllRanges();
        },
        { signal }
      );
    });

    // ── FAQ-акордеон ──
    function closeAllFaq() {
      document.querySelectorAll<HTMLElement>("[data-faq] dd").forEach((d) => d.classList.add("hidden"));
      document.querySelectorAll<HTMLElement>("[data-faq] .faq-icon").forEach((i) => (i.style.transform = "rotate(0deg)"));
      document.querySelectorAll<HTMLElement>("[data-faq-toggle]").forEach((b) => b.setAttribute("aria-expanded", "false"));
    }
    function toggleFaq(btn: HTMLElement) {
      const item = btn.closest<HTMLElement>("[data-faq]");
      const answer = item?.querySelector<HTMLElement>("dd");
      if (!item || !answer) return;
      const isOpen = !answer.classList.contains("hidden");
      closeAllFaq();
      if (!isOpen) {
        answer.classList.remove("hidden");
        btn.setAttribute("aria-expanded", "true");
        const icon = item.querySelector<HTMLElement>(".faq-icon");
        if (icon) icon.style.transform = "rotate(45deg)";
      }
    }
    document.querySelectorAll<HTMLElement>("[data-faq-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => toggleFaq(btn), { signal });
    });
    document.querySelectorAll<HTMLElement>("[data-faq-close-all]").forEach((el) => {
      el.addEventListener("click", closeAllFaq, { signal });
    });

    // ── About: вирівнювання фото засновниці по низу бейджів (тільки desktop) ──
    // Рахуємо висоту фото так, щоб низ підпису співпадав з низом сітки бейджів
    // у ЗГОРНУТОМУ стані. Поки текст розгорнуто — не чіпаємо (фото не має рости,
    // натомість бейджі зсуваються вниз).
    function alignFounderPhoto() {
      const photo = document.getElementById("founder-photo") as HTMLImageElement | null;
      const about = document.getElementById("about");
      if (!photo || !about) return;
      if (!window.matchMedia("(min-width: 1024px)").matches) {
        photo.style.height = "";
        return;
      }
      const more = document.getElementById("about-more");
      const expanded = more ? !more.classList.contains("hidden") : false;
      if (expanded) return; // freeze — фото залишається фіксованим
      const col = photo.parentElement;
      const badges = about.querySelector(".card-grid");
      const caption = col?.querySelector("p:last-child");
      if (!col || !badges || !caption) return;
      const imgRect = photo.getBoundingClientRect();
      const after = caption.getBoundingClientRect().bottom - imgRect.bottom; // gap + підпис
      const desired = badges.getBoundingClientRect().bottom - imgRect.top - after;
      if (desired > 0) photo.style.height = `${desired}px`;
    }
    const scheduleAlign = () => {
      alignFounderPhoto(); // одразу (працює навіть коли rAF задроселено у фоні)
      requestAnimationFrame(alignFounderPhoto); // уточнення після повного layout
    };
    scheduleAlign();
    window.addEventListener("load", scheduleAlign, { signal });
    window.addEventListener("resize", scheduleAlign, { signal });
    const founderImg = document.getElementById("founder-photo") as HTMLImageElement | null;
    if (founderImg && !founderImg.complete) founderImg.addEventListener("load", scheduleAlign, { signal });

    // ── About: читати повністю / згорнути ──
    document.getElementById("about-toggle")?.addEventListener(
      "click",
      () => {
        const m = document.getElementById("about-more");
        if (!m) return;
        const shown = !m.classList.contains("hidden");
        m.classList.toggle("hidden", shown);
        const label = document.getElementById("about-toggle-label");
        const icon = document.getElementById("about-toggle-icon");
        if (label) label.textContent = shown ? "Читати повністю" : "Згорнути";
        icon?.classList.toggle("reversed", !shown);
        scheduleAlign(); // згорнули → перерахувати; розгорнули → freeze (no-op)
      },
      { signal }
    );

    // ── LIGHTBOX ──
    let lightboxImages: LightboxPhoto[] = [];
    let lightboxIndex = 0;
    let lightboxAltBase = "";
    let lightboxReturnFocus: HTMLElement | null = null; // куди повернути фокус після закриття

    function renderLightbox() {
      const multi = lightboxImages.length > 1;
      const current = lightboxImages[lightboxIndex];
      const img = document.getElementById("lightbox-img") as HTMLImageElement | null;
      if (!img || !current) return;
      img.src = current.src;
      if (current.alt) {
        img.alt = current.alt;
      } else {
        const base = `${lightboxAltBase}, виготовлення на замовлення, Бориспіль`;
        img.alt = multi ? `${base} — фото ${lightboxIndex + 1} з ${lightboxImages.length}` : base;
      }
      if (current.title) img.title = current.title;
      else img.removeAttribute("title");

      const captionEl = document.getElementById("lightbox-caption");
      if (captionEl) captionEl.textContent = current.caption || "";

      const counterEl = document.getElementById("lightbox-counter");
      if (counterEl) counterEl.textContent = multi ? `${lightboxIndex + 1} / ${lightboxImages.length}` : "";

      const prevBtn = document.getElementById("lightbox-prev");
      const nextBtn = document.getElementById("lightbox-next");
      if (prevBtn) prevBtn.style.display = multi ? "flex" : "none";
      if (nextBtn) nextBtn.style.display = multi ? "flex" : "none";
    }

    function openLightbox(images: LightboxPhoto[], altBase = "", startIndex = 0) {
      lightboxImages = images;
      lightboxAltBase = altBase;
      lightboxIndex = startIndex;
      renderLightbox();
      const lb = document.getElementById("lightbox");
      lb?.classList.remove("hidden");
      lb?.classList.add("flex");
      document.body.style.overflow = "hidden";
      // Переносимо фокус у модалку (кнопка "Закрити" завжди видима)
      (document.getElementById("lightbox-close") as HTMLElement | null)?.focus();
    }

    function closeLightbox() {
      const lb = document.getElementById("lightbox");
      lb?.classList.add("hidden");
      lb?.classList.remove("flex");
      document.body.style.overflow = "";
      // Повертаємо фокус на елемент каталогу, з якого відкрили лайтбокс
      lightboxReturnFocus?.focus();
      lightboxReturnFocus = null;
    }

    function lightboxNav(direction: number) {
      lightboxIndex = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
      renderLightbox();
    }

    document.querySelectorAll<HTMLElement>("[data-lightbox-trigger]").forEach((trigger) => {
      const openFromTrigger = () => {
        const raw = trigger.getAttribute("data-lightbox-photos");
        const altBase = trigger.getAttribute("data-lightbox-alt") || "";
        if (!raw) return;
        try {
          const photos = JSON.parse(raw) as LightboxPhoto[];
          lightboxReturnFocus = trigger; // запам'ятовуємо, куди повернути фокус
          openLightbox(photos, altBase);
        } catch {
          /* noop */
        }
      };
      trigger.addEventListener("click", openFromTrigger, { signal });
      trigger.addEventListener(
        "keydown",
        (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFromTrigger();
          }
        },
        { signal }
      );
    });

    const lightboxBackdrop = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    document.getElementById("lightbox-close")?.addEventListener("click", closeLightbox, { signal });
    document.getElementById("lightbox-prev")?.addEventListener("click", () => lightboxNav(-1), { signal });
    document.getElementById("lightbox-next")?.addEventListener("click", () => lightboxNav(1), { signal });
    lightboxBackdrop?.addEventListener(
      "click",
      (e) => {
        // Клік по будь-якій темній зоні (фон, сцена, footer) закриває лайтбокс.
        // Кнопки мають власні обробники; кліки по фото не доходять сюди (stopPropagation).
        const target = e.target as HTMLElement;
        if (target.closest("button") || target === lightboxImg) return;
        closeLightbox();
      },
      { signal }
    );

    // ── Свайп + тап для лайтбоксу на мобільному/планшеті (замість лише кнопок-стрілок) ──
    // touchmove з preventDefault — інакше на iOS Safari фонова сторінка все одно
    // прокручується/"resinguється" під час свайпу, навіть при overflow:hidden на body.
    let touchStartX = 0;
    let touchStartY = 0;
    let wasSwipe = false;
    lightboxBackdrop?.addEventListener(
      "touchstart",
      (e: TouchEvent) => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
      },
      { signal, passive: true }
    );
    lightboxBackdrop?.addEventListener(
      "touchmove",
      (e: TouchEvent) => {
        e.preventDefault();
      },
      { signal, passive: false }
    );
    lightboxBackdrop?.addEventListener(
      "touchend",
      (e: TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        wasSwipe = Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5;
        if (wasSwipe) lightboxNav(dx < 0 ? 1 : -1);
      },
      { signal, passive: true }
    );
    // Тап (клік/дотик без свайпу) по фото — гортає до наступного, як свайп.
    // wasSwipe гасить дублювання: після реального свайпу мобільний браузер
    // все одно генерує синтетичний click, і без цього прапорця фото
    // перегорталось б одразу двічі за один свайп.
    lightboxImg?.addEventListener(
      "click",
      (e) => {
        e.stopPropagation();
        if (wasSwipe) {
          wasSwipe = false;
          return;
        }
        if (lightboxImages.length > 1) lightboxNav(1);
      },
      { signal }
    );

    document.addEventListener(
      "keydown",
      (e) => {
        const lb = document.getElementById("lightbox");
        if (!lb || lb.classList.contains("hidden")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") lightboxNav(-1);
        if (e.key === "ArrowRight") lightboxNav(1);
        if (e.key === "Tab") {
          // Focus-trap: Tab циклічно ходить лише всередині модалки
          const focusables = Array.from(lb.querySelectorAll<HTMLElement>("button")).filter(
            (b) => b.offsetParent !== null
          );
          if (focusables.length === 0) {
            e.preventDefault();
            return;
          }
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement as HTMLElement | null;
          if (e.shiftKey) {
            if (active === first || !active || !lb.contains(active)) {
              e.preventDefault();
              last.focus();
            }
          } else if (active === last || !active || !lb.contains(active)) {
            e.preventDefault();
            first.focus();
          }
        }
      },
      { signal }
    );

    // ── Карусель відгуків ──
    const reviewsTrack = document.getElementById("reviews-track");
    document.getElementById("reviews-prev")?.addEventListener(
      "click",
      () => reviewsTrack?.scrollBy({ left: -360, behavior: "smooth" }),
      { signal }
    );
    document.getElementById("reviews-next")?.addEventListener(
      "click",
      () => reviewsTrack?.scrollBy({ left: 360, behavior: "smooth" }),
      { signal }
    );

    // ── Крапки-пагінація каруселі відгуків (мобільний) ──
    // Кнопка = тап-зона 44px (клік), внутрішній span = візуальна крапка (активний стан).
    const reviewDotBtns = Array.from(document.querySelectorAll<HTMLElement>("[data-review-dot]"));
    const reviewDotVisuals = Array.from(document.querySelectorAll<HTMLElement>("[data-review-dot-visual]"));
    const reviewCards = reviewsTrack ? (Array.from(reviewsTrack.children) as HTMLElement[]) : [];
    function updateReviewDots() {
      if (!reviewsTrack || reviewDotVisuals.length === 0) return;
      const center = reviewsTrack.scrollLeft + reviewsTrack.clientWidth / 2;
      let activeIdx = 0;
      let min = Infinity;
      reviewCards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(cardCenter - center);
        if (d < min) {
          min = d;
          activeIdx = i;
        }
      });
      reviewDotVisuals.forEach((dot, i) => {
        const on = i === activeIdx;
        dot.style.backgroundColor = on ? "var(--signal)" : "";
        dot.style.width = on ? "20px" : "";
      });
      reviewDotBtns.forEach((btn, i) => {
        if (i === activeIdx) btn.setAttribute("aria-current", "true");
        else btn.removeAttribute("aria-current");
      });
    }
    let reviewDotsRaf = 0;
    reviewsTrack?.addEventListener(
      "scroll",
      () => {
        if (reviewDotsRaf) return;
        reviewDotsRaf = requestAnimationFrame(() => {
          reviewDotsRaf = 0;
          updateReviewDots();
        });
      },
      { passive: true, signal }
    );
    reviewDotBtns.forEach((btn, i) => {
      btn.addEventListener(
        "click",
        () => reviewCards[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }),
        { signal }
      );
    });
    updateReviewDots();

    return () => controller.abort();
  }, []);

  return null;
}
