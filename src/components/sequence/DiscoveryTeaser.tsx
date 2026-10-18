import type { Ref } from "react";

/** ESCENA D · DISCOVERY — cierre de la escena que invita a bajar al catálogo. */
export function DiscoveryTeaser({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className="invisible absolute inset-x-0 bottom-14 z-30 flex flex-col items-center gap-4 text-center opacity-0 md:bottom-16"
    >
      <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.45em] text-smoke">
        <span className="font-serif text-sm tracking-normal text-gold">04</span>
        <span aria-hidden="true" className="h-px w-10 bg-smoke/50" />
        Discovery
      </p>
      <a
        href="#catalogo"
        className="font-serif text-3xl font-light italic text-ivory transition-colors duration-300 hover:text-gold md:text-4xl"
      >
        Explorá la colección
      </a>
      <span aria-hidden="true" className="h-12 w-px bg-gradient-to-b from-ivory/60 to-transparent" />
    </div>
  );
}
