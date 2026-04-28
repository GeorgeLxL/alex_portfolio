import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_USER_ID, signSession, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId, password } = await req.json();

    if (typeof userId !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    if (userId !== ADMIN_USER_ID) {
      return NextResponse.json(
        { error: "Invalid admin id" },
        { status: 403 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const sb = supabaseAdmin();

    const { count, error: countErr } = await sb
      .from("admins")
      .select("id", { count: "exact", head: true });
    if (countErr) return NextResponse.json({ error: countErr.message }, { status: 500 });
    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { data, error } = await sb
      .from("admins")
      .insert({ user_id: userId, password_hash })
      .select("id, user_id")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Failed to create admin" },
        { status: 500 }
      );
    }

    const token = await signSession({ sub: data.id, userId: data.user_id });
    await setSessionCookie(token);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
