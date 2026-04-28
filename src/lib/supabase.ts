import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");

// Public, safe-for-browser client (subject to RLS).
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Server-only admin client. Uses the service-role key (bypasses RLS).
// Lazy-initialised so client bundles never need SUPABASE_SERVICE_ROLE_KEY.
let _admin: SupabaseClient | null = null;
function adminClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin must not be used on the client");
  }
  if (_admin) return _admin;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!service) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set — add it to .env.local and restart the dev server"
    );
  }
  _admin = createClient(url!, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}

// Expose as a Proxy so existing call-sites keep working: supabaseAdmin.from(...)
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = adminClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
