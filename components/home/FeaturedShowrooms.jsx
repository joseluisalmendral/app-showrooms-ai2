"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

// Datos de ejemplo para los showrooms destacados (mantenidos igual)
const SHOWROOMS_DATA = [
  {
    id: "s1",
    name: "Espacio Central",
    location: "Madrid, España",
    specialties: ["Ideal para streetwear", "Céntrico"],
    capacity: 8,
    basePrice: 120,
    rating: 4.8,
    image: "/images/showroom-1.jpg", // Placeholder
    slug: "espacio-central"
  },
  {
    id: "s2",
    name: "Urban Gallery",
    location: "Barcelona, España",
    specialties: ["Minimalista", "Áreas flexibles"],
    capacity: 12,
    basePrice: 150,
    rating: 4.7,
    image: "/images/showroom-2.jpg", // Placeholder
    slug: "urban-gallery"
  },
  {
    id: "s3",
    name: "Fashion Hub",
    location: "Valencia, España",
    specialties: ["Lujo", "Eventos"],
    capacity: 5,
    basePrice: 200,
    rating: 4.9,
    image: "/images/showroom-3.jpg", // Placeholder
    slug: "fashion-hub"
  },
  {
    id: "s4",
    name: "Studio Concept",
    location: "Sevilla, España",
    specialties: ["Sostenible", "Iluminación natural"],
    capacity: 6,
    basePrice: 100,
    rating: 4.6,
    image: "/images/showroom-4.jpg", // Placeholder
    slug: "studio-concept"
  },
  {
    id: "s5",
    name: "Design Loft",
    location: "Bilbao, España",
    specialties: ["Industrial", "Amplio"],
    capacity: 10,
    basePrice: 130,
    rating: 4.5,
    image: "/images/showroom-5.jpg", // Placeholder
    slug: "design-loft"
  }
];

