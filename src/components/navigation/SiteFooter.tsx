"use client";

import { useEffect, useRef } from "react";
import { getGsap, scheduleRefresh } from "@/lib/gsap";
import { useMotionOK } from "@/lib/useMotionOK";
import { Magnetic } from "@/components/ui/Magnetic";

/** Cierre: invitación final + wordmark monumental que emerge con el scroll. */
export function SiteFooter() {
  const { motion } = useMotionOK();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!motion || !root.current) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-wordmark] > span",
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: { trigger: "[data-wordmark]", start: "top bottom", end: "bottom bottom", scrub: 0.5 },
        },
      );
      gsap.from("[data-final] > *", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-final]", start: "top 80%" },
      });
    }, root);
    scheduleRefresh();
    return () => ctx.revert();
  }, [motion]);

  return (
    <footer ref={root} className="relative overflow-hidden bg-gradient-to-b from-obsidian via-[#140306] to-[#2a0407]">
      <div data-final className="flex flex-col items-center px-6 pt-32 text-center md:pt-44">
        <p className="text-[10px] uppercase tracking-[0.45em] text-smoke">Tu esencia. Tu presencia.</p>
        <p className="mt-6 max-w-3xl font-serif text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.05] text-ivory">
          Descubrí la fragancia que <em className="text-gold">habla por vos.</em>
        </p>
        <div className="mt-12">
          <Magnetic>
            <a
              href="#catalogo"
              data-cursor="Ver"
              className="group inline-flex items-center gap-4 bg-ivory px-8 py-4 text-xs font-medium uppercase tracking-[0.32em] text-obsidian transition-colors duration-300 hover:bg-gold"
            >
              Explorar fragancias
              <span aria-hidden="true" className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
            </a>
          </Magnetic>
        </div>
      </div>

      <nav aria-label="Pie de página" className="mt-28 flex flex-col gap-4 border-t border-ivory/10 px-6 py-8 text-[10px] uppercase tracking-[0.3em] text-smoke md:flex-row md:items-center md:justify-between md:px-12">
        <ul className="flex gap-8">
          <li><a href="#catalogo" className="transition-colors hover:text-ivory">Colección</a></li>
          <li><a href="#casa" className="transition-colors hover:text-ivory">La casa</a></li>
          <li><a href="#contenido" className="transition-colors hover:text-ivory">Inicio</a></li>
        </ul>
        <span>Demo · prototipo visual · contenido provisional</span>
      </nav>

      <p
        data-wordmark
        aria-hidden="true"
        className="flex select-none justify-center overflow-hidden px-2 font-serif text-[22vw] font-light leading-[0.78] tracking-[0.02em] text-ivory/[0.07]"
      >
        {"TRIDENTE".split("").map((l, i) => (
          <span key={i} className="inline-block">
            {l}
          </span>
        ))}
      </p>
    </footer>
  );
}
