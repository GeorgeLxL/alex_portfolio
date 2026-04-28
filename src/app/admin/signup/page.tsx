import { redirect } from "next/navigation";
import SignupForm from "./SignupForm";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  try {
    const { count } = await supabaseAdmin.from("admins").select("id", { count: "exact", head: true });
    if ((count ?? 0) > 0) redirect("/admin/signin");
  } catch {}
  return <SignupForm />;
}
