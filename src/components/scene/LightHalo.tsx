"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { AdditiveBlending, Color, type Mesh, type ShaderMaterial } from "three";
import type { RigState } from "./rigState";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uCore;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5));
    float glow = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.22, 0.0, d);
    vec3 col = mix(uColor, uCore, core * 0.35);
    gl_FragColor = vec4(col, pow(glow, 2.2) * uOpacity);
  }
`;

/** Halo de luz detrás del frasco. Sigue su posición; su intensidad la marca la secuencia. */
export function LightHalo({ rigRef }: { rigRef: RefObject<RigState> }) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);

  useFrame(() => {
    const m = mesh.current;
    const mat = material.current;
    if (!m || !mat) return;
    const { pose, intro } = rigRef.current;
    m.position.set(pose.posX, pose.posY + 0.15 * pose.scale, -1.6);
    m.scale.setScalar(6.5 * pose.scale);
    mat.uniforms.uOpacity.value = 0.55 * pose.halo * intro;
  });

  return (
    <mesh ref={mesh} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uColor: { value: new Color("#b3121f") },
          uCore: { value: new Color("#ffd0c4") },
          uOpacity: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
