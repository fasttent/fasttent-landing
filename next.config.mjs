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
