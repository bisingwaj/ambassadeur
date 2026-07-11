import { createBrowserClient } from "@supabase/ssr";

/** Client navigateur — utilisé par la page de connexion admin. */
export function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
