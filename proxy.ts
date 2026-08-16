import { NextResponse } from "next/server";

// HTML-документ рендериться динамічно (headers() для гео cookie-банера), тому Next.js
// сам ставить Cache-Control: no-store, що блокує bfcache. no-store прибираємо, лишаючи
// приватне без-кешування (жоден спільний/CDN-кеш це не збереже — країна визначається
// на кожен запит окремо, крос-юзерної підміни контенту тут немає).
export function proxy() {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-cache, must-revalidate");
  return response;
}

// Тільки HTML-сторінки, що рендеряться динамічно через headers() (гео-банер).
// НЕ чіпаємо /api/*, /assets/*, /_next/* і статичні файли з public/ (robots.txt,
// sitemap.xml, llms.txt, favicon) — у них власні коректні заголовки кешу.
export const config = {
  matcher: ["/", "/privacy-policy"],
};
