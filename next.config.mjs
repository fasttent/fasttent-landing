/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Статичні ассети з /public (не фінгерпринтяться Next-ом) — довгий кеш із
        // фоновою ревалідацією: 1 день "свіжі", далі рік віддаються з кешу поки оновлюються.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=31536000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
