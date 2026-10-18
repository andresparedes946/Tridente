"use client";

import { useClientCapabilities } from "./capabilities";

/** true cuando corresponde animar ligado al scroll (cliente listo y sin reduced motion). */
export function useMotionOK() {
  const caps = useClientCapabilities();
  return { motion: caps.ready && !caps.reducedMotion, caps };
}
