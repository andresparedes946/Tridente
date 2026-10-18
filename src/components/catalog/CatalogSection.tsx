"use client";

import { useEffect, useRef } from "react";
import { getGsap, scheduleRefresh } from "@/lib/gsap";
import { useMotionOK } from "@/lib/useMotionOK";
import { BottleIllustration, type BottleShape } from "@/components/ui/BottleIllustration";

/**
 * DISCOVERY — "La colección".
 * Fichas PROVISIONALES: no hay productos, nombres, notas ni precios reales.
 * Cuando existan datos, este arreglo se reemplaza por la fuente real (ver README).
 */
type PlaceholderFragrance = {
  index: string;
  shape: BottleShape;
  liquid: [string, string];
  glow: string;
};

const PLACEHOLDERS: PlaceholderFragrance[] = [
  { index: "01", shape: "square", liquid: ["#a3101e", "#3a0408"], glow: "rgba(179,18,31,0.45)" },
  { index: "02", shape: "slim", liquid: ["#d9a35a", "#5a3410"], glow: "rgba(217,163,90,0.35)" },
  { index: "03", shape: "round", liquid: ["#3a2a2e", "#0b0809"], glow: "rgba(200,190,190,0.18)" },
  { index: "04", shape: "facet", liquid: ["#c97a86", "#4a1620"], glow: "rgba(201,122,134,0.35)" },
];

export function CatalogSection() {
  const { motion, caps } = useMotionOK();
  const horizontal = motion && !caps.mobile;
  const section = useRef<HTMLElement>(null);
  const pinWrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!horizontal || !pinWrap.current || !track.current) return;
    const { gsap } = getGsap();
    const wrap = pinWrap.current;
    const t = track.current;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);
      const move = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          pin: true,
          scrub: 0.6,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
        },
      });

      // Parallax interno: cada frasco se desliza un poco respecto de su ficha
      gsap.utils.toArray<HTMLElement>("[data-parallax]", wrap).forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 18 },
          {
            xPercent: -18,
            ease: "none",
            scrollTrigger: { trigger: el, containerAnimation: move, start: "left right", end: "right left", scrub: true },
          },
        );
      });

      // Título: entrada al llegar
      gsap.from("[data-col-title] > *", {
        yPercent: 100,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 70%" },
      });
    }, wrap);
    scheduleRefresh();
    return () => ctx.revert();
  }, [horizontal]);

  return (
    <section
      ref={section}
      id="catalogo"
      aria-labelledby="catalogo-title"
      className="relative bg-gradient-to-b from-[#0b0406] to-obsidian"
    >
      <div ref={pinWrap} className={horizontal ? "flex h-[100svh] items-center overflow-hidden" : "py-28 md:py-36"}>
        <div
          ref={track}
          className={
            horizontal
              ? "flex h-[78vh] items-stretch gap-8 pl-12 pr-[12vw] will-change-transform"
              : "flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 md:grid md:grid-cols-2 md:overflow-visible md:px-12 xl:grid-cols-4"
          }
        >
          {/* Ficha de apertura */}
          <div
            className={
              horizontal
                ? "flex w-[34vw] shrink-0 flex-col justify-between py-4 pr-8"
                : "w-[82vw] shrink-0 snap-start md:col-span-2 md:w-auto xl:col-span-4"
            }
          >
            <div data-col-title className="overflow-hidden">
              <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.45em] text-smoke">
                <span className="font-serif text-sm tracking-normal text-gold">04</span>
                <span aria-hidden="true" className="h-px w-10 bg-smoke/50" />
                Discovery
              </p>
              <h2 id="catalogo-title" className="mt-6 font-serif text-5xl font-light leading-[0.95] text-ivory md:text-7xl">
                La <em className="text-ivory/85">colección</em>
              </h2>
            </div>
            <div className={horizontal ? "" : "mt-6 md:mb-10"}>
              <p className="max-w-sm text-sm leading-relaxed text-ivory/65">
                La colección está en preparación. Estas fichas son ilustrativas y se reemplazarán por las fragancias de
                Tridente cuando esté disponible la información oficial.
              </p>
              {!horizontal && (
                <p aria-hidden="true" className="mt-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-smoke md:hidden">
                  Deslizá
                  <span className="h-px w-16 bg-gradient-to-r from-smoke to-transparent" />
                </p>
              )}
              {horizontal && (
                <p aria-hidden="true" className="mt-10 flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-smoke">
                  Desplazá
                  <span className="h-px w-16 bg-gradient-to-r from-smoke to-transparent" />
                </p>
              )}
            </div>
          </div>

          {PLACEHOLDERS.map((item) => (
            <article
              key={item.index}
              data-cursor="Pronto"
              aria-label={`Fragancia ${item.index}, ficha provisional`}
              className={`group relative flex shrink-0 snap-center flex-col overflow-hidden border border-ivory/10 bg-gradient-to-b from-ivory/[0.04] to-transparent ${
                horizontal ? "w-[min(30rem,32vw)]" : "aspect-[3/4] w-[78vw] md:w-auto"
              }`}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: `radial-gradient(55% 45% at 50% 48%, ${item.glow}, transparent 75%)` }}
              />
              <span
                aria-hidden="true"
                className="text-outline absolute -left-2 -top-6 font-serif text-[9rem] font-light leading-none md:text-[11rem]"
              >
                {item.index}
              </span>
              <div className="relative flex flex-1 items-center justify-center overflow-hidden">
                <div data-parallax className="h-[68%] transition-transform duration-700 ease-out group-hover:-translate-y-3">
                  <BottleIllustration
                    shape={item.shape}
                    liquid={item.liquid}
                    className="h-full w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
                  />
                </div>
              </div>
              <div className="relative flex items-end justify-between gap-4 border-t border-ivory/10 p-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Fragancia {item.index}</p>
                  <h3 className="mt-2 font-serif text-2xl italic text-ivory/70">Nombre por definir</h3>
                  <p className="mt-1 text-xs text-smoke">Notas olfativas por definir</p>
                </div>
                <span className="shrink-0 border border-ivory/15 px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] text-smoke">
                  Próximamente
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