const FeaturedShowrooms = () => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [cardsInView, setCardsInView] = useState(3);
  const [animation, setAnimation] = useState(true);

  // Verificar si está en un dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      // Determinar número de tarjetas visibles según el ancho
      if (width < 640) {
        setCardsInView(1);
      } else if (width < 1024) {
        setCardsInView(2);
      } else {
        setCardsInView(3);
      }
    };

    handleResize(); // Ejecutar al montar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para ir a la siguiente diapositiva
  const nextSlide = useCallback(() => {
    setHasInteracted(true);
    setAnimation(true);
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= SHOWROOMS_DATA.length - cardsInView) {
        return 0;
      }
      return prevIndex + 1;
    });
  }, [cardsInView]);

  // Función para ir a la diapositiva anterior
  const prevSlide = useCallback(() => {
    setHasInteracted(true);
    setAnimation(true);
    setCurrentIndex((prevIndex) => {
      if (prevIndex <= 0) {
        return SHOWROOMS_DATA.length - cardsInView;
      }
      return prevIndex - 1;
    });
  }, [cardsInView]);

  // Función para ir a una diapositiva específica
  const goToSlide = (index) => {
    setHasInteracted(true);
    setAnimation(true);
    setCurrentIndex(index);
  };

  // Autoplay - ajustado a 3000ms (3 segundos) para ser más rápido
  useEffect(() => {
    let intervalId;

    if (!isPaused && !isHovering && !hasInteracted) {
      intervalId = setInterval(() => {
        nextSlide();
      }, 3000); // Cambia cada 3 segundos (antes era 5 segundos)
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaused, isHovering, hasInteracted, nextSlide]);

  // Reset hasInteracted después de un tiempo de inactividad - reducido a 6 segundos
  useEffect(() => {
    let timeoutId;
    
    if (hasInteracted) {
      timeoutId = setTimeout(() => {
        setHasInteracted(false);
      }, 6000); // Vuelve a autoplay después de 6 segundos de inactividad (antes 8)
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasInteracted]);

  // Manejo de eventos táctiles
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide(); // Deslizar a la izquierda
    }
    
    if (touchStart - touchEnd < -50) {
      prevSlide(); // Deslizar a la derecha
    }
  };

  // Manejo de teclas
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section className="py-20 bg-gradient-to-b from-brand-celeste-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-neutral-900">
            Showrooms destacados esta semana
          </h2>
          <div className="hidden md:flex space-x-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white border border-brand-neutral-200 hover:bg-brand-mauve-50 transition-colors flex items-center justify-center text-brand-mauve-700"
              aria-label="Ver showroom anterior"
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
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white border border-brand-neutral-200 hover:bg-brand-mauve-50 transition-colors flex items-center justify-center text-brand-mauve-700"
              aria-label="Ver siguiente showroom"
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
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-10 h-10 rounded-full bg-white border border-brand-neutral-200 hover:bg-brand-mauve-50 transition-colors flex items-center justify-center text-brand-mauve-700"
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
          </div>
        </div>

        {/* Carrusel mejorado con el nuevo diseño */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            ref={carouselRef}
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Carrusel de showrooms destacados"
            aria-roledescription="carrusel"
          >
            <div 
              className={`flex transition-transform duration-300 ease-in-out ${animation ? '' : 'transition-none'}`}
              style={{ transform: `translateX(-${currentIndex * (100 / cardsInView)}%)` }}
            >
              {SHOWROOMS_DATA.map((showroom, index) => (
                <div
                  key={showroom.id}
                  className={`px-3 w-full ${isMobile ? 'min-w-full' : cardsInView === 2 ? 'min-w-[50%]' : 'min-w-[33.333%]'}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${SHOWROOMS_DATA.length}`}
                >
                  <div className="h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-brand-neutral-200 group">
                    <div className="relative h-64 w-full overflow-hidden">
                      <PlaceholderImage
                        src={showroom.image}
                        alt={showroom.name}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        fill
                        placeholderType="showroom"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-neutral-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 w-full p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-block bg-brand-celeste-300 text-brand-neutral-900 text-xs font-medium px-2 py-1 rounded-full mb-2">
                          {showroom.basePrice}€/día
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-brand-mauve-600 transition-colors">
                        {showroom.name}
                      </h3>
                      <p className="text-brand-neutral-600 mb-3 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-brand-mauve-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {showroom.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {showroom.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="badge badge-primary py-1 px-2 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-brand-neutral-700 text-sm">
                            Capacidad:
                          </span>{" "}
                          <span className="font-medium">{showroom.capacity} marcas</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${
                                  i < Math.floor(showroom.rating)
                                    ? "text-yellow-400"
                                    : i < showroom.rating
                                    ? "text-yellow-400" // Para estrellas parciales
                                    : "text-brand-neutral-300"
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-brand-neutral-700 ml-1">
                            {showroom.rating}
                          </span>
                        </div>
                        <Link
                          href={`/showrooms/${showroom.slug}`}
                          className="text-white bg-brand-mauve-600 hover:bg-brand-mauve-700 font-medium text-sm px-3 py-1.5 rounded-md transition-colors"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de diapositivas (bullets) con nuevo estilo */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: SHOWROOMS_DATA.length - cardsInView + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index
                    ? "bg-brand-mauve-600 w-6"
                    : "bg-brand-neutral-300 hover:bg-brand-neutral-400"
                }`}
                aria-label={`Ir a diapositiva ${index + 1}`}
                aria-current={currentIndex === index ? "true" : "false"}
              />
            ))}
          </div>
          
          {/* Botones de navegación laterales para móvil y tablets */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 md:hidden bg-white bg-opacity-90 hover:bg-opacity-100 w-10 h-10 rounded-full shadow-md flex items-center justify-center z-10"
            onClick={prevSlide}
            aria-label="Ver showroom anterior"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-brand-neutral-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 md:hidden bg-white bg-opacity-90 hover:bg-opacity-100 w-10 h-10 rounded-full shadow-md flex items-center justify-center z-10"
            onClick={nextSlide}
            aria-label="Ver siguiente showroom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-brand-neutral-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/showrooms"
            className="btn btn-outline py-2 px-6 hover:bg-brand-mauve-50"
          >
            Ver todos los showrooms
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedShowrooms;