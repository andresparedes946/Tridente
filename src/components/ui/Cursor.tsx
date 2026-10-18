"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";

/**
 * Cursor de autor (solo puntero fino y sin reduced motion): punto + anillo que
 * crece sobre elementos interactivos y muestra la etiqueta de data-cursor.
 * El cursor nativo se oculta solo mientras este está activo.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || !dot.current || !ring.current || !label.current) return;
    const { gsap } = getGsap();
    const d = dot.current;
    const r = ring.current;
    const l = label.current;
    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("a, button, [data-cursor]");
      const text = target?.dataset.cursor ?? "";
      l.textContent = text;
      gsap.to(r, { scale: target ? (text ? 2.6 : 1.8) : 1, duration: 0.4, ease: "power3.out" });
      gsap.to(l, { autoAlpha: text ? 1 : 0, duration: 0.2 });
      gsap.to(d, { scale: target ? 0 : 1, duration: 0.25 });
    };
    const leave = () => {
      visible = false;
      gsap.to([d, r], { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      html.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[150]">
      <div
        ref={ring}
        className="invisible absolute -left-5 -top-5 flex size-10 items-center justify-center rounded-full border border-ivory/50 opacity-0"
      >
        <span ref={label} className="text-[5px] uppercase tracking-[0.2em] text-ivory opacity-0" />
      </div>
      <div ref={dot} className="invisible absolute -left-[3px] -top-[3px] size-1.5 rounded-full bg-crimson opacity-0" />
    </div>
  );
}
