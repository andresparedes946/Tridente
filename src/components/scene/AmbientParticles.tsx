"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { BufferAttribute, BufferGeometry, CanvasTexture, type Points } from "three";
import type { RigState } from "./rigState";

/** Generador pseudoaleatorio determinista: las partículas son siempre las mismas. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createGeometry(count: number) {
  const rand = mulberry32(7);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * 12;
    positions[i * 3 + 1] = (rand() - 0.5) * 9;
    positions[i * 3 + 2] = -rand() * 5 + 1.5;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
}

function createDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new CanvasTexture(canvas);
}

/**
 * Partículas ambientales muy discretas. No se mueven solas: su desplazamiento
 * (parallax) depende únicamente del progreso del scroll.
 */
export function AmbientParticles({ rigRef, count }: { rigRef: RefObject<RigState>; count: number }) {
  const points = useRef<Points>(null);
  const geometry = useMemo(() => createGeometry(count), [count]);
  const texture = useMemo(() => createDotTexture(), []);

  useFrame(() => {
    const p = points.current;
    if (!p) return;
    const { progress, intro } = rigRef.current;
    p.position.y = -0.6 + progress * 2.2;
    p.rotation.y = progress * 0.35;
    const material = p.material as { opacity: number };
    material.opacity = 0.32 * intro;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        map={texture}
        size={0.045}
        sizeAttenuation
        color="#ff8a7a"
        transparent
        opacity={0.32}
        depthWrite={false}
      />
    </points>
  );
}
