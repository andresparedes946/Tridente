"use client";

import { useSyncExternalStore } from "react";

/**
 * Capacidades del navegador que deciden qué versión de la experiencia se muestra.
 * En el servidor (y durante la hidratación) se usa SERVER_SNAPSHOT, así el HTML
 * inicial siempre coincide y no hay errores de hidratación.
 */
export type ClientCapabilities = {
  /** false en el servidor y en el primer render del cliente */
  ready: boolean;
  webgl: boolean;
  reducedMotion: boolean;
  mobile: boolean;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = "(max-width: 767px)";

const SERVER_SNAPSHOT: ClientCapabilities = {
  ready: false,
  webgl: false,
  reducedMotion: false,
  mobile: false,
};

let webglSupport: boolean | null = null;
let snapshot: ClientCapabilities | null = null;

function detectWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglSupport = Boolean(gl);
    // Liberar el contexto de prueba
    if (gl) gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/**
 * Permite probar los modos alternativos desde la URL:
 *  ?modo=estatico   → simula prefers-reduced-motion
 *  ?modo=sin-webgl  → simula un navegador sin WebGL
 */
function forcedMode(): string | null {
  try {
    return new URLSearchParams(window.location.search).get("modo");
  } catch {
    return null;
  }
}

function compute(): ClientCapabilities {
  const forced = forcedMode();
  return {
    ready: true,
    webgl: forced === "sin-webgl" ? false : detectWebGL(),
    reducedMotion:
      forced === "estatico" || window.matchMedia(REDUCED_MOTION_QUERY).matches,
    mobile: window.matchMedia(MOBILE_QUERY).matches,
  };
}

function subscribe(onChange: () => void): () => void {
  const queries = [REDUCED_MOTION_QUERY, MOBILE_QUERY].map((q) =>
    window.matchMedia(q),
  );
  const handler = () => {
    snapshot = null;
    onChange();
  };
  queries.forEach((mq) => mq.addEventListener("change", handler));
  return () => queries.forEach((mq) => mq.removeEventListener("change", handler));
}

function getSnapshot(): ClientCapabilities {
  if (!snapshot) snapshot = compute();
  return snapshot;
}

function getServerSnapshot(): ClientCapabilities {
  return SERVER_SNAPSHOT;
}

export function useClientCapabilities(): ClientCapabilities {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
