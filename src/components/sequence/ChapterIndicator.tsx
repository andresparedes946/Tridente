import type { Ref } from "react";
import { CHAPTERS } from "@/lib/sequence";

/**
 * Índice de capítulos de la campaña (decorativo). El capítulo activo lo marca
 * ScrollSequence cambiando data-active, sin re-renderizar React.
 */
export function ChapterIndicator({ ref }: { ref?: Ref<HTMLOListElement> }) {
  return (
    <ol
      ref={ref}
      aria-hidden="true"
      className="invisible absolute bottom-10 left-12 z-30 hidden items-center gap-6 opacity-0 lg:flex"
    >
      {CHAPTERS.map((chapter, i) => (
        <li
          key={chapter.id}
          data-chapter
          data-active={i === 0}
          className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-smoke/40 transition-colors duration-500 data-[active=true]:text-ivory"
        >
          <span className="h-px w-3 bg-current transition-all duration-500 group-data-[active=true]:w-8 group-data-[active=true]:bg-crimson" />
          <span className="font-serif text-xs tracking-normal">{chapter.index}</span>
          <span className="opacity-0 transition-opacity duration-500 group-data-[active=true]:opacity-100">
            {chapter.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
