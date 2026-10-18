import type { Ref } from "react";
import { Magnetic } from "@/components/ui/Magnetic";

/**
 * ESCENA A · THE ARRIVAL — textos.
 * Los wrappers (ref) los anima el scroll; los spans [data-intro] solo la entrada inicial.
 */

type HeadlineRefs = {
  eyebrowRef?: Ref<HTMLParagraphElement>;
  leftRef?: Ref<HTMLSpanElement>;
  rightRef?: Ref<HTMLSpanElement>;
};

/** Titular detrás del frasco (capa inferior al canvas): el producto queda en primer plano. */
export function ArrivalHeadline({ eyebrowRef, leftRef, rightRef }: HeadlineRefs) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="grid h-full grid-cols-1 content-start gap-3 px-6 pt-28 md:grid-cols-2 md:content-center md:gap-0 md:px-12 md:pt-0">
        {/* Sin transform en este contenedor: la línea derecha se posiciona respecto del escenario */}
        <div className="md:pb-[16vh]">
          <p ref={eyebrowRef} className="mb-4 font-serif text-sm tracking-[0.6em] text-gold md:mb-6 md:text-base">
            <span data-intro className="inline-block">
              TRIDENTE
            </span>
          </p>
          <h1 className="font-serif font-light uppercase leading-[0.9] tracking-[-0.01em] text-ivory">
            <span ref={leftRef} className="block text-[clamp(2.5rem,5.2vw,6.5rem)]">
              <span data-intro className="inline-block">
                <span className="md:block">Tu</span> <span className="md:block">esencia.</span>
              </span>
            </span>
            <span
              ref={rightRef}
              className="block text-right text-[clamp(2.5rem,5.2vw,6.5rem)] italic text-ivory/90 md:absolute md:right-12 md:top-[50%] md:whitespace-nowrap"
            >
              <span data-intro className="inline-block">
                <span className="md:block">Tu</span> <span className="md:block">presencia.</span>
              </span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}

/** Subtítulo y CTA, por encima del canvas para ser legibles y clicables. */
export function ArrivalActions({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-start gap-5 px-6 pb-10 md:flex-row md:items-end md:justify-between md:px-12 md:pb-12"
    >
      <p data-intro className="max-w-[21rem] font-serif text-lg italic leading-snug text-ivory/80 md:text-xl">
        Descubrí fragancias que hablan por vos.
      </p>
      <span data-intro className="inline-block">
        <Magnetic>
      <a
        href="#catalogo"
        data-cursor="Ver"
        className="group inline-flex items-center gap-4 border border-ivory/40 bg-obsidian/30 px-7 py-4 text-xs font-medium uppercase tracking-[0.32em] text-ivory backdrop-blur-sm transition-colors duration-300 hover:border-gold hover:text-gold"
      >
        Explorar fragancias
        <span aria-hidden="true" className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
      </a>
        </Magnetic>
      </span>
    </div>
  );
}
