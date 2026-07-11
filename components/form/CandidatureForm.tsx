"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QUESTIONS, COMMUNES, type Question } from "@/lib/questions";
import { telDigits, isValidTel, telCanonical, groupTelInput } from "@/lib/format";

// ── Styles issus du prototype (fidèles) ─────────────────────────────────
const ROW: React.CSSProperties = { display: "flex", alignItems: "center", gap: 13, width: "100%", background: "#fff", border: "1px solid #DCE1EC", padding: "15px 17px", cursor: "pointer", font: "600 clamp(15.5px,3.6vw,17.5px)/1.3 var(--font-schibsted),sans-serif", color: "#0B1B34", transition: "border-color .15s, background .15s, box-shadow .15s", textAlign: "left" };
const LET: React.CSSProperties = { width: 26, height: 26, flex: "none", border: "1px solid #DCE1EC", background: "#fff", color: "#98A2B6", display: "flex", alignItems: "center", justifyContent: "center", font: "600 12px/1 var(--font-plex-mono),monospace", transition: "all .15s" };
const YN: React.CSSProperties = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", border: "1px solid #DCE1EC", padding: "26px 16px", cursor: "pointer", font: "700 clamp(18px,4vw,21px)/1 var(--font-schibsted),sans-serif", color: "#0B1B34", transition: "border-color .15s, background .15s, box-shadow .15s" };
const GRID: React.CSSProperties = { display: "block", width: "100%", textAlign: "left", background: "#fff", border: "1px solid #DCE1EC", padding: "12px 13px", cursor: "pointer", font: "600 14.5px/1.2 var(--font-schibsted),sans-serif", color: "#0B1B34", transition: "border-color .15s, background .15s, box-shadow .15s" };
const INP: React.CSSProperties = { width: "100%", border: "none", borderBottom: "2px solid #D7DEEA", background: "transparent", padding: "10px 8px 12px 2px", font: "600 clamp(20px,4.6vw,26px)/1.3 var(--font-schibsted),sans-serif", color: "#0B1B34", outline: "none", caretColor: "#2E6AE0" };
const AREA: React.CSSProperties = { width: "100%", border: "1px solid #D7DEEA", background: "#fff", padding: "14px 16px", font: "500 17px/1.55 var(--font-schibsted),sans-serif", color: "#0B1B34", outline: "none", minHeight: 120, resize: "vertical" };

const SELECTED = { borderColor: "#2E6AE0", background: "#F1F6FE", boxShadow: "inset 0 0 0 1px #2E6AE0" };

type DataMap = Record<string, string | string[]>;

const LETTERS = "ABCDEFGH";
const TOTAL = QUESTIONS.length;

