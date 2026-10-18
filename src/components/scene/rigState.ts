import { Color } from "three";
import { createPose, type Pose } from "@/lib/sequence";

/**
 * Estado interno de la escena calculado por SceneRig en cada frame
 * (pose amortiguada) y leído por luces, halo, pedestal y partículas.
 */
export type RigState = {
  pose: Pose;
  /** Progreso suavizado 0–1 */
  progress: number;
  /** Entrada de luz 0–1 */
  intro: number;
  /** Color de fondo actual: lo usa el vidrio para refractar el mismo tono que el DOM */
  background: Color;
};

export function createRigState(background: Color = new Color("#060507")): RigState {
  return { pose: createPose(), progress: 0, intro: 1, background };
}
