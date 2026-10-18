"use client";

import { useEffect, useRef } from "react";
import { getGsap, scheduleRefresh } from "@/lib/gsap";
import { useMotionOK } from "@/lib/useMotionOK";

const PHRASE = ["Tu esencia", "Tu presencia"];

function Row({ outline, rowRef }: { outline?: boolean; rowRef: React.RefObject<HTMLDivElement | null> }) {
  const items = Array.from({ length: 4 }, () => PHRASE).flat();
  return (
    <div ref={rowRef} className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-10">
          <span
            className={`font-serif text-[clamp(4rem,11vw,11rem)] font-light uppercase leading-none ${
              outline ? "text-outline italic" : "text-ivory"
            }`}
          >
            {t}
          </span>
          <span className="text-2xl text-crimson md:text-4xl">✦</span>
        </span>
      ))}
    </div>
  );
}

/** Banda tipográfica gigante: dos filas que se desplazan en sentidos opuestos con el scroll. */
export function TypeBand() {
  const { motion } = useMotionOK();
  const root = useRef<HTMLElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motion || !root.current) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.4 };
      gsap.fromTo(a.current, { xPercent: 0 }, { xPercent: -25, ease: "none", scrollTrigger: st });
      gsap.fromTo(b.current, { xPercent: -25 }, { xPercent: 0, ease: "none", scrollTrigger: { ...st } });
    }, root);
    scheduleRefresh();
    return () => ctx.revert();
  }, [motion]);

  return (
    <section ref={root} aria-hidden="true" className="relative flex flex-col gap-4 overflow-hidden border-y border-ivory/10 bg-obsidian py-16 md:py-24">
      <Row rowRef={a} />
      <Row rowRef={b} outline />
    </section>
  );
}