export default function CandidatureForm() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = accueil, 1..TOTAL = questions, TOTAL+1 = relecture
  const [data, setData] = useState<DataMap>({ langues: [], secteurs: [] });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentErr, setConsentErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const advTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hpRef = useRef<HTMLInputElement>(null); // honeypot anti-bot
  const lockRef = useRef(false); // verrou synchrone anti-double-soumission

  const isWelcome = step === 0;
  const isReview = step === TOTAL + 1;
  const isQuestion = step >= 1 && step <= TOTAL;
  const q = isQuestion ? QUESTIONS[step - 1] : null;
  const pct = isWelcome ? 0 : isReview ? 100 : (step / TOTAL) * 100;

  const optionsFor = (qq: Question): string[] =>
    qq.type === "yesno" ? ["Oui", "Non"] : qq.type === "grid" ? COMMUNES : qq.options || [];

  const validate = useCallback((qq: Question): string | null => {
    if (qq.optional) return null;
    const v = data[qq.key];
    if (qq.type === "multi") return Array.isArray(v) && v.length ? null : "Choisis au moins une option.";
    if (qq.type === "single" || qq.type === "yesno" || qq.type === "grid")
      return v ? null : qq.errMsg || "Sélectionne une réponse.";
    const s = typeof v === "string" ? v.trim() : "";
    if (!s) return "Cette réponse est requise.";
    if (qq.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return "Cet e-mail semble invalide.";
    if (qq.type === "tel" && !isValidTel(s)) return "Entre les 9 chiffres de ton numéro (ex. 812 345 678).";
    return null;
  }, [data]);

  const go = useCallback((n: number) => {
    if (advTimer.current) clearTimeout(advTimer.current);
    setError(null);
    setStep(n);
  }, []);

  const next = useCallback(() => {
    if (step === 0) return go(1);
    if (isQuestion && q) {
      const err = validate(q);
      if (err) return setError(err);
      go(step + 1);
    }
  }, [step, isQuestion, q, validate, go]);

  const back = () => go(Math.max(0, step - 1));

  const setValue = (key: string, v: string | string[]) => {
    setData((d) => ({ ...d, [key]: v }));
    setError(null);
  };

  const choose = (key: string, v: string) => {
    setValue(key, v);
    if (advTimer.current) clearTimeout(advTimer.current);
    advTimer.current = setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL + 1)), 300);
  };

  const toggleMulti = (key: string, opt: string) => {
    setData((d) => {
      const cur = Array.isArray(d[key]) ? [...(d[key] as string[])] : [];
      const i = cur.indexOf(opt);
      if (i >= 0) cur.splice(i, 1);
      else cur.push(opt);
      return { ...d, [key]: cur };
    });
    setError(null);
  };

  const submit = useCallback(async () => {
    if (submitting || lockRef.current) return;
    for (let i = 0; i < TOTAL; i++) {
      const err = validate(QUESTIONS[i]);
      if (err) { setStep(i + 1); setError(err); return; }
    }
    if (!consent) { setConsentErr("Merci de cocher cette case pour continuer."); return; }
    lockRef.current = true;
    setSubmitting(true);
    setError(null);

    const payload = {
      nom: (data.nom as string) || "",
      age: data.age as string, genre: data.genre as string,
      commune: data.commune as string, quartier: data.quartier as string,
      avenue: data.avenue as string, numero: data.numero as string,
      langues: (data.langues as string[]) || [], email: data.email as string, tel: telCanonical(data.tel as string),
      secteurs: (data.secteurs as string[]) || [], parole: data.parole as string,
      secourisme: data.secourisme as string, experience: data.experience as string,
      soir: data.soir as string, weekend: data.weekend as string, formation: data.formation as string,
      jours: data.jours as string, publics: data.publics as string, idees: data.idees as string,
      consent: true,
      website: hpRef.current?.value || "", // honeypot — doit rester vide
    };

    try {
      const res = await fetch("/api/candidatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Envoi impossible.");
      try {
        // On ne conserve QUE le minimum pour la page de confirmation.
        // Pas de PII (nom complet, tél, e-mail, réponses) laissée dans le navigateur.
        localStorage.setItem("eb_candidature", JSON.stringify({ ref: json.ref, prenom: payload.nom.split(/\s+/)[0] }));
      } catch {}
      router.push(`/confirmation?ref=${encodeURIComponent(json.ref)}`);
    } catch (e) {
      lockRef.current = false;
      setSubmitting(false);
      setError(e instanceof Error ? e.message : "Une erreur est survenue. Réessaie.");
    }
  }, [submitting, validate, consent, data, router]);

  // Focus des champs texte à chaque étape
  useEffect(() => {
    if (isQuestion && q && ["text", "email", "tel", "textarea"].includes(q.type)) {
      const t = setTimeout(() => inputRef.current?.focus(), 90);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [step, isQuestion, q]);

  // Clavier : Entrée pour avancer, chiffres pour les choix
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (submitting) return;
      if (e.key === "Enter") {
        if (q?.type === "textarea") return;
        e.preventDefault();
        if (isReview) submit();
        else next();
        return;
      }
      if (q && (q.type === "single" || q.type === "yesno") && /^[1-9]$/.test(e.key)) {
        const opts = optionsFor(q);
        const i = parseInt(e.key, 10) - 1;
        if (i >= 0 && i < opts.length) choose(q.key, opts[i]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, isReview, submitting, next, submit]);

  // ── Rendu ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100dvh", background: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Barre de progression */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff", borderBottom: "1px solid #EDF0F5" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "14px clamp(18px,5vw,28px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#2E6AE0", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg viewBox="0 0 100 100" style={{ width: 13, height: 13 }}><polygon points="50,2 61.76,33.82 95.65,35.17 69.02,56.18 78.22,88.83 50,70 21.78,88.83 30.98,56.18 4.35,35.17 38.24,33.82" fill="#fff" /></svg>
            </span>
            <span style={{ fontWeight: 800, fontSize: 14.5, color: "#0B1B34", letterSpacing: "-.02em" }}>Étoile Bleue</span>
          </Link>
          <span style={{ font: "500 12.5px/1 var(--font-plex-mono),monospace", color: "#98A2B6" }}>
            {isQuestion ? `${String(step).padStart(2, "0")} / ${TOTAL}` : isReview ? "Relecture" : "Candidature"}
          </span>
        </div>
        <div style={{ height: 3, background: "#EDF0F5" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#2E6AE0", transition: "width .5s cubic-bezier(.4,0,.2,1)" }} />
        </div>
      </div>

      <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", animation: "ebfade .38s ease" }}>
        <div style={{ width: "100%", maxWidth: 680, margin: "0 auto", padding: "clamp(32px,7vw,64px) clamp(18px,5vw,28px)" }}>

          {/* ── Accueil ── */}
          {isWelcome && (
            <div>
              <div style={{ font: "600 12px/1.5 var(--font-schibsted),sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A6478", marginBottom: 18 }}>
                Cohorte 01 · Kinshasa
              </div>
              <h1 style={{ font: "800 clamp(1.9rem,6vw,3rem)/1.06 var(--font-schibsted),sans-serif", letterSpacing: "-.025em", color: "#0B1B34", margin: "0 0 18px", maxWidth: "18ch" }}>
                Deviens Ambassadeur Communautaire.
              </h1>
              <p style={{ font: "400 clamp(15.5px,2.4vw,18px)/1.6 var(--font-schibsted),sans-serif", color: "#48526A", margin: "0 0 30px", maxWidth: "48ch" }}>
                20 questions rapides, environ 4 minutes. Pas de diplôme requis — juste l&apos;envie d&apos;agir pour ton quartier.
              </p>
              <button onClick={next} className="eb-cta" style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 16.5, padding: "16px 28px" }}>
                Commencer <span aria-hidden>→</span>
              </button>
              <p style={{ font: "400 13px/1.5 var(--font-schibsted),sans-serif", color: "#98A2B6", margin: "18px 0 0" }}>
                Appuie sur <strong style={{ color: "#5A6478" }}>Entrée ↵</strong> pour avancer.
              </p>
            </div>
          )}

          {/* ── Question ── */}
          {isQuestion && q && (
            <div>
              <div style={{ font: "500 12.5px/1 var(--font-plex-mono),monospace", color: "#2E6AE0", marginBottom: 14 }}>
                Question {String(step).padStart(2, "0")}
              </div>
              <h2 style={{ font: "800 clamp(1.5rem,5vw,2.3rem)/1.15 var(--font-schibsted),sans-serif", letterSpacing: "-.02em", color: "#0B1B34", margin: "0 0 10px", maxWidth: "22ch" }}>
                {q.q}
              </h2>
              {q.help && <p style={{ font: "400 clamp(14px,2vw,15.5px)/1.5 var(--font-schibsted),sans-serif", color: "#7A8398", margin: "0 0 26px" }}>{q.help}</p>}

              {/* Texte / email */}
              {(q.type === "text" || q.type === "email") && (
                <input
                  ref={inputRef as React.Ref<HTMLInputElement>}
                  type={q.type === "email" ? "email" : "text"}
                  inputMode={q.type === "email" ? "email" : "text"}
                  placeholder={q.ph}
                  value={(data[q.key] as string) || ""}
                  onChange={(e) => setValue(q.key, e.target.value)}
                  style={{ ...INP, borderBottomColor: error ? "#C8402C" : "#D7DEEA" }}
                />
              )}

              {/* Téléphone : préfixe +243 fixe + 9 chiffres */}
              {q.type === "tel" && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, borderBottom: `2px solid ${error ? "#C8402C" : "#D7DEEA"}` }}>
                  <span style={{ font: "600 clamp(20px,4.6vw,26px)/1.3 var(--font-schibsted),sans-serif", color: "#98A2B6", paddingBottom: 12, flex: "none", userSelect: "none" }}>+243</span>
                  <input
                    ref={inputRef as React.Ref<HTMLInputElement>}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder={q.ph}
                    value={groupTelInput((data[q.key] as string) || "")}
                    onChange={(e) => setValue(q.key, telDigits(e.target.value))}
                    style={{ ...INP, border: "none", borderBottom: "none", padding: "10px 8px 12px 0" }}
                  />
                </div>
              )}

              {/* Zone de texte */}
              {q.type === "textarea" && (
                <textarea
                  ref={inputRef as React.Ref<HTMLTextAreaElement>}
                  placeholder={q.ph || "Écris ici… (optionnel)"}
                  value={(data[q.key] as string) || ""}
                  onChange={(e) => setValue(q.key, e.target.value)}
                  style={AREA}
                />
              )}

              {/* Choix simple / multiple */}
              {(q.type === "single" || q.type === "multi") && (
                <div style={{ display: "grid", gap: 10 }}>
                  {optionsFor(q).map((op, i) => {
                    const sel = q.type === "multi"
                      ? Array.isArray(data[q.key]) && (data[q.key] as string[]).includes(op)
                      : data[q.key] === op;
                    return (
                      <button
                        key={op}
                        onClick={() => (q.type === "multi" ? toggleMulti(q.key, op) : choose(q.key, op))}
                        style={{ ...ROW, ...(sel ? SELECTED : null) }}
                      >
                        <span style={{ ...LET, ...(sel ? { background: "#2E6AE0", borderColor: "#2E6AE0", color: "#fff" } : null) }}>
                          {sel && q.type === "multi" ? "✓" : LETTERS[i] || ""}
                        </span>
                        <span>{op}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Oui / Non */}
              {q.type === "yesno" && (
                <div style={{ display: "flex", gap: 12 }}>
                  {["Oui", "Non"].map((op) => {
                    const sel = data[q.key] === op;
                    return (
                      <button key={op} onClick={() => choose(q.key, op)} style={{ ...YN, ...(sel ? { ...SELECTED, color: "#2E6AE0" } : null) }}>
                        {op}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Grille des communes */}
              {q.type === "grid" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 8 }}>
                  {COMMUNES.map((op) => {
                    const sel = data[q.key] === op;
                    return (
                      <button key={op} onClick={() => choose(q.key, op)} style={{ ...GRID, ...(sel ? { ...SELECTED, color: "#1848B8" } : null) }}>
                        {op}
                      </button>
                    );
                  })}
                </div>
              )}

              {error && <p style={{ font: "600 14px/1.4 var(--font-schibsted),sans-serif", color: "#C8402C", margin: "18px 0 0" }}>{error}</p>}

              {/* Navigation */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30 }}>
                <button onClick={back} style={{ background: "none", border: "none", cursor: "pointer", font: "600 15px/1 var(--font-schibsted),sans-serif", color: "#98A2B6", padding: "10px 0" }}>
                  ← Retour
                </button>
                {(q.type === "text" || q.type === "email" || q.type === "tel" || q.type === "textarea" || q.type === "multi") && (
                  <button onClick={next} className="eb-cta" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15.5, padding: "13px 22px", marginLeft: "auto" }}>
                    {q.optional && !((data[q.key] as string) || "").trim() ? "Passer" : "Continuer"} <span aria-hidden>→</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Relecture ── */}
          {isReview && (
            <div>
              <div style={{ font: "500 12.5px/1 var(--font-plex-mono),monospace", color: "#2E6AE0", marginBottom: 14 }}>Dernière étape</div>
              <h2 style={{ font: "800 clamp(1.6rem,5vw,2.4rem)/1.12 var(--font-schibsted),sans-serif", letterSpacing: "-.02em", color: "#0B1B34", margin: "0 0 12px" }}>
                Presque terminé.
              </h2>
              <p style={{ font: "400 clamp(15px,2.3vw,17px)/1.55 var(--font-schibsted),sans-serif", color: "#48526A", margin: "0 0 22px", maxWidth: "44ch" }}>
                Tu as répondu à toutes les questions. Confirme ci-dessous pour envoyer ta candidature.
              </p>

              {/* Récap minimal — pas la liste complète */}
              <div style={{ border: "1px solid #E5E8EF", padding: "16px 18px" }}>
                <div style={{ font: "700 16px/1.25 var(--font-schibsted),sans-serif", color: "#0B1B34" }}>{(data.nom as string)?.trim() || "Ta candidature"}</div>
                <div style={{ font: "500 13px/1.4 var(--font-schibsted),sans-serif", color: "#98A2B6", marginTop: 4 }}>
                  {[data.commune, data.age, data.genre].filter((x) => typeof x === "string" && x.trim()).join("  ·  ") || "Toutes les réponses sont complétées"}
                </div>
              </div>

              {/* Honeypot anti-bot : invisible, non focusable, ignoré des humains */}
              <input
                ref={hpRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />

              <label style={{ display: "flex", gap: 12, alignItems: "flex-start", margin: "20px 0 0", cursor: "pointer" }}>
                <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setConsentErr(null); }} style={{ width: 20, height: 20, marginTop: 2, accentColor: "#2E6AE0", flex: "none" }} />
                <span style={{ font: "400 14px/1.55 var(--font-schibsted),sans-serif", color: "#48526A" }}>
                  J&apos;accepte d&apos;être contacté(e) par Étoile Bleue sur WhatsApp au sujet de ma candidature, je certifie que mes réponses sont exactes, et j&apos;accepte la{" "}
                  <a href="/confidentialite" target="_blank" style={{ color: "#2E6AE0", textDecoration: "underline" }}>politique de confidentialité</a> et les{" "}
                  <a href="/conditions" target="_blank" style={{ color: "#2E6AE0", textDecoration: "underline" }}>conditions d&apos;utilisation</a>.
                </span>
              </label>
              {consentErr && <p style={{ font: "600 14px/1.4 var(--font-schibsted),sans-serif", color: "#C8402C", margin: "12px 0 0" }}>{consentErr}</p>}
              {error && <p style={{ font: "600 14px/1.4 var(--font-schibsted),sans-serif", color: "#C8402C", margin: "12px 0 0" }}>{error}</p>}

              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "16px 0 0" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flex: "none", marginTop: 2 }} aria-hidden="true">
                  <rect x="5" y="11" width="14" height="9" rx="2" stroke="#98A2B6" strokeWidth="1.8" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#98A2B6" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span style={{ font: "400 13px/1.5 var(--font-schibsted),sans-serif", color: "#98A2B6" }}>
                  Tes données sont hébergées en propre (on-premise) et stockées localement sur les serveurs du Ministère, en RDC. Elles ne sont ni vendues ni transférées à l&apos;étranger.
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24 }}>
                <button onClick={() => go(1)} style={{ background: "none", border: "none", cursor: "pointer", font: "600 15px/1 var(--font-schibsted),sans-serif", color: "#98A2B6", padding: "10px 0" }}>Modifier mes réponses</button>
                <button onClick={submit} disabled={submitting} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: submitting ? "#7FA0DC" : "#2E6AE0", color: "#fff", border: "none", cursor: submitting ? "default" : "pointer", fontWeight: 700, fontSize: 16, padding: "15px 26px", marginLeft: "auto" }}>
                  {submitting ? "Envoi…" : "Envoyer ma candidature →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes ebfade{from{opacity:0;transform:translate3d(16px,0,0)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
