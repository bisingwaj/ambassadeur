import { NextResponse } from "next/server";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { QUESTIONS, COMMUNES } from "@/lib/questions";
import { isValidTel, telCanonical } from "@/lib/format";

export const runtime = "nodejs";

// Valeurs autorisées par question de type « choix » — toute autre valeur est rejetée.
const OPTIONS: Record<string, string[]> = {};
for (const q of QUESTIONS) {
  if (q.type === "yesno") OPTIONS[q.key] = ["Oui", "Non"];
  else if (q.type === "grid") OPTIONS[q.key] = COMMUNES;
  else if (q.options) OPTIONS[q.key] = q.options;
}
const CHOICE = new Set(["single", "yesno", "grid"]);
const MAXLEN: Record<string, number> = { nom: 120, quartier: 80, avenue: 120, numero: 20, email: 160, tel: 40, publics: 2000, idees: 2000 };
const DEFAULT_MAXLEN = 200;
const MAX_MULTI = 12;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // ── Honeypot anti-bot : champ invisible « website ». Rempli = bot. ──────
  // On renvoie un faux succès pour ne pas révéler le mécanisme.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, ref: "EB01-00000" });
  }

  if (body.consent !== true) {
    return NextResponse.json({ error: "Consentement requis." }, { status: 400 });
  }

  const row: Record<string, unknown> = {};

  for (const q of QUESTIONS) {
    const raw = body[q.key];

    if (q.type === "multi") {
      const allowed = OPTIONS[q.key] || [];
      const arr = Array.isArray(raw)
        ? [...new Set(raw.filter((x): x is string => typeof x === "string" && allowed.includes(x)))].slice(0, MAX_MULTI)
        : [];
      if (!q.optional && arr.length === 0) {
        return NextResponse.json({ error: `Champ requis : ${q.label}` }, { status: 400 });
      }
      row[q.key] = arr.length ? arr : null;
      continue;
    }

    if (CHOICE.has(q.type)) {
      const val = typeof raw === "string" ? raw : "";
      const allowed = OPTIONS[q.key] || [];
      const ok = allowed.includes(val);
      if (!q.optional && !ok) {
        return NextResponse.json({ error: `Réponse invalide : ${q.label}` }, { status: 400 });
      }
      row[q.key] = ok ? val : null;
      continue;
    }

    // text / email / tel / textarea
    const val = str(raw, MAXLEN[q.key] ?? DEFAULT_MAXLEN);
    if (!q.optional && !val) {
      return NextResponse.json({ error: `Champ requis : ${q.label}` }, { status: 400 });
    }
    if (q.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      return NextResponse.json({ error: "E-mail invalide." }, { status: 400 });
    }
    row[q.key] = val || null;
  }

  // Téléphone : normalisation canonique +243XXXXXXXXX (validé strictement).
  const telRaw = typeof body.tel === "string" ? body.tel : "";
  if (!isValidTel(telRaw)) {
    return NextResponse.json({ error: "Numéro WhatsApp invalide (9 chiffres après +243)." }, { status: 400 });
  }
  row.tel = telCanonical(telRaw);

  const nom = row.nom as string;
  row.prenom = nom.split(/\s+/)[0] || null;
  row.consent = true;
  row.meta = {
    ua: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    submitted_at: new Date().toISOString(),
  };

  // ── Mode démo (Supabase non configuré) ─────────────────────────────────
  if (!isSupabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: true, ref: "EB01-" + String(Date.now()).slice(-5), demo: true });
  }

  try {
    const supabase = getServiceClient();
    const { data: refData, error: refErr } = await supabase.rpc("next_candidature_ref");
    const ref = !refErr && typeof refData === "string" ? refData : "EB01-" + String(Date.now()).slice(-5);

    const { error } = await supabase.from("candidatures").insert({ ref, ...row });
    if (error) {
      console.error("[candidatures] insert error:", error.message);
      return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, ref });
  } catch (e) {
    console.error("[candidatures] exception:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
