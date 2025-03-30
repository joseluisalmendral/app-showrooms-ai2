"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

// Datos de ejemplo para las marcas destacadas (mantenidos igual)
const BRANDS_DATA = [
  {
    id: "b1",
    name: "Urban Style",
    logo: "/images/brand-1.jpg", // Placeholder
    since: "2020",
    categories: ["Urbano", "Streetwear"],
    slug: "urban-style"
  },
  {
    id: "b2",
    name: "Eco Fashion",
    logo: "/images/brand-2.jpg", // Placeholder
    since: "2019",
    categories: ["Sostenible", "Casual"],
    slug: "eco-fashion"
  },
  {
    id: "b3",
    name: "Elegance",
    logo: "/images/brand-3.jpg", // Placeholder
    since: "2018",
    categories: ["Formal", "Lujo"],
    slug: "elegance"
  },
  {
    id: "b4",
    name: "Modern Kids",
    logo: "/images/brand-4.jpg", // Placeholder
    since: "2021",
    categories: ["Infantil", "Casual"],
    slug: "modern-kids"
  },
  {
    id: "b5",
    name: "Sport Plus",
    logo: "/images/brand-5.jpg", // Placeholder
    since: "2017",
    categories: ["Deportivo", "Casual"],
    slug: "sport-plus"
  },
  {
    id: "b6",
    name: "Vintage Collection",
    logo: "/images/brand-6.jpg", // Placeholder
    since: "2022",
    categories: ["Vintage", "Urbano"],
    slug: "vintage-collection"
  },
  {
    id: "b7",
    name: "Minimal",
    logo: "/images/brand-7.jpg", // Placeholder
    since: "2020",
    categories: ["Minimalista", "Formal"],
    slug: "minimal"
  },
  {
    id: "b8",
    name: "Street Culture",
    logo: "/images/brand-8.jpg", // Placeholder
    since: "2019",
    categories: ["Streetwear", "Urbano"],
    slug: "street-culture"
  }
];

// Categorías disponibles
const CATEGORIES = ["Todos", "Casual", "Formal", "Streetwear", "Urbano", "Sostenible", "Vintage", "Minimalista", "Deportivo"];

