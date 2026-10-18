import type { Ref } from "react";

/** Fondo del escenario + viñeta + grano. El color lo anima la secuencia. */
export function StageBackdrop({ bgRef }: { bgRef?: Ref<HTMLDivElement> }) {
  return (
    <>
      <div ref={bgRef} className="absolute inset-0 bg-obsidian" />
      <div
        className="pointer-events-none absolute inset-0 z-40"
        style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 50%, rgba(0,0,0,0.78) 100%)" }}
      />
      <div className="film-grain pointer-events-none absolute inset-0 z-40 opacity-[0.07]" />
    </>
  );
}
