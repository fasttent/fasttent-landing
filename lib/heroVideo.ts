// Спільні налаштування фонового відео Hero (серверна і клієнтська частини).
// /assets кешуються на рік: після заміни файлу відео/постера збільшуй ?v=N.
export const DESKTOP = "(min-width: 768px)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const SRC_DESKTOP = "/assets/hero-video.mp4?v=2";
export const SRC_MOBILE = "/assets/hero-video-mobile.mp4?v=7";

// Ранній скрипт у <head> (Script beforeInteractive у app/layout.tsx): чекає, поки під час
// розбору HTML з'явиться потрібне <video>, і одразу ставить src — не чекаючи завантаження
// й запуску JS-бандла (на iPhone це секунди).
export const EARLY_START = `(function(){try{
var c=navigator.connection;if(c&&c.saveData)return;
if(!matchMedia(${JSON.stringify(MOTION_OK)}).matches)return;
var d=matchMedia(${JSON.stringify(DESKTOP)}).matches,id=d?"hero-video-d":"hero-video-m";
var go=function(v){if(v.getAttribute("src"))return;v.muted=true;v.defaultMuted=true;v.setAttribute("muted","");
v.src=d?${JSON.stringify(SRC_DESKTOP)}:${JSON.stringify(SRC_MOBILE)};var p=v.play();if(p&&p.catch)p.catch(function(){});};
var v=document.getElementById(id);if(v)return go(v);
var mo=new MutationObserver(function(){var e=document.getElementById(id);if(e){mo.disconnect();go(e);}});
mo.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener("DOMContentLoaded",function(){mo.disconnect();},{once:true});
}catch(e){}})();`;
