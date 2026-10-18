import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { HomeExperience } from "@/components/experience/HomeExperience";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { Manifesto } from "@/components/sections/Manifesto";
import { TypeBand } from "@/components/sections/TypeBand";
import { Preloader } from "@/components/ui/Preloader";
import { Cursor } from "@/components/ui/Cursor";

export default function Home() {
  return (
    <>
      {/* Sin JavaScript el preloader no puede cerrarse: se oculta */}
      <noscript>
        <style>{"[data-preloader]{display:none!important}"}</style>
      </noscript>
      <Preloader />
      <Cursor />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-2 focus:text-obsidian"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <HomeExperience />
        <CatalogSection />
        <Manifesto />
        <TypeBand />
      </main>
      <SiteFooter />
    </>
  );
}
