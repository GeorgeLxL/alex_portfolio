import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1) Persist to Supabase so it appears on the admin contacts page in real-time.
    const sb = supabaseAdmin();
    const { error: dbError } = await sb.from("messages").insert({
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      subject: String(subject).slice(0, 200),
      message: String(message).slice(0, 5000),
    });
    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 2) Optional: also send an email via Resend if configured.
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
    if (apiKey && to) {
      const resend = new Resend(apiKey);
      await resend.emails
        .send({
          from,
          to,
          replyTo: email,
          subject: `[Portfolio] ${subject}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        })
        .catch(() => null);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
