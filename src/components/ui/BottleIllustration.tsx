import { useId } from "react";

export type BottleShape = "square" | "slim" | "round" | "facet";

type BottleIllustrationProps = {
  shape: BottleShape;
  /** Color del líquido (arriba / abajo) */
  liquid: [string, string];
  className?: string;
};

/**
 * Frascos ILUSTRATIVOS en SVG para las fichas provisionales de la colección.
 * Son siluetas genéricas: no representan productos reales.
 */
export function BottleIllustration({ shape, liquid, className }: BottleIllustrationProps) {
  const id = useId().replace(/:/g, "");
  const g = (name: string) => `${name}-${id}`;

  const body = {
    square: <rect x="40" y="150" width="120" height="170" rx="10" />,
    slim: <rect x="62" y="120" width="76" height="200" rx="8" />,
    round: <ellipse cx="100" cy="245" rx="72" ry="78" />,
    facet: <path d="M52 150 H148 L166 200 V300 L148 322 H52 L34 300 V200 Z" />,
  }[shape];

  const cap = {
    square: { x: 72, y: 54, w: 56, h: 72 },
    slim: { x: 80, y: 22, w: 40, h: 76 },
    round: { x: 82, y: 104, w: 36, h: 48 },
    facet: { x: 70, y: 62, w: 60, h: 64 },
  }[shape];

  const neckY = cap.y + cap.h;
  const bodyTop = { square: 150, slim: 120, round: 168, facet: 150 }[shape];

  return (
    <svg viewBox="0 0 200 340" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={g("liq")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={liquid[0]} />
          <stop offset="1" stopColor={liquid[1]} />
        </linearGradient>
        <linearGradient id={g("glass")} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.15" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0.03" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={g("gold")} x1="0" x2="1">
          <stop offset="0" stopColor="#7a5a2e" />
          <stop offset="0.45" stopColor="#f0d29b" />
          <stop offset="1" stopColor="#8a6634" />
        </linearGradient>
        <linearGradient id={g("cap")} x1="0" x2="1">
          <stop offset="0" stopColor="#060405" />
          <stop offset="0.35" stopColor="#3a2c30" />
          <stop offset="0.6" stopColor="#120d10" />
          <stop offset="1" stopColor="#030203" />
        </linearGradient>
        <clipPath id={g("clip")}>{body}</clipPath>
      </defs>
      <rect x={cap.x} y={cap.y} width={cap.w} height={cap.h} rx={shape === "round" ? 18 : 3} fill={`url(#${g("cap")})`} />
      <rect x={cap.x - 4} y={neckY} width={cap.w + 8} height="5" fill={`url(#${g("gold")})`} />
      <rect x="86" y={neckY + 5} width="28" height={Math.max(8, bodyTop - neckY - 5)} fill={`url(#${g("gold")})`} />
      <g clipPath={`url(#${g("clip")})`}>
        <rect x="0" y={bodyTop + 22} width="200" height="220" fill={`url(#${g("liq")})`} />
        <rect x="0" y={bodyTop} width="200" height="220" fill={`url(#${g("glass")})`} />
        <rect x="46" y={bodyTop + 10} width="5" height="150" rx="2.5" fill="#fff" opacity="0.18" />
      </g>
      <g fill="none" stroke="#fff" strokeOpacity="0.28">
        {body}
      </g>
      <g fill="none" stroke={`url(#${g("gold")})`} strokeWidth="2">
        <rect x="82" y={bodyTop + 52} width="36" height="54" />
        <path d={`M100 ${bodyTop + 64}v32M92 ${bodyTop + 68}v10M108 ${bodyTop + 68}v10M90 ${bodyTop + 78}h20`} />
      </g>
    </svg>
  );
}
