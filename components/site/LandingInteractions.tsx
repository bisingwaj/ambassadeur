"use client";

import { useEffect } from "react";

/**
 * Réplique les comportements JS du prototype d'origine :
 *  - apparition au scroll ([data-reveal])
 *  - compteurs animés ([data-count])
 *  - accordéon FAQ (.eb-faq-q)
 * Le contenu reste rendu côté serveur (bon pour le SEO) ; ce composant
 * ne fait qu'attacher l'interactivité progressive.
 */
export default function LandingInteractions() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reveal on scroll
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduce) {
      revealEls.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io.observe(el));

      // Count-up
      const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            cio.unobserve(el);
            const target = Number(el.dataset.count || "0");
            const dur = 1100;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = String(Math.round(target * eased));
              if (p < 1) requestAnimationFrame(tick);
              else el.textContent = String(target);
            };
            requestAnimationFrame(tick);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => cio.observe(el));

      return () => {
        io.disconnect();
        cio.disconnect();
      };
    }
  }, []);

  // FAQ accordion (délégation d'événement)
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const btn = (ev.target as HTMLElement).closest<HTMLElement>(".eb-faq-q");
      if (!btn) return;
      const item = btn.closest<HTMLElement>(".eb-faq-item");
      if (!item) return;
      const open = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
