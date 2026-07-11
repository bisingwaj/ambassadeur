import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Client lié à la session admin (cookies). Respecte la RLS :
 * seuls les utilisateurs authentifiés peuvent lire / modifier les candidatures.
 */
export async function getServerClient() {
  const cookieStore = await cookies();
  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet: CookieToSet[]) => {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Appelé depuis un Server Component — géré par le middleware.
        }
      },
    },
  });
}

/**
 * Client "service role" — contourne la RLS. À N'UTILISER QUE côté serveur
 * (route handlers) pour insérer une candidature ou des opérations d'admin.
 */
export function getServiceClient() {
  if (!url || !serviceKey) {
    throw new Error("Supabase service role non configuré (voir .env).");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
