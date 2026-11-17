"use client";

import { useEffect, useRef } from "react";

// Фонове відео Hero «Шлях тенту» (16 с, по колу, без звуку).
// Вантажимо файл лише на десктопі й лише коли в системі не вимкнені анімації:
// на телефоні та при prefers-reduced-motion показується статична картинка (див. globals.css).
const VIDEO_SRC = "/assets/hero-video.mp4";
const QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia(QUERY);
    const start = () => {
      if (!mq.matches || video.getAttribute("src")) return;
      video.muted = true; // без цього браузери не дають автозапуск
      video.src = VIDEO_SRC;
      video.play().catch(() => {});
    };
    start();
    mq.addEventListener("change", start);
    return () => mq.removeEventListener("change", start);
  }, []);

  return (
    <div className="hero-video" aria-hidden="true">
      <video ref={ref} muted loop playsInline preload="none" poster="/assets/hero-video-poster.webp" />
    </div>
  );
}
