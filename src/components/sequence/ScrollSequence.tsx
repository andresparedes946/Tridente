"use client";

import { useEffect, useRef } from "react";
import { getGsap, scheduleRefresh } from "@/lib/gsap";
import { onIntroStart } from "@/lib/introGate";
import { createSceneDriver, type SceneDriver } from "@/lib/sceneDriver";
import { BACKGROUND_STOPS, CHAPTERS, type SceneVariant } from "@/lib/sequence";
import { PerfumeSceneLazy } from "@/components/scene/PerfumeSceneLazy";
import { ArrivalActions, ArrivalHeadline } from "./HeroCopy";
import { ChapterIndicator } from "./ChapterIndicator";
import { DiscoveryTeaser } from "./DiscoveryTeaser";
import { SignatureBlock } from "./SignatureBlock";
import { StageBackdrop } from "./StageBackdrop";

type ScrollSequenceProps = { variant: SceneVariant };

const SECTION_HEIGHT: Record<SceneVariant, string> = {
  desktop: "520vh",
  mobile: "420vh",
};

/**
 * Secuencia cinematográfica A → D. Una sección alta con un escenario sticky;
 * GSAP ScrollTrigger (scrub) convierte el scroll en una línea de tiempo que
 * anima el DOM y escribe el progreso 0–1 que lee la escena 3D.
 * Todo es reversible: al subir, la línea de tiempo retrocede.
 */
export function ScrollSequence({ variant }: ScrollSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const driverRef = useRef<SceneDriver>(createSceneDriver({ intro: 0 }));
  const bgRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLElement>(null);
  const discoveryRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const driver = driverRef.current;
    if (!section) return;
    const { gsap } = getGsap();
    const mobile = variant === "mobile";

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const sigLines = q("[data-sig-line]");
      const sigMeta = q("[data-sig-meta]");
      const chapterItems = q("[data-chapter]");
      let activeChapter = 0;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Capítulo activo según el progreso real del scroll
            let index = 0;
            CHAPTERS.forEach((c, i) => {
              if (self.progress >= c.at) index = i;
            });
            if (index !== activeChapter) {
              activeChapter = index;
              chapterItems.forEach((el, i) => el.setAttribute("data-active", String(i === index)));
            }
          },
        },
      });

      // Progreso para la escena 3D (duración total de la línea de tiempo = 1)
      const progress = { value: 0 };
      tl.to(
        progress,
        {
          value: 1,
          duration: 1,
          onUpdate: () => {
            driver.progress = progress.value;
            driver.invalidate();
          },
        },
        0,
      );
      tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      tl.fromTo(chaptersRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0.1);

      // Fondo: obsidiana → bordó profundo → oscuro (mismas paradas que usa el vidrio)
      gsap.set(bgRef.current, { backgroundColor: BACKGROUND_STOPS[0].color });
      BACKGROUND_STOPS.slice(1).forEach((stop, i) => {
        const prev = BACKGROUND_STOPS[i];
        tl.to(bgRef.current, { backgroundColor: stop.color, duration: stop.at - prev.at }, prev.at);
      });

      // ── B · THE REVEAL: el titular se abre hacia los costados y se desvanece
      tl.fromTo(hintRef.current, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.03 }, 0);
      tl.fromTo(actionsRef.current, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 24, duration: 0.09 }, 0.04);
      tl.fromTo(eyebrowRef.current, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -20, duration: 0.08 }, 0.05);
      tl.fromTo(
        leftRef.current,
        { autoAlpha: 1, xPercent: 0, letterSpacing: "-0.01em" },
        { autoAlpha: 0, xPercent: mobile ? -12 : -28, letterSpacing: "0.08em", duration: 0.2, ease: "power1.in" },
        0.06,
      );
      tl.fromTo(
        rightRef.current,
        { autoAlpha: 1, xPercent: 0, letterSpacing: "-0.01em" },
        { autoAlpha: 0, xPercent: mobile ? 12 : 28, letterSpacing: "0.08em", duration: 0.2, ease: "power1.in" },
        0.06,
      );

      // ── C · THE SIGNATURE: revelado línea a línea
      tl.fromTo(signatureRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.49);
      tl.fromTo(sigLines, { yPercent: 110 }, { yPercent: 0, duration: 0.08, stagger: 0.025, ease: "power2.out" }, 0.5);
      tl.fromTo(sigMeta, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, stagger: 0.03 }, 0.55);
      tl.fromTo(
        sigLines,
        { yPercent: 0 },
        { yPercent: -110, duration: 0.06, stagger: 0.015, ease: "power1.in", immediateRender: false },
        0.77,
      );
      tl.fromTo(sigMeta, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.04, immediateRender: false }, 0.77);
      tl.fromTo(signatureRef.current, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01, immediateRender: false }, 0.84);

      // ── D · DISCOVERY
      tl.fromTo(
        discoveryRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out", immediateRender: false },
        0.87,
      );

      // ── Entrada inicial: espera a que el preloader termine (una sola vez)
      if (window.scrollY < 10) {
        driver.intro = 0;
        gsap.set(q("[data-intro]"), { autoAlpha: 0, y: 28 });
      } else {
        driver.intro = 1;
        driver.invalidate();
      }
    }, section);

    const q2 = gsap.utils.selector(section);
    const stopIntro = onIntroStart(() => {
      ctx.add(() => {
        gsap.to(driver, { intro: 1, duration: 2.6, ease: "power2.out", onUpdate: () => driver.invalidate() });
        gsap.to(q2("[data-intro]"), { autoAlpha: 1, y: 0, duration: 1.4, ease: "power3.out", stagger: 0.12, delay: 0.5 });
      });
    });
    scheduleRefresh();

    return () => {
      stopIntro();
      ctx.revert(); // elimina timelines, ScrollTrigger y estilos inline
    };
  }, [variant]);

  return (
    <section ref={sectionRef} aria-label="Presentación" className="relative" style={{ height: SECTION_HEIGHT[variant] }}>
      {/* Ancla de navegación hacia The Signature */}
      <span id="esencia" aria-hidden="true" className="absolute left-0 top-[56%]" />

      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <StageBackdrop bgRef={bgRef} />
        <ArrivalHeadline eyebrowRef={eyebrowRef} leftRef={leftRef} rightRef={rightRef} />

        <PerfumeSceneLazy variant={variant} driverRef={driverRef} className="pointer-events-none absolute inset-0 z-20" />

        <ArrivalActions ref={actionsRef} />

        <div className="pointer-events-none absolute inset-0 z-30 flex items-end px-6 pb-12 md:items-center md:px-12 md:pb-0 lg:pl-[16vw]">
          <SignatureBlock ref={signatureRef} animated className="pointer-events-auto" />
        </div>

        <DiscoveryTeaser ref={discoveryRef} />
        <ChapterIndicator ref={chaptersRef} />

        <div
          ref={hintRef}
          aria-hidden="true"
          className="absolute left-1/2 top-24 z-30 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-smoke md:flex"
        >
          Desplazá para descubrir
          <span className="h-10 w-px bg-gradient-to-b from-smoke to-transparent" />
        </div>

        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-40 h-px bg-ivory/10">
          <div ref={barRef} className="h-full origin-left scale-x-0 bg-crimson" />
        </div>
      </div>
    </section>
  );
}
