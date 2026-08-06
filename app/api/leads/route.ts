import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

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

  if (!name || !phone || !message) {
    return NextResponse.json({ ok: false, error: "Заповніть обов'язкові поля" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  let file_url: string | null = null;
  if (file instanceof File && file.size > 0) {
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
