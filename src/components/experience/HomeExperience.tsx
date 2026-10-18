"use client";

import { useClientCapabilities } from "@/lib/capabilities";
import { ScrollSequence } from "@/components/sequence/ScrollSequence";
import { StaticExperience } from "@/components/sequence/StaticExperience";

/**
 * Elige la versión de la experiencia según el dispositivo:
 *  - servidor / hidratación → estática con frasco SVG (HTML idéntico, sin errores de hidratación)
 *  - sin WebGL              → estática con frasco SVG
 *  - prefers-reduced-motion → estática con frasco 3D quieto
 *  - resto                  → secuencia cinematográfica (desktop o móvil)
 */
export function HomeExperience() {
  const caps = useClientCapabilities();
  const variant = caps.mobile ? "mobile" : "desktop";

  if (!caps.ready || !caps.webgl) return <StaticExperience bottle="svg" variant={variant} markReady={caps.ready} />;
  if (caps.reducedMotion) return <StaticExperience bottle="3d" variant={variant} />;
  return <ScrollSequence key={variant} variant={variant} />;
}
