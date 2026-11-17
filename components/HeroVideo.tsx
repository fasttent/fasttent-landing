"use client";

import { useEffect, useRef } from "react";

// Фонове відео Hero «Шлях тенту» (16 с, по колу, без звуку).
// Два варіанти: 16:9 для десктопу і вертикальний 9:16 для телефону (кожна сцена кадрована окремо).
// CSS показує потрібний за шириною екрана; файл вантажимо лише для видимого
// і лише коли в системі не вимкнені анімації та не ввімкнено «економію трафіку».
// Інакше лишається статична картинка (див. globals.css).
// /assets кешуються на рік: після заміни файлу відео/постера збільшуй ?v=N.
//
// Під відео (партнери, плашки) — «ambient»-продовження: нижня смуга кожного кадру
// стискається в canvas шириною 1 px (середній колір по всій ширині, лише зміна згори вниз),
// браузер розтягує й розмиває його. Кольори продовжують поточну сцену без шва,
// але без плям від окремих світлих об'єктів (вагони, траса) не в тих місцях.
const DESKTOP = "(min-width: 768px)";
const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const SLICE = 0.35; // яку частку кадру знизу беремо для продовження (більше — м'якше, без окремих плям)

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
};

function startVideo(video: HTMLVideoElement | null, src: string) {
  if (!video || video.getAttribute("src")) return;
  video.muted = true; // без цього браузери не дають автозапуск
  video.src = src;
  video.play().catch(() => {});
}

// Малює нижню смугу кадру в canvas на кожному новому кадрі відео
function runAmbient(video: VideoWithRVFC, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  let stopped = false;
  let first = true;
  const draw = () => {
    if (stopped) return;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (vw && vh) {
      const sy = vh * (1 - SLICE);
      // Згладжування в часі: новий кадр лише трохи підмішується до попереднього
      // (≈1 с на повну зміну), тому дрібні деталі лісу/вагонів не дають мерехтіння,
      // а зміна сцени перетікає плавно.
      ctx.globalAlpha = first ? 1 : 0.06;
      ctx.drawImage(video, 0, sy, vw, vh - sy, 0, 0, canvas.width, canvas.height);
      first = false;
    }
    if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(draw);
    else requestAnimationFrame(draw);
  };
  draw();
  return () => {
    stopped = true;
  };
}

export default function HeroVideo() {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLCanvasElement>(null);
  const ambientMobileRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    const motion = window.matchMedia(MOTION_OK);
    const desktop = window.matchMedia(DESKTOP);
    let stopAmbient: (() => void) | null = null;
    let stopAmbientMobile: (() => void) | null = null;

    const update = () => {
      if (!motion.matches) return;
      if (desktop.matches) {
        startVideo(desktopRef.current, "/assets/hero-video.mp4?v=2");
        if (!stopAmbient && desktopRef.current && ambientRef.current) {
          stopAmbient = runAmbient(desktopRef.current, ambientRef.current);
        }
      } else {
        startVideo(mobileRef.current, "/assets/hero-video-mobile.mp4?v=4");
        if (!stopAmbientMobile && mobileRef.current && ambientMobileRef.current) {
          stopAmbientMobile = runAmbient(mobileRef.current, ambientMobileRef.current);
        }
      }
    };
    update();
    motion.addEventListener("change", update);
    desktop.addEventListener("change", update);

    // Відео не крутиться, коли Hero прокручено з екрана
    const section = desktopRef.current?.closest("section");
    const io = section
      ? new IntersectionObserver(([entry]) => {
          for (const v of [desktopRef.current, mobileRef.current]) {
            if (!v || !v.getAttribute("src")) continue;
            if (entry.isIntersecting) v.play().catch(() => {});
            else v.pause();
          }
        })
      : null;
    if (section && io) io.observe(section);

    return () => {
      motion.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
      io?.disconnect();
      stopAmbient?.();
      stopAmbientMobile?.();
    };
  }, []);

  return (
    <>
      <div className="hero-video hero-video--desktop" aria-hidden="true">
        <canvas ref={ambientRef} className="hero-video-ambient" width={1} height={4} />
        <video ref={desktopRef} muted loop playsInline preload="none" poster="/assets/hero-video-poster.webp?v=2" />
      </div>
      <div className="hero-video hero-video--mobile" aria-hidden="true">
        <canvas ref={ambientMobileRef} className="hero-video-ambient" width={1} height={4} />
        <video ref={mobileRef} muted loop playsInline preload="none" poster="/assets/hero-video-mobile-poster.webp?v=3" />
      </div>
    </>
  );
}
