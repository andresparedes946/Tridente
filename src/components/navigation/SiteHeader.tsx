"use client";

import { useEffect, useRef } from "react";

const NAV_LINKS = [
  { href: "#catalogo", label: "Colección", mobile: true },
  { href: "#casa", label: "La casa", mobile: true },
  { href: "#esencia", label: "Esencia", mobile: false },
];

/** Header fijo: se oculta al bajar y reaparece al subir; gana fondo al salir de la portada. */
export function SiteHeader() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const down = y > lastY && y > 160;
      el.dataset.hidden = String(down);
      el.dataset.solid = String(y > window.innerHeight * 0.6);
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      data-hidden="false"
      data-solid="false"
      className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-obsidian/90 to-transparent transition-[transform,background-color] duration-500 ease-out data-[hidden=true]:-translate-y-full data-[solid=true]:bg-obsidian/70 data-[solid=true]:backdrop-blur-md focus-within:translate-y-0"
    >
      <nav aria-label="Principal" className="flex items-center justify-between px-6 py-5 md:px-12 md:py-6">
        {/* Logotipo tipográfico provisional */}
        <a href="#contenido" className="group flex flex-col leading-none" aria-label="TRIDENTE Perfumería, inicio">
          <span className="font-serif text-xl font-medium tracking-[0.3em] text-ivory md:text-[1.7rem] md:tracking-[0.42em]">
            TRIDENTE
          </span>
          <span className="mt-1 text-[9px] uppercase tracking-[0.55em] text-gold/80">Perfumería</span>
        </a>
        <ul className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-ivory/80 md:gap-10 md:text-[11px] md:tracking-[0.3em]">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className={link.mobile ? undefined : "hidden md:block"}>
              <a href={link.href} className="transition-colors duration-300 hover:text-gold">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
