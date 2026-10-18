"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import type { SpotLight } from "three";
import type { RigState } from "./rigState";

/**
 * Iluminación cinematográfica roja y blanca:
 *  - roja lateral (izquierda)
 *  - contraluz blanco (derecha/atrás) que dibuja los contornos
 *  - principal blanca muy suave
 * Las intensidades las marca la secuencia (pose.red / pose.white / intro).
 * El entorno de reflejos se genera localmente con Lightformers (sin HDRI externo).
 */
export function SceneLighting({ rigRef }: { rigRef: RefObject<RigState> }) {
  const redSide = useRef<SpotLight>(null);
  const whiteRim = useRef<SpotLight>(null);
  const key = useRef<SpotLight>(null);

  useFrame(() => {
    const { pose, intro } = rigRef.current;
    const red = pose.red * intro;
    const white = pose.white * intro;
    for (const light of [redSide.current, whiteRim.current, key.current]) {
      if (!light) continue;
      light.target.position.set(pose.posX, pose.posY, 0);
      light.target.updateMatrixWorld();
    }
    if (redSide.current) redSide.current.intensity = 20 * red;
    if (whiteRim.current) whiteRim.current.intensity = 26 * white;
    if (key.current) key.current.intensity = 5 * white;
  });

  return (
    <>
      <ambientLight intensity={0.05} color="#ffd9d0" />
      <spotLight ref={redSide} position={[-4.5, 1.2, 1.4]} angle={0.95} penumbra={1} color="#ff1426" decay={1.5} />
      <spotLight ref={whiteRim} position={[3.6, 2.6, -3]} angle={0.5} penumbra={1} color="#fff3ec" decay={1.5} />
      <spotLight ref={key} position={[2.5, 3.5, 4.5]} angle={0.45} penumbra={1} color="#ffe9e0" decay={1.5} />

      <Environment resolution={256} frames={1}>
        {/* Tiras verticales blancas: los reflejos clásicos del vidrio de perfumería */}
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[3, 0.5, 2]} rotation-y={-Math.PI / 3} scale={[0.4, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[-2.5, 0.5, 3]} rotation-y={Math.PI / 4} scale={[0.25, 5, 1]} />
        {/* Rojo lateral */}
        <Lightformer form="rect" intensity={2.6} color="#ff1f2e" position={[-4, 1, -1]} rotation-y={Math.PI / 2.5} scale={[3, 6, 1]} />
        {/* Cenital cálido suave */}
        <Lightformer form="rect" intensity={0.8} color="#ffd8c4" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[5, 1, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#8a0d18" position={[2, -1, -4]} scale={3} />
      </Environment>
    </>
  );
}
