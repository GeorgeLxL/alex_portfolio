import { supabaseAdmin } from "@/lib/supabase/admin";
import ContactsLive, { type MessageRow } from "./ContactsLive";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return <ContactsLive initial={(data ?? []) as MessageRow[]} />;
}
