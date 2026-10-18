/**
 * Coreografía de la experiencia en cuatro escenas. Todo depende del progreso
 * del scroll (0 → 1): al subir, la secuencia retrocede exactamente igual.
 *
 *   A · The Arrival    0.00 – 0.12
 *   B · The Reveal     0.12 – 0.46
 *   C · The Signature  0.46 – 0.80
 *   D · Discovery      0.80 – 1.00
 *
 * Para ajustar la coreografía basta con editar KEYFRAMES.
 */

export type SceneVariant = "desktop" | "mobile";

export type Pose = {
  /** Cámara */
  camX: number;
  camY: number;
  camZ: number;
  lookX: number;
  lookY: number;
  /** Frasco */
  posX: number;
  posY: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
  /** Pedestal (posición de su cara superior); escala = scale del frasco */
  pedX: number;
  pedY: number;
  /** Iluminación (multiplicadores) */
  red: number;
  white: number;
  halo: number;
};

export type Keyframe = { at: number; pose: Pose };

export type Chapter = { id: string; index: string; label: string; at: number };

export const CHAPTERS: Chapter[] = [
  { id: "arrival", index: "01", label: "The Arrival", at: 0 },
  { id: "reveal", index: "02", label: "The Reveal", at: 0.12 },
  { id: "signature", index: "03", label: "The Signature", at: 0.46 },
  { id: "discovery", index: "04", label: "Discovery", at: 0.8 },
];

/** Límites elegantes de rotación (radianes): el frasco nunca se "vuelca". */
export const ROTATION_LIMITS = { x: 0.18, z: 0.12 } as const;

/** Color de fondo del escenario a lo largo del scroll (DOM y refracción del vidrio). */
export const BACKGROUND_STOPS: { at: number; color: string }[] = [
  { at: 0, color: "#060507" },
  { at: 0.1, color: "#060507" },
  { at: 0.45, color: "#3a0812" },
  { at: 0.78, color: "#2b060d" },
  { at: 1, color: "#0b0406" },
];

/** Altura del frasco por debajo de su origen (para apoyarlo sobre el pedestal). */
export const BOTTLE_BOTTOM = 1.35;

const arrival: Pose = {
  camX: 0,
  camY: 0.15,
  camZ: 7.4,
  lookX: 0,
  lookY: 0,
  posX: 0,
  posY: -0.02,
  rotX: 0,
  rotY: -0.45,
  rotZ: 0,
  scale: 1,
  pedX: 0,
  pedY: -0.02 - BOTTLE_BOTTOM,
  red: 1,
  white: 0.7,
  halo: 1,
};

