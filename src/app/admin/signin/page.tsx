import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import SigninForm from "./SigninForm";

export const dynamic = "force-dynamic";

export default async function SigninPage() {
  const sb = supabaseAdmin();
  const { count } = await sb
    .from("admins")
    .select("id", { count: "exact", head: true });
  const adminExists = (count ?? 0) > 0;
  if (!adminExists) redirect("/admin/signup");
  return <SigninForm />;
}
