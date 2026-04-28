import { redirect } from "next/navigation";
import SigninForm from "./SigninForm";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SigninPage() {
  try {
    const { count } = await supabaseAdmin.from("admins").select("id", { count: "exact", head: true });
    if ((count ?? 0) === 0) redirect("/admin/signup");
  } catch {}
  return <SigninForm />;
}
