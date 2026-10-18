"use client";

import { MeshTransmissionMaterial, RoundedBox, useFBO } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { NoToneMapping, type Color, type Group, type Mesh } from "three";

export type BottleQuality = "high" | "low";

type PerfumeBottleProps = ThreeElements["group"] & {
  quality?: BottleQuality;
  /** Color que "ve" el vidrio detrás (igual al fondo del escenario) */
  glassBackground?: Color;
};

const GOLD = { color: "#d9b77e", metalness: 1, roughness: 0.18 } as const;

/**
 * Frasco ESTILIZADO PROVISIONAL construido con geometría básica.
 * No representa ninguna fragancia ni producto comercial: se reemplazará por un
 * modelo GLB/GLTF cuando exista (ver README).
 *
 * Proporciones (unidades de escena): cuerpo 1.16 × 1.86 × 0.56, alto total 2.72.
 * El origen está a 1.35 por encima de la base (ver BOTTLE_BOTTOM).
 */
export function PerfumeBottle({ quality = "high", glassBackground, ...props }: PerfumeBottleProps) {
  const high = quality === "high";
  const glass = useRef<Mesh>(null);
  const emblem = useRef<Group>(null);
  const buffer = useFBO(512, 512);

  // Buffer propio de refracción: se renderiza la escena SIN el vidrio y SIN el
  // emblema (que está delante del vidrio), así el emblema no aparece duplicado.
  useFrame(({ gl, scene, camera }) => {
    if (!high || !glass.current || !emblem.current) return;
    const oldBackground = scene.background;
    const oldToneMapping = gl.toneMapping;
    glass.current.visible = false;
    emblem.current.visible = false;
    if (glassBackground) scene.background = glassBackground;
    gl.toneMapping = NoToneMapping;
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.toneMapping = oldToneMapping;
    scene.background = oldBackground;
    glass.current.visible = true;
    emblem.current.visible = true;
  });

  return (
    <group {...props}>
      {/* Cuerpo de vidrio grueso */}
      <RoundedBox ref={glass} args={[1.16, 1.86, 0.56]} radius={0.1} smoothness={high ? 8 : 4} position={[0, -0.42, 0]}>
        {high ? (
          <MeshTransmissionMaterial
            buffer={buffer.texture}
            transmission={1}
            thickness={0.12}
            roughness={0.035}
            ior={1.48}
            chromaticAberration={0}
            anisotropicBlur={0.02}
            distortion={0}
            clearcoat={1}
            clearcoatRoughness={0.04}
            attenuationColor="#ffffff"
            attenuationDistance={3}
            envMapIntensity={1.3}
          />
        ) : (
          <meshPhysicalMaterial
            color="#ffd9d4"
            transparent
            opacity={0.12}
            roughness={0.12}
            metalness={0.1}
            specularIntensity={0.4}
            envMapIntensity={1.2}
            depthWrite={false}
          />
        )}
      </RoundedBox>

      {/* Líquido: el fondo de vidrio grueso queda visible debajo */}
      <RoundedBox args={[0.98, 1.33, 0.38]} radius={0.05} smoothness={4} position={[0, -0.465, 0]}>
        <meshPhysicalMaterial color="#5a0610" emissive="#160103" roughness={0.35} specularIntensity={0.1} envMapIntensity={0.8} />
      </RoundedBox>

      {/* Emblema frontal provisional: marco dorado + motivo abstracto de tres trazos (sin marca) */}
      <group ref={emblem} position={[0, -0.36, 0.287]}>
        {[
          { pos: [0, 0.3, 0], size: [0.4, 0.016, 0.008] },
          { pos: [0, -0.3, 0], size: [0.4, 0.016, 0.008] },
          { pos: [-0.192, 0, 0], size: [0.016, 0.6, 0.008] },
          { pos: [0.192, 0, 0], size: [0.016, 0.6, 0.008] },
          { pos: [0, -0.02, 0.002], size: [0.022, 0.32, 0.008] },
          { pos: [-0.072, 0.07, 0.002], size: [0.018, 0.15, 0.008] },
          { pos: [0.072, 0.07, 0.002], size: [0.018, 0.15, 0.008] },
          { pos: [0, -0.005, 0.002], size: [0.162, 0.018, 0.008] },
        ].map(({ pos, size }, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={size as [number, number, number]} />
            <meshStandardMaterial {...GOLD} emissive="#3a2408" />
          </mesh>
        ))}
      </group>

      {/* Cuello */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.18, 48]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      {/* Anillo */}
      <mesh position={[0, 0.71, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.04, 8]} />
        <meshStandardMaterial {...GOLD} roughness={0.14} />
      </mesh>
      {/* Tapa octogonal de obsidiana */}
      <mesh position={[0, 1.04, 0]}>
        <cylinderGeometry args={[0.27, 0.29, 0.62, 8]} />
        <meshPhysicalMaterial
          color="#110c0f"
          metalness={0.85}
          roughness={0.24}
          clearcoat={1}
          clearcoatRoughness={0.08}
          flatShading
        />
      </mesh>
      <mesh position={[0, 1.36, 0]}>
        <cylinderGeometry args={[0.18, 0.27, 0.03, 8]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
    </group>
  );
}
