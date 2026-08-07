import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сторінку не знайдено — Fast Tent",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-mono-label uppercase text-signal mb-4">Помилка 404</p>
      <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Сторінку не знайдено</h1>
      <p className="text-[var(--muted-foreground)] max-w-md mb-10">
        Схоже, такої сторінки не існує або її було переміщено. Поверніться на головну або перегляньте каталог.
      </p>
      <nav className="flex flex-wrap gap-3 justify-center">
        <a href="/" className="btn btn-primary">На головну</a>
        <a href="/#products" className="btn btn-outline">Каталог</a>
        <a href="/#contacts" className="btn btn-outline">Контакти</a>
      </nav>
    </main>
  );
}
