"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
let refreshQueued = false;

/** Registra ScrollTrigger una sola vez y solo en el navegador. */
export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
    // Las fuentes cambian alturas: recalcular posiciones cuando terminan de cargar
    document.fonts?.ready.then(() => scheduleRefresh());
  }
  return { gsap, ScrollTrigger };
}

/**
 * Las secciones crean sus ScrollTrigger en distinto orden (y la portada cambia de
 * alto al detectar capacidades). Se ordenan por posición y se recalculan una vez por frame.
 */
export function scheduleRefresh() {
  if (refreshQueued || typeof window === "undefined") return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
}