const FeaturedBrands = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [brandsPerPage, setBrandsPerPage] = useState(4);
  const [animation, setAnimation] = useState(true);
  
  const carouselRef = useRef(null);

  // Filtrar marcas según la categoría seleccionada
  const filteredBrands = activeCategory === "Todos"
    ? BRANDS_DATA
    : BRANDS_DATA.filter(brand => brand.categories.includes(activeCategory));

  // Determinar el número de páginas del carrusel
  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);

  // Ajustar el número de marcas por página según el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBrandsPerPage(1);
      } else if (width < 768) {
        setBrandsPerPage(2);
      } else if (width < 1024) {
        setBrandsPerPage(3);
      } else {
        setBrandsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para ir a la siguiente página
  const nextPage = useCallback(() => {
    setHasInteracted(true);
    setAnimation(true);
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  }, [totalPages]);

  // Función para ir a la página anterior
  const prevPage = useCallback(() => {
    setHasInteracted(true);
    setAnimation(true);
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Función para ir a una página específica
  const goToPage = (page) => {
    setHasInteracted(true);
    setAnimation(true);
    setCurrentPage(page);
  };

  // Resetear la página cuando cambia la categoría
  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory]);

  // Autoplay
  useEffect(() => {
    let intervalId;

    if (!isPaused && !isHovering && !hasInteracted && totalPages > 1) {
      intervalId = setInterval(() => {
        nextPage();
      }, 6000); // Cambiar cada 6 segundos
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaused, isHovering, hasInteracted, nextPage, totalPages]);

  // Reset hasInteracted después de un tiempo de inactividad
  useEffect(() => {
    let timeoutId;
    
    if (hasInteracted) {
      timeoutId = setTimeout(() => {
        setHasInteracted(false);
      }, 8000); // Vuelve a autoplay después de 8 segundos de inactividad
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasInteracted]);

  // Obtener las marcas de la página actual
  const currentBrands = filteredBrands.slice(
    currentPage * brandsPerPage,
    (currentPage + 1) * brandsPerPage
  );

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
            Marcas que confían en nosotros
          </h2>
          
          {/* Controles del carrusel - visible en pantallas md+ */}
          {totalPages > 1 && (
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-10 h-10 rounded-full bg-brand-teal-50 border border-brand-teal-200 hover:bg-brand-teal-100 transition-colors flex items-center justify-center text-brand-teal-700"
                aria-label={isPaused ? "Reanudar presentación automática" : "Pausar presentación automática"}
              >
                {isPaused ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={prevPage}
                className="w-10 h-10 rounded-full bg-brand-teal-50 border border-brand-teal-200 hover:bg-brand-teal-100 transition-colors flex items-center justify-center text-brand-teal-700"
                aria-label="Ver marcas anteriores"
                disabled={totalPages <= 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextPage}
                className="w-10 h-10 rounded-full bg-brand-teal-50 border border-brand-teal-200 hover:bg-brand-teal-100 transition-colors flex items-center justify-center text-brand-teal-700"
                aria-label="Ver siguientes marcas"
                disabled={totalPages <= 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="overflow-x-auto scrollbar-hide mb-8">
          <div className="flex space-x-2 p-1 bg-white rounded-full shadow-sm border border-neutral-200 inline-flex">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-brand-teal-600 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel de marcas */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          ref={carouselRef}
        >
          {filteredBrands.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-neutral-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-neutral-600">No se encontraron marcas en esta categoría.</p>
            </div>
          ) : (
            <>
              <div 
                className={`flex transition-transform duration-500 ease-in-out ${animation ? '' : 'transition-none'}`}
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
                role="region"
                aria-roledescription="carousel"
                aria-label="Marcas destacadas"
              >
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <div 
                    key={`page-${pageIndex}`} 
                    className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Página ${pageIndex + 1} de ${totalPages}`}
                  >
                    {filteredBrands
                      .slice(
                        pageIndex * brandsPerPage,
                        (pageIndex + 1) * brandsPerPage
                      )
                      .map((brand) => (
                        <Link
                          key={brand.id}
                          href={`/marcas/${brand.slug}`}
                          className="group block"
                        >
                          <div className="bg-white rounded-lg p-6 border border-neutral-200 hover:border-brand-teal-500 hover:shadow-md transition-all h-full flex flex-col items-center justify-center text-center">
                            <div className="mb-4 relative">
                              <div className="w-24 h-24 bg-neutral-100 rounded-full overflow-hidden flex items-center justify-center group-hover:ring-4 ring-brand-teal-100 transition-all">
                                <PlaceholderImage
                                  src={brand.logo}
                                  alt={brand.name}
                                  width={80}
                                  height={80}
                                  className="object-cover"
                                  placeholderType="brand"
                                />
                              </div>
                              <div className="absolute -bottom-2 -right-2 bg-brand-teal-50 text-brand-teal-800 text-xs font-medium py-1 px-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-brand-teal-200">
                                Desde {brand.since}
                              </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-teal-600 transition-colors">
                              {brand.name}
                            </h3>
                            <div className="flex flex-wrap justify-center gap-2 mt-auto">
                              {brand.categories.map((category, index) => (
                                <span
                                  key={index}
                                  className="bg-neutral-100 text-neutral-700 text-xs py-1 px-2 rounded-full"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                ))}
              </div>

              {/* Indicadores de página para mobile */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentPage === index
                          ? "bg-brand-teal-600 w-6"
                          : "bg-neutral-300 hover:bg-neutral-400"
                      }`}
                      aria-label={`Ir a página ${index + 1}`}
                      aria-current={currentPage === index ? "true" : "false"}
                    />
                  ))}
                </div>
              )}

              {/* Botones de navegación laterales para móvil y tablets */}
              {totalPages > 1 && (
                <>
                  <button
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-90 w-10 h-10 rounded-full shadow-md flex items-center justify-center z-10 md:hidden"
                    onClick={prevPage}
                    aria-label="Ver marcas anteriores"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-neutral-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-90 w-10 h-10 rounded-full shadow-md flex items-center justify-center z-10 md:hidden"
                    onClick={nextPage}
                    aria-label="Ver siguientes marcas"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-neutral-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/marcas"
            className="btn btn-outline py-2 px-6 hover:bg-brand-teal-50"
          >
            Descubre más marcas
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;