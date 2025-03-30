"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Datos de ejemplo para los showrooms destacados
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
  const sliderRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Funciones para el carrusel deslizable
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Velocidad del scroll
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
            Showrooms destacados esta semana
          </h2>
          <div className="hidden md:flex space-x-2">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-700"
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
              onClick={scrollNext}
              className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-700"
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
        </div>

        <div
          className="relative -mx-4"
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          <div
            ref={sliderRef}
            className="flex space-x-6 px-4 overflow-x-auto hide-scrollbar snap-x"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            {SHOWROOMS_DATA.map((showroom) => (
              <div
                key={showroom.id}
                className="min-w-[300px] md:min-w-[350px] snap-start"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-neutral-200">
                  <div className="relative h-48 w-full">
                    {/* Placeholder para la imagen */}
                    <div className="absolute inset-0 bg-neutral-300 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-neutral-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    {/* Aquí iría la imagen real si estuviera disponible */}
                    {/* <Image
                      src={showroom.image}
                      alt={showroom.name}
                      fill
                      className="object-cover"
                    /> */}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">
                      {showroom.name}
                    </h3>
                    <p className="text-neutral-600 mb-3">{showroom.location}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {showroom.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-primary-50 text-primary-700 text-xs font-medium py-1 px-2 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-neutral-700 text-sm">
                          Capacidad:
                        </span>{" "}
                        <span className="font-medium">{showroom.capacity} marcas</span>
                      </div>
                      <div>
                        <span className="text-neutral-700 text-sm">Desde:</span>{" "}
                        <span className="font-medium">
                          {showroom.basePrice}€/día
                        </span>
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
                                  : "text-neutral-300"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-neutral-700 ml-1">
                          {showroom.rating}
                        </span>
                      </div>
                      <Link
                        href={`/showrooms/${showroom.slug}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
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

        <div className="mt-10 text-center">
          <Link
            href="/showrooms"
            className="btn btn-outline py-2 px-6 hover:bg-primary-50"
          >
            Ver todos los showrooms
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedShowrooms;