"use client";

import { useEffect, useRef } from "react";
import { getGsap, scheduleRefresh } from "@/lib/gsap";
import { useMotionOK } from "@/lib/useMotionOK";

/** Texto de muestra para la demo. Reemplazar por el manifiesto definitivo de la marca. */
const MANIFESTO =
  "Un perfume no se usa: se habita. Es la forma más íntima de presencia, la huella que queda cuando ya te fuiste.";
const HIGHLIGHT = new Set(["habita.", "presencia,", "huella"]);

/** LA CASA — manifiesto que se ilumina palabra por palabra con el scroll. */
export function Manifesto() {
  const { motion } = useMotionOK();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!motion || !root.current) return;
    const { gsap } = getGsap();
    const el = root.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-manifesto]", start: "top 75%", end: "bottom 45%", scrub: 0.5 },
        },
      );
      gsap.from("[data-rule]", {
        scaleX: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 80%", end: "top 30%", scrub: 0.5 },
      });
    }, el);
    scheduleRefresh();
    return () => ctx.revert();
  }, [motion]);

  return (
    <section ref={root} id="casa" aria-labelledby="casa-title" className="relative bg-obsidian px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-6">
          <h2 id="casa-title" className="text-[10px] uppercase tracking-[0.45em] text-smoke">
            La casa
          </h2>
          <span data-rule aria-hidden="true" className="h-px flex-1 origin-left bg-ivory/15" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-smoke/60">Texto de muestra</span>
        </div>
        <p
          data-manifesto
          className="mt-14 font-serif text-[clamp(2rem,4.6vw,4.75rem)] font-light leading-[1.12] text-ivory"
        >
          {MANIFESTO.split(" ").map((word, i) => (
            <span key={i} data-word className={HIGHLIGHT.has(word) ? "italic text-gold" : undefined}>
              {word}{" "}
            </span>
          ))}
        </p>
        <p className="mt-12 text-[11px] uppercase tracking-[0.45em] text-smoke">— Tridente Perfumería</p>
      </div>
    </section>
  );
}
