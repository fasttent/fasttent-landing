import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Визначає країну відвідувача за geo-заголовком, який Vercel додає на edge.
// Використовується формою, щоб підставити код країни за замовчуванням.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const h = headers();
  const country =
    h.get("x-vercel-ip-country") || // Vercel
    h.get("cf-ipcountry") || // Cloudflare (на випадок іншого проксі)
    "";

  return NextResponse.json(
    { country: country ? country.toLowerCase() : null },
    { headers: { "Cache-Control": "no-store" } }
  );
}
