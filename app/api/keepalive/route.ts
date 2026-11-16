import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Безкоштовний Supabase засинає після ~7 днів без запитів — тоді форма заявок
// падає з помилкою. Vercel Cron (vercel.json) викликає цей маршрут щодня,
// а маршрут робить один легкий запит до бази, щоб вона не простоювала.
export async function GET(req: NextRequest) {
  // Якщо у Vercel задано CRON_SECRET, Vercel сам додає цей заголовок до cron-запиту.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("leads").select("id", { count: "exact", head: true });
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
