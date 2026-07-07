import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_API_URL = 'https://leads.tefor.xyz/api/submit';
const TELEGRAM_BOT_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN || 'iXNyuMHbWStNvnXrJGY0LCImwBHAmBTSRFf78ntwXGU';

export async function POST(req: NextRequest) {
  const { name, phone, message } = await req.json();

  const text = `📝 Новая заявка с сайта ORIENTAVTO:\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n💬 Комментарий: ${message || "не указан"}`;

  try {
    const response = await fetch(TELEGRAM_BOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TELEGRAM_BOT_API_TOKEN}`,
      },
      body: JSON.stringify({
        project_name: "orientauto1.ru",
        message: text,
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Ошибка от телеграм бота" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Ошибка отправки" }, { status: 500 });
  }
}