"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import type { CandidatureStatus } from "@/lib/types";

const VALID: CandidatureStatus[] = ["nouveau", "en_revue", "accepte", "refuse"];

function revalidateAdmin() {
  revalidatePath("/shaka");
  revalidatePath("/shaka/candidatures");
}

export async function updateStatus(id: string, status: CandidatureStatus) {
  if (!VALID.includes(status)) throw new Error("Statut invalide.");
  const supabase = await getServerClient();
  const { error } = await supabase.from("candidatures").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAdmin();
  revalidatePath(`/shaka/candidatures/${id}`);
}

export async function updateStatusBulk(ids: string[], status: CandidatureStatus) {
  if (!VALID.includes(status)) throw new Error("Statut invalide.");
  if (!ids.length) return;
  const supabase = await getServerClient();
  const { error } = await supabase.from("candidatures").update({ status }).in("id", ids);
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function signOut() {
  const supabase = await getServerClient();
  await supabase.auth.signOut();
  redirect("/shaka/login");
}
