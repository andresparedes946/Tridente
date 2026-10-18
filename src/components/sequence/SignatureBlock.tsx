import type { Ref } from "react";

type SignatureBlockProps = {
  ref?: Ref<HTMLElement>;
  /** true: empieza oculto y lo revela la línea de tiempo. false: visible (versión estática). */
  animated?: boolean;
  className?: string;
};

/**
 * ESCENA C · THE SIGNATURE — composición editorial tipo campaña.
 * Cada línea va dentro de una máscara (overflow hidden) para revelarse desde abajo.
 */
export function SignatureBlock({ ref, animated = false, className = "" }: SignatureBlockProps) {
  const hidden = animated ? "invisible opacity-0" : "";

  return (
    <article ref={ref} aria-labelledby="signature-title" className={`max-w-[44rem] ${hidden} ${className}`}>
      <p data-sig-meta className="mb-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.45em] text-smoke md:mb-10">
        <span className="font-serif text-sm tracking-normal text-gold">03</span>
        <span aria-hidden="true" className="h-px w-10 bg-smoke/50" />
        The Signature
      </p>
      <h2 id="signature-title" className="text-ivory">
        <span className="block overflow-hidden pb-1">
          <span
            data-sig-line
            className={`block text-xs font-medium uppercase tracking-[0.55em] text-gold md:text-sm`}
          >
            Una fragancia.
          </span>
        </span>
        <span className="mt-5 block overflow-hidden md:mt-7">
          <span
            data-sig-line
            className={`block font-serif text-[clamp(2.4rem,5.6vw,6.25rem)] font-light uppercase leading-[0.92]`}
          >
            Una presencia
          </span>
        </span>
        <span className="block overflow-hidden pb-2">
          <span
            data-sig-line
            className={`block font-serif text-[clamp(2.4rem,5.6vw,6.25rem)] font-light uppercase italic leading-[0.92] text-ivory/90`}
          >
            inconfundible.
          </span>
        </span>
      </h2>
      <p data-sig-meta className="mt-10 max-w-xs border-t border-ivory/15 pt-5 text-[11px] leading-relaxed text-smoke md:mt-14">
        Modelo 3D ilustrativo en desarrollo. No representa un producto comercial.
      </p>
    </article>
  );
}