export const KEYFRAMES: Record<SceneVariant, Keyframe[]> = {
  desktop: [
    // A · The Arrival: protagonista absoluto sobre el pedestal
    { at: 0, pose: arrival },
    { at: 0.1, pose: { ...arrival, rotY: -0.3 } },
    // B · The Reveal: la cámara se acerca, el frasco se eleva y gira; la luz blanca dibuja contornos
    {
      at: 0.34,
      pose: {
        ...arrival,
        camX: 0.3, camY: 0.5, camZ: 4.4, lookY: 0.3,
        posY: 0.18, rotX: 0.14, rotY: 0.9, rotZ: -0.09,
        red: 1.5, white: 1.6, halo: 1.1,
      },
    },
    // C · The Signature: el frasco vuelve a apoyarse y se desplaza a la derecha
    {
      at: 0.5,
      pose: {
        ...arrival,
        camY: 0.15, camZ: 6.4, lookY: 0.05,
        posX: 1.4, posY: 0.02, rotX: 0.05, rotY: 1.8, rotZ: 0.06, scale: 0.92,
        pedX: 1.4, pedY: 0.02 - BOTTLE_BOTTOM * 0.92,
        red: 1.3, white: 1.2, halo: 0.9,
      },
    },
    {
      at: 0.78,
      pose: {
        ...arrival,
        camX: -0.2, camY: 0.1, camZ: 6.1, lookY: 0.05,
        posX: 1.45, posY: 0.02, rotY: 2.5, rotZ: 0.03, scale: 0.92,
        pedX: 1.45, pedY: 0.02 - BOTTLE_BOTTOM * 0.92,
        red: 1.4, white: 1.1, halo: 0.9,
      },
    },
    // D · Discovery: el pedestal desciende, el frasco se eleva y se aleja
    {
      at: 1,
      pose: {
        ...arrival,
        camY: 0.7, camZ: 9.6, lookY: 0.7,
        posY: 1.5, rotX: -0.12, rotY: 3.35, scale: 0.68,
        pedY: -3.6,
        red: 0.6, white: 0.5, halo: 0.3,
      },
    },
  ],
  mobile: [
    { at: 0, pose: { ...arrival, camZ: 8.6, posY: -0.1, scale: 0.82, pedY: -0.1 - BOTTLE_BOTTOM * 0.82 } },
    { at: 0.1, pose: { ...arrival, camZ: 8.6, posY: -0.1, rotY: -0.3, scale: 0.82, pedY: -0.1 - BOTTLE_BOTTOM * 0.82 } },
    {
      at: 0.34,
      pose: {
        ...arrival,
        camX: 0.2, camY: 0.4, camZ: 5.8, lookY: 0.25,
        posY: 0.1, rotX: 0.14, rotY: 0.9, rotZ: -0.09, scale: 0.85,
        pedY: -0.1 - BOTTLE_BOTTOM * 0.82,
        red: 1.5, white: 1.6, halo: 1.1,
      },
    },
    // En móvil el frasco sube y el texto ocupa la mitad inferior
    {
      at: 0.5,
      pose: {
        ...arrival,
        camY: 0.1, camZ: 8.4,
        posY: 1.25, rotX: 0.05, rotY: 1.8, rotZ: 0.05, scale: 0.58,
        pedY: 1.25 - BOTTLE_BOTTOM * 0.58,
        red: 1.3, white: 1.2, halo: 0.9,
      },
    },
    {
      at: 0.78,
      pose: {
        ...arrival,
        camY: 0.1, camZ: 8.4,
        posY: 1.3, rotY: 2.5, scale: 0.58,
        pedY: 1.3 - BOTTLE_BOTTOM * 0.58,
        red: 1.4, white: 1.1, halo: 0.9,
      },
    },
    {
      at: 1,
      pose: {
        ...arrival,
        camY: 0.7, camZ: 10, lookY: 0.7,
        posY: 2, rotX: -0.12, rotY: 3.35, scale: 0.5,
        pedY: -4,
        red: 0.6, white: 0.5, halo: 0.3,
      },
    },
  ],
};

export const POSE_KEYS = Object.keys(arrival) as (keyof Pose)[];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
/** Curva suave entre poses: arranca y frena sin cortes. */
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Interpola la pose para un progreso dado. Escribe en `out` para no generar basura por frame. */
export function samplePose(frames: Keyframe[], progress: number, out: Pose): Pose {
  const t = clamp(progress, 0, 1);
  let i = 0;
  while (i < frames.length - 2 && t > frames[i + 1].at) i++;
  const a = frames[i];
  const b = frames[i + 1];
  const span = b.at - a.at || 1;
  const k = ease(clamp((t - a.at) / span, 0, 1));
  for (const key of POSE_KEYS) {
    out[key] = a.pose[key] + (b.pose[key] - a.pose[key]) * k;
  }
  out.rotX = clamp(out.rotX, -ROTATION_LIMITS.x, ROTATION_LIMITS.x);
  out.rotZ = clamp(out.rotZ, -ROTATION_LIMITS.z, ROTATION_LIMITS.z);
  return out;
}

export function createPose(): Pose {
  return { ...arrival };
}

/** Color de fondo interpolado (hex) para un progreso dado. */
export function backgroundAt(progress: number): string {
  const t = clamp(progress, 0, 1);
  let i = 0;
  while (i < BACKGROUND_STOPS.length - 2 && t > BACKGROUND_STOPS[i + 1].at) i++;
  const a = BACKGROUND_STOPS[i];
  const b = BACKGROUND_STOPS[i + 1];
  const k = clamp((t - a.at) / (b.at - a.at || 1), 0, 1);
  const pa = parseInt(a.color.slice(1), 16);
  const pb = parseInt(b.color.slice(1), 16);
  const ch = (shift: number) =>
    Math.round(((pa >> shift) & 255) + (((pb >> shift) & 255) - ((pa >> shift) & 255)) * k);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
}
