/**
 * Canal compartido entre la línea de tiempo de GSAP (DOM) y la escena 3D.
 * Es un objeto mutable (no estado de React) para no re-renderizar en cada scroll.
 */
export type SceneDriver = {
  /** Progreso del scroll 0–1 */
  progress: number;
  /** Entrada inicial de la luz 0–1 (una sola vez al cargar) */
  intro: number;
  /** Pide un nuevo frame al canvas (render bajo demanda). Lo asigna la escena. */
  invalidate: () => void;
};

export function createSceneDriver(initial?: Partial<SceneDriver>): SceneDriver {
  return { progress: 0, intro: 1, invalidate: () => {}, ...initial };
}
