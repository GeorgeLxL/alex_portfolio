import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import SignupForm from "./SignupForm";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const sb = supabaseAdmin();
  const { count } = await sb
    .from("admins")
    .select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) redirect("/admin/signin");
  return <SignupForm />;
}
