# TRIDENTE Perfumería — prototipo de experiencia visual

Primera secuencia cinematográfica controlada por scroll (Next.js 16 · TypeScript · Tailwind 4 · GSAP ScrollTrigger · Three.js / React Three Fiber / Drei).

> Prototipo. El frasco es un modelo 3D **provisional** hecho con geometría básica y no representa ninguna fragancia real. El bloque editorial y el catálogo contienen **texto provisional**; no hay productos, precios ni checkout.

## Iniciar

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros scripts: `npm run lint`, `npm run build`, `npm run start` (sirve el build de producción).

### Probar los modos alternativos

- `http://localhost:3000/?modo=estatico` → simula *prefers-reduced-motion* (sin secuencia, frasco 3D quieto).
- `http://localhost:3000/?modo=sin-webgl` → simula un navegador sin WebGL (frasco SVG).
- Móvil: DevTools → modo dispositivo (≤ 767 px usa la coreografía móvil y materiales más livianos).

## Estructura

```
src/
├─ app/                      layout (fuentes, metadata) y page (composición)
├─ lib/
│  ├─ capabilities.ts        detección WebGL / reduced motion / móvil sin errores de hidratación
│  ├─ gsap.ts                registro único de ScrollTrigger
│  ├─ sceneDriver.ts         canal GSAP → escena 3D (progreso, entrada de luz, invalidate)
│  └─ sequence.ts            ★ coreografía: poses de cámara/frasco/pedestal/luces, capítulos y colores de fondo
└─ components/
   ├─ navigation/            SiteHeader (logotipo provisional), SiteFooter
   ├─ experience/            HomeExperience: elige secuencia o versión estática
   ├─ sequence/              ScrollSequence (timeline GSAP A→D), HeroCopy (Arrival), SignatureBlock,
   │                         DiscoveryTeaser, ChapterIndicator, StageBackdrop, StaticExperience
   ├─ scene/                 PerfumeScene (Canvas), SceneRig (pose amortiguada), PerfumeBottle, Pedestal,
   │                         LightHalo, AmbientParticles, SceneLighting, fallbacks
   └─ catalog/               CatalogSection (Discovery: espacios reservados)
```

## La secuencia (Fase 2)

| Progreso | Escena | Qué pasa |
|---|---|---|
| 0.00 – 0.12 | **A · The Arrival** | Fondo obsidiana, frasco sobre el pedestal, luz lateral roja y halo. Titular, subtítulo y CTA. |
| 0.12 – 0.46 | **B · The Reveal** | La cámara se acerca, el frasco se eleva y gira; la luz blanca dibuja los contornos; el titular se abre hacia los costados; el fondo pasa a bordó. |
| 0.46 – 0.80 | **C · The Signature** | El frasco vuelve al pedestal y se desplaza a la derecha; composición editorial "Una fragancia. Una presencia inconfundible." |
| 0.80 – 1.00 | **D · Discovery** | El pedestal desciende, el frasco se eleva y se aleja; invitación a la sección de fragancias. |

### Cómo funciona

1. `ScrollSequence` crea una sección alta (520vh desktop / 420vh móvil) con un escenario `sticky`.
2. Una timeline de GSAP con `scrub` anima el DOM y escribe el progreso 0–1 en `sceneDriver`.
3. `SceneRig` convierte ese progreso en la pose de `lib/sequence.ts` (con suavizado) y la comparten luces, halo, pedestal, partículas y frasco.
4. **Sin movimiento autónomo:** el canvas renderiza bajo demanda (`frameloop="demand"`). Solo dibuja mientras la pose no alcanzó la posición que marca el scroll; al subir, todo retrocede exactamente igual. La única animación no ligada al scroll es la entrada de luz y textos al cargar (una vez).
5. Al desmontar, `gsap.context().revert()` elimina timelines, ScrollTrigger y estilos inline.

## Demo de interfaz (Fase 3)

Recorrido completo de la página:

1. **Preloader** (`ui/Preloader`): el logotipo se revela mientras se prepara la escena 3D; una cortina descubre la portada y recién ahí entra la luz y los textos (`lib/introGate.ts`).
2. **Secuencia A → D** (portada 3D).
3. **La colección** (`catalog/CatalogSection`): scroll horizontal fijado en desktop con parallax de frascos; swipe nativo en móvil; grilla con reduced motion. Fichas **provisionales** con frascos SVG ilustrativos (`ui/BottleIllustration`): sin nombres, notas ni precios reales.
4. **La casa** (`sections/Manifesto`): manifiesto que se ilumina palabra por palabra. Es **texto de muestra**.
5. **Banda tipográfica** (`sections/TypeBand`): dos filas gigantes en sentidos opuestos.
6. **Cierre** (`navigation/SiteFooter`): invitación final y wordmark monumental.

Detalles globales: cursor de autor con etiquetas (`ui/Cursor`, atributo `data-cursor="Texto"`), botones magnéticos (`ui/Magnetic`) y header que se oculta al bajar y reaparece al subir. Cursor y magnetismo se desactivan en pantallas táctiles y con reduced motion.

### Calidad por dispositivo

- **Desktop:** vidrio con refracción (`MeshTransmissionMaterial` + buffer propio que excluye el emblema), pedestal con reflejo real (`MeshReflectorMaterial`).
- **Móvil:** vidrio translúcido con reflejos de entorno y pedestal brillante sin reflejo en tiempo real (más liviano).

### Reemplazar el frasco por un modelo real

Exportar el modelo como `.glb` en `public/models/`, cargarlo con `useGLTF` de Drei dentro de un componente nuevo y usarlo en lugar de `<PerfumeBottle />` en `PerfumeScene.tsx` (componente `BottleRig`). Mantener el origen a `BOTTLE_BOTTOM` (1.35) por encima de la base para que apoye en el pedestal.
