import { supabaseAdmin } from "@/lib/supabase";
import ContactsLive, { type MessageRow } from "./ContactsLive";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  try {
    const { data } = await supabaseAdmin
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    return <ContactsLive initial={(data ?? []) as MessageRow[]} />;
  } catch {
    return <ContactsLive initial={[]} />;
  }
}
