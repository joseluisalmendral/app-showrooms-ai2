import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedShowrooms from "@/components/home/FeaturedShowrooms";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import SuccessStories from "@/components/home/SuccessStories";
import PlatformStats from "@/components/home/PlatformStats";
import BlogPreview from "@/components/home/BlogPreview";
import FinalCTA from "@/components/home/FinalCTA";

// Metadatos específicos para la página de inicio
export const metadata = {
  title: "Conecta Marcas y Showrooms | La Plataforma Líder para Moda",
  description: "Conectamos marcas de moda con los mejores espacios para exhibir. Encuentra showrooms o marcas que potencien tu negocio.",
  openGraph: {
    title: "Conecta Marcas y Showrooms | Plataforma Líder para Moda",
    description: "Conectamos marcas de moda con los mejores espacios para exhibir. Encuentra showrooms o marcas que potencien tu negocio.",
  },
};

export default function Home() {
  return (
    <>
      {/* Sección Hero */}
      <Hero />

      {/* Sección Cómo Funciona */}
      <HowItWorks />

      {/* Sección Showrooms Destacados */}
      <FeaturedShowrooms />

      {/* Sección Marcas Destacadas */}
      <FeaturedBrands />

      {/* Sección Casos de Éxito */}
      <SuccessStories />

      {/* Sección Estadísticas de la Plataforma */}
      <PlatformStats />

      {/* Sección Blog/Novedades */}
      <BlogPreview />

      {/* Sección Llamada a la Acción Final */}
      <FinalCTA />
    </>
  );
}