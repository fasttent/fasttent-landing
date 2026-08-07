import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

// Просте in-memory обмеження частоти запитів (на екземпляр функції).
// Захищає від бурстового спаму формою; для строгого захисту між усіма
// інстансами варто винести в Upstash/Redis (див. рекомендацію в аудиті).
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 хв
const RATE_MAX = 5; // не більше 5 заявок з однієї IP за вікно
const rateHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  rateHits.set(ip, recent);
  return recent.length > RATE_MAX;
}

const MAX_NAME = 100;
const MAX_MESSAGE = 5000;
const MAX_EMAIL = 254;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 МБ
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Серверна валідація — дублює клієнтську, бо API можна викликати напряму, минаючи форму.
function validateLead(name: string, phone: string, email: string, message: string): string | null {
  const phoneDigits = phone.replace(/\D/g, "");
  if (!name || name.length > MAX_NAME) return "Некоректне ім'я";
  if (phoneDigits.length < 8 || phoneDigits.length > 15) return "Некоректний номер телефону";
  if (!message || message.length > MAX_MESSAGE) return "Некоректне повідомлення";
  if (email && (email.length > MAX_EMAIL || !EMAIL_RE.test(email))) return "Некоректний email";
  return null;
}

async function forwardToKeepinCrm(payload: {
  name: string;
  phone: string;
  email: string;
  message: string;
  file_url: string | null;
}): Promise<{ synced: boolean; error: string | null }> {
  const webhookUrl = process.env.KEEPINCRM_WEBHOOK_URL;
  if (!webhookUrl) {
    return { synced: false, error: "KEEPINCRM_WEBHOOK_URL не налаштований" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact_name: payload.name,
        phone: payload.phone,
        email: payload.email || null,
        message: payload.message,
        deal_name: `Заявка з сайту — ${payload.name}`,
        file_url: payload.file_url,
        source: "website",
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { synced: false, error: `KeepinCRM webhook status ${res.status}` };
    }
    return { synced: true, error: null };
  } catch (err) {
    return { synced: false, error: err instanceof Error ? err.message : "Невідома помилка вебхука" };
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Забагато запитів. Спробуйте пізніше." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Некоректний формат запиту" }, { status: 400 });
  }

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const file = formData.get("file");

  const validationError = validateLead(name, phone, email, message);
  if (validationError) {
    return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  let file_url: string | null = null;
  if (file instanceof File && file.size > 0 && file.size <= MAX_FILE_BYTES) {
    const path = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("contact-attachments")
      .upload(path, file);

    if (!uploadError) {
      const { data } = supabase.storage.from("contact-attachments").getPublicUrl(path);
      file_url = data.publicUrl;
    }
  }

  const { synced, error: crmError } = await forwardToKeepinCrm({ name, phone, email, message, file_url });

  const { error: insertError } = await supabase.from("leads").insert([
    {
      name,
      phone,
      email: email || null,
      message,
      file_url,
      source: "website",
      synced_to_crm: synced,
      crm_sync_error: crmError,
    },
  ]);

  if (insertError) {
    return NextResponse.json({ ok: false, error: "Не вдалося зберегти заявку" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
