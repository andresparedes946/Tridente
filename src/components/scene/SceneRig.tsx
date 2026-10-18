"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { MathUtils } from "three";
import { markSceneReady } from "@/lib/introGate";
import type { SceneDriver } from "@/lib/sceneDriver";
import { KEYFRAMES, POSE_KEYS, backgroundAt, createPose, samplePose, type SceneVariant } from "@/lib/sequence";
import type { RigState } from "./rigState";

type SceneRigProps = {
  variant: SceneVariant;
  driverRef: RefObject<SceneDriver>;
  rigRef: RefObject<RigState>;
};

/** Suavizado del seguimiento: alto = más pegado al scroll, bajo = más "cinematográfico". */
const DAMPING = 5;
const EPSILON = 0.0005;

/**
 * Traduce el progreso del scroll a la pose de la escena. No hay movimiento
 * autónomo: el render es bajo demanda y solo continúa mientras la pose
 * amortiguada no alcanzó la posición que marca el scroll.
 */
export function SceneRig({ variant, driverRef, rigRef }: SceneRigProps) {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const target = useRef(createPose());
  const initialized = useRef(false);
  const frames = useRef(0);

  // Conecta la línea de tiempo de GSAP con el render bajo demanda
  useEffect(() => {
    const driver = driverRef.current;
    driver.invalidate = invalidate;
    invalidate();
    return () => {
      driver.invalidate = () => {};
    };
  }, [driverRef, invalidate]);

  useFrame((_, delta) => {
    const driver = driverRef.current;
    const rig = rigRef.current;
    const goal = samplePose(KEYFRAMES[variant], driver.progress, target.current);

    const snap = !initialized.current;
    initialized.current = true;
    const dt = Math.min(delta, 0.1);
    let pending = false;

    for (const key of POSE_KEYS) {
      const next = snap ? goal[key] : MathUtils.damp(rig.pose[key], goal[key], DAMPING, dt);
      if (Math.abs(goal[key] - next) > EPSILON) pending = true;
      rig.pose[key] = Math.abs(goal[key] - next) > EPSILON ? next : goal[key];
    }
    const p = snap ? driver.progress : MathUtils.damp(rig.progress, driver.progress, DAMPING, dt);
    rig.progress = Math.abs(p - driver.progress) > EPSILON ? p : driver.progress;
    rig.intro = driver.intro;
    rig.background.set(backgroundAt(rig.progress));

    const pose = rig.pose;
    camera.position.set(pose.camX, pose.camY, pose.camZ);
    camera.lookAt(pose.lookX, pose.lookY, 0);

    // Tras los primeros frames (shaders compilados) avisa al preloader
    if (frames.current < 3) {
      frames.current += 1;
      if (frames.current === 3) markSceneReady();
      else pending = true;
    }

    if (pending) invalidate();
  });

  return null;
}
