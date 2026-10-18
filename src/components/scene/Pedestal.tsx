"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import type { Group } from "three";
import type { RigState } from "./rigState";

type PedestalProps = {
  rigRef: RefObject<RigState>;
  /** true: reflejo real (desktop). false: brillo por entorno (móvil). */
  reflective: boolean;
};

const RADIUS = 1.2;

/** Pedestal de obsidiana en dos niveles con un reflejo sutil en la cara superior. */
export function Pedestal({ rigRef, reflective }: PedestalProps) {
  const group = useRef<Group>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const { pose } = rigRef.current;
    g.position.set(pose.pedX, pose.pedY, 0);
    g.scale.setScalar(pose.scale);
  });

  return (
    <group ref={group}>
      {/* Cara superior reflectante (el origen del grupo es esta superficie) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]}>
        <circleGeometry args={[RADIUS, 96]} />
        {reflective ? (
          <MeshReflectorMaterial
            resolution={512}
            blur={[400, 120]}
            mixBlur={1}
            mixStrength={1.4}
            mirror={0.6}
            depthScale={0.6}
            minDepthThreshold={0.35}
            maxDepthThreshold={1.3}
            color="#100b0d"
            metalness={0.55}
            roughness={0.85}
          />
        ) : (
          <meshPhysicalMaterial color="#0e0a0b" roughness={0.2} metalness={0.4} clearcoat={1} envMapIntensity={1.4} />
        )}
      </mesh>
      {/* Filo dorado */}
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[RADIUS, 0.006, 8, 128]} />
        <meshStandardMaterial color="#c9a26a" metalness={1} roughness={0.25} emissive="#2a1806" />
      </mesh>
      {/* Cuerpo */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[RADIUS, RADIUS, 0.44, 96]} />
        <meshPhysicalMaterial color="#0a0708" roughness={0.32} metalness={0.4} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      {/* Escalón inferior */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[RADIUS * 1.12, RADIUS * 1.12, 0.12, 96]} />
        <meshPhysicalMaterial color="#080506" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}
