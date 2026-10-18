/**
 * Frasco ilustrativo en SVG para navegadores sin WebGL, para el render del
 * servidor y como respaldo si la escena 3D falla. Es decorativo.
 */
export function StaticBottleFallback({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="flex h-full w-full items-center justify-center">
        <svg viewBox="0 0 200 340" className="h-[62%] max-h-[640px] w-auto drop-shadow-[0_0_60px_rgba(179,18,31,0.45)]">
          <defs>
            <linearGradient id="tb-glass" x1="0" x2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
              <stop offset="0.18" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="0.8" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="1" stopColor="#ffb3b3" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="tb-liquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a3101e" />
              <stop offset="1" stopColor="#3a0408" />
            </linearGradient>
            <linearGradient id="tb-gold" x1="0" x2="1">
              <stop offset="0" stopColor="#7a5a2e" />
              <stop offset="0.45" stopColor="#f0d29b" />
              <stop offset="1" stopColor="#8a6634" />
            </linearGradient>
            <linearGradient id="tb-cap" x1="0" x2="1">
              <stop offset="0" stopColor="#0b0809" />
              <stop offset="0.35" stopColor="#3a2c30" />
              <stop offset="0.6" stopColor="#120d10" />
              <stop offset="1" stopColor="#050405" />
            </linearGradient>
          </defs>
          <rect x="62" y="8" width="76" height="82" rx="3" fill="url(#tb-cap)" />
          <rect x="58" y="90" width="84" height="7" fill="url(#tb-gold)" />
          <rect x="80" y="97" width="40" height="22" fill="url(#tb-gold)" />
          <rect x="22" y="119" width="156" height="206" rx="12" fill="url(#tb-liquid)" opacity="0.92" />
          <rect x="22" y="119" width="156" height="206" rx="12" fill="url(#tb-glass)" stroke="#ffffff" strokeOpacity="0.25" />
          <g fill="none" stroke="url(#tb-gold)" strokeWidth="2.5">
            <rect x="72" y="176" width="56" height="80" />
            <path d="M100 196v44M90 202v14M110 202v14M88 216h24" />
          </g>
          <rect x="30" y="128" width="6" height="186" rx="3" fill="#ffffff" opacity="0.18" />
        </svg>
      </div>
    </div>
  );
}
