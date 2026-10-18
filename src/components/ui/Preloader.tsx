"use client";

import { useEffect, useRef, useState } from "react";
import { getGsap } from "@/lib/gsap";
import { onSceneReady, startIntro } from "@/lib/introGate";

const LETTERS = "TRIDENTE".split("");
const MIN_MS = 1800;
const MAX_MS = 6000;

/**
 * Pantalla de entrada: el logotipo se revela mientras carga la escena 3D y una
 * cortina la descubre. Al terminar dispara la intro de la portada.
 * Sin JavaScript se oculta (ver <noscript> en page.tsx).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { gsap } = getGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    html.style.overflow = "hidden";

    let finished = false;
    const start = performance.now();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      if (!reduced) {
        gsap.from(q("[data-letter]"), { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.06, delay: 0.1 });
        gsap.from(q("[data-sub]"), { autoAlpha: 0, duration: 0.8, delay: 0.7 });
      }
      gsap.fromTo(q("[data-bar]"), { scaleX: 0 }, { scaleX: 0.75, duration: MIN_MS / 1000, ease: "power2.out" });
    }, el);

    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      gsap.delayedCall(wait / 1000, () => {
        ctx.add(() => {
          const q = gsap.utils.selector(el);
          const tl = gsap.timeline({
            onComplete: () => {
              html.style.overflow = "";
              setDone(true);
            },
          });
          tl.to(q("[data-bar]"), { scaleX: 1, duration: 0.35, ease: "power2.inOut" });
          if (reduced) {
            tl.to(el, { autoAlpha: 0, duration: 0.4 });
            tl.call(startIntro, [], "<");
          } else {
            tl.to(q("[data-letter]"), { yPercent: -110, duration: 0.6, ease: "power3.in", stagger: 0.03 });
            tl.to(q("[data-sub], [data-bar]"), { autoAlpha: 0, duration: 0.3 }, "<");
            tl.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "power4.inOut" }, "-=0.15");
            tl.call(startIntro, [], "-=0.55");
          }
        });
      });
    };

    const unsubscribe = onSceneReady(finish);
    const timeout = window.setTimeout(finish, MAX_MS);

    return () => {
      unsubscribe();
      window.clearTimeout(timeout);
      html.style.overflow = "";
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      data-preloader
      role="status"
      aria-label="Cargando TRIDENTE Perfumería"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-obsidian"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(50% 40% at 50% 50%, rgba(120,8,18,0.35), transparent 70%)" }}
      />
      <p aria-hidden="true" className="relative flex overflow-hidden font-serif text-[clamp(2.5rem,8vw,6.5rem)] font-light tracking-[0.35em] text-ivory">
        {LETTERS.map((l, i) => (
          <span key={i} data-letter className="inline-block">
            {l}
          </span>
        ))}
      </p>
      <p data-sub aria-hidden="true" className="relative mt-4 text-[10px] uppercase tracking-[0.6em] text-gold/80">
        Perfumería
      </p>
      <div aria-hidden="true" className="relative mt-10 h-px w-40 overflow-hidden bg-ivory/10">
        <div data-bar className="h-full origin-left bg-crimson" />
      </div>
    </div>
  );
}
