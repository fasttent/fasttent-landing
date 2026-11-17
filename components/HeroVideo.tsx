"use client";

import { useEffect, useRef } from "react";

// Фонове відео Hero «Шлях тенту» (16 с, по колу, без звуку).
// Два варіанти: 16:9 для десктопу і вертикальний 9:16 для телефону (кожна сцена кадрована окремо).
// CSS показує потрібний за шириною екрана; файл вантажимо лише для видимого
// і лише коли в системі не вимкнені анімації та не ввімкнено «економію трафіку».
// Інакше лишається статична картинка (див. globals.css).
const DESKTOP = "(min-width: 768px)";
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

function startVideo(video: HTMLVideoElement | null, src: string) {
  if (!video || video.getAttribute("src")) return;
  video.muted = true; // без цього браузери не дають автозапуск
  video.src = src;
  video.play().catch(() => {});
}

export default function HeroVideo() {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    const motion = window.matchMedia(MOTION_OK);
    const desktop = window.matchMedia(DESKTOP);
    const update = () => {
      if (!motion.matches) return;
      if (desktop.matches) startVideo(desktopRef.current, "/assets/hero-video.mp4");
      else startVideo(mobileRef.current, "/assets/hero-video-mobile.mp4");
    };
    update();
    motion.addEventListener("change", update);
    desktop.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
    };
  }, []);

  return (
    <>
      <div className="hero-video hero-video--desktop" aria-hidden="true">
        <video ref={desktopRef} muted loop playsInline preload="none" poster="/assets/hero-video-poster.webp" />
      </div>
      <div className="hero-video hero-video--mobile" aria-hidden="true">
        <video ref={mobileRef} muted loop playsInline preload="none" poster="/assets/hero-video-mobile-poster.webp" />
      </div>
    </>
  );
}
