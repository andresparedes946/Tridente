"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, type RefObject } from "react";
import { Color, type Group } from "three";
import type { SceneDriver } from "@/lib/sceneDriver";
import type { SceneVariant } from "@/lib/sequence";
import { AmbientParticles } from "./AmbientParticles";
import { LightHalo } from "./LightHalo";
import { Pedestal } from "./Pedestal";
import { PerfumeBottle } from "./PerfumeBottle";
import { createRigState, type RigState } from "./rigState";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { SceneLighting } from "./SceneLighting";
import { SceneRig } from "./SceneRig";
import { StaticBottleFallback } from "./StaticBottleFallback";

export type PerfumeSceneProps = {
  variant: SceneVariant;
  /** Canal con el progreso del scroll. La versión estática pasa uno fijo en 0. */
  driverRef: RefObject<SceneDriver>;
  className?: string;
};

/** Aplica la pose amortiguada al frasco. */
function BottleRig({
  rigRef,
  variant,
  glassBackground,
}: {
  rigRef: RefObject<RigState>;
  variant: SceneVariant;
  glassBackground: Color;
}) {
  const group = useRef<Group>(null);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const { pose } = rigRef.current;
    g.position.set(pose.posX, pose.posY, 0);
    g.rotation.set(pose.rotX, pose.rotY, pose.rotZ);
    g.scale.setScalar(pose.scale);
  });
  return (
    <group ref={group}>
      <PerfumeBottle quality={variant === "mobile" ? "low" : "high"} glassBackground={glassBackground} />
    </group>
  );
}

/** Escena 3D del frasco. Se carga solo en el cliente (ver PerfumeSceneLazy). */
export default function PerfumeScene({ variant, driverRef, className }: PerfumeSceneProps) {
  // Un único Color compartido: SceneRig lo actualiza y el vidrio lo usa como fondo
  const [glassBackground] = useState(() => new Color("#060507"));
  const rigRef = useRef<RigState>(createRigState(glassBackground));
  const [contextLost, setContextLost] = useState(false);
  const mobile = variant === "mobile";
  const fallback = <StaticBottleFallback className={className} />;

  if (contextLost) return fallback;

  return (
    <SceneErrorBoundary fallback={fallback}>
      <div className={className} aria-hidden="true">
        <Canvas
          dpr={mobile ? [1, 1.5] : [1, 2]}
          frameloop="demand"
          camera={{ fov: 32, position: [0, 0.15, 7.4], near: 0.1, far: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          fallback={fallback}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setContextLost(true);
            });
          }}
        >
          {/* SceneRig va primero: calcula la pose que leen los demás en el mismo frame */}
          <SceneRig variant={variant} driverRef={driverRef} rigRef={rigRef} />
          <SceneLighting rigRef={rigRef} />
          <LightHalo rigRef={rigRef} />
          <AmbientParticles rigRef={rigRef} count={mobile ? 40 : 90} />
          <Pedestal rigRef={rigRef} reflective={!mobile} />
          <BottleRig rigRef={rigRef} variant={variant} glassBackground={glassBackground} />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
}
