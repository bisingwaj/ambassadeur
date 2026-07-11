import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

/** Compteur public "X / 500" = base configurée + candidatures réelles. */
export async function getCohortCount(): Promise<number> {
  if (!isSupabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return SITE.cohorte.base;
  }
  try {
    const supabase = getServiceClient();
    const { count } = await supabase
      .from("candidatures")
      .select("*", { count: "exact", head: true });
    return SITE.cohorte.base + (count ?? 0);
  } catch {
    return SITE.cohorte.base;
  }
}
