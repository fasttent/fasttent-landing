/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image віддаватиме AVIF/WebP для перекладених зображень
    formats: ["image/avif", "image/webp"],
    // Next.js 16: default qualities = [75]; додаємо 35 для розмитого фону (quality={35})
    qualities: [35, 75],
  },
  async headers() {
    return [
      {
        // Заголовки безпеки для всіх сторінок.
        // CSP свідомо НЕ обмежує скрипти/картинки/запити: через GTM клієнт підключає
        // Ringostat, GA4, Google Ads — жорсткий список доменів тихо ламав би їх.
        // Закриваємо те, що безпечно: вбудовування сайту в чужі iframe, плагіни,
        // підміну <base>, відправку форм на чужі домени, змішаний http-контент.
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), browsing-topics=()" },
        ],
      },
      {
        // Статичні ассети з /public не фінгерпринтяться, але й не змінюються без
        // нового деплою — тримаємо рік immutable (Vercel інвалідує при деплої).
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
