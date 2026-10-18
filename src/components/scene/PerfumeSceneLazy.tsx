"use client";

import dynamic from "next/dynamic";
import type { PerfumeSceneProps } from "./PerfumeScene";

/** Three.js depende de `window`: la escena se carga solo en el navegador. */
export const PerfumeSceneLazy = dynamic<PerfumeSceneProps>(() => import("./PerfumeScene"), {
  ssr: false,
  loading: () => null,
});
