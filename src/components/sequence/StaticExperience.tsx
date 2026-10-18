"use client";

import { useEffect, useRef } from "react";
import { markSceneReady } from "@/lib/introGate";
import { PerfumeSceneLazy } from "@/components/scene/PerfumeSceneLazy";
import { StaticBottleFallback } from "@/components/scene/StaticBottleFallback";
import { createSceneDriver, type SceneDriver } from "@/lib/sceneDriver";
import type { SceneVariant } from "@/lib/sequence";
import { ArrivalActions, ArrivalHeadline } from "./HeroCopy";
import { SignatureBlock } from "./SignatureBlock";
import { StageBackdrop } from "./StageBackdrop";

type StaticExperienceProps = {
  /** "3d": escena quieta (reduced motion). "svg": sin WebGL o antes de hidratar. */
  bottle: "3d" | "svg";
  variant: SceneVariant;
  /** Avisar al preloader que no hay escena 3D que esperar */
  markReady?: boolean;
};

/**
 * Versión sin animación ligada al scroll: HTML del servidor, prefers-reduced-motion
 * y navegadores sin WebGL. Mismo contenido que la secuencia, en flujo normal.
 */
export function StaticExperience({ bottle, variant, markReady = false }: StaticExperienceProps) {
  const driverRef = useRef<SceneDriver>(createSceneDriver());

  useEffect(() => {
    if (markReady && bottle === "svg") markSceneReady();
  }, [markReady, bottle]);
  const visualClass = "pointer-events-none absolute inset-0 z-20";

  return (
    <>
      <section aria-label="Presentación" className="relative h-[100svh] min-h-[600px] overflow-hidden">
        <StageBackdrop />
        <ArrivalHeadline />
        {bottle === "3d" ? (
          <PerfumeSceneLazy variant={variant} driverRef={driverRef} className={visualClass} />
        ) : (
          <StaticBottleFallback className={visualClass} />
        )}
        <ArrivalActions />
      </section>
      <section
        id="esencia"
        className="relative bg-gradient-to-b from-obsidian via-[#3a0812] to-[#0b0406] px-6 py-32 md:px-12 md:py-48 lg:pl-[16vw]"
      >
        <SignatureBlock />
      </section>
    </>
  );
}
