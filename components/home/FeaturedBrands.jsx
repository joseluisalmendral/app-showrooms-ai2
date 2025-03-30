"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Datos de ejemplo para las marcas destacadas
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

  // Filtrar marcas según la categoría seleccionada
  const filteredBrands = activeCategory === "Todos"
    ? BRANDS_DATA
    : BRANDS_DATA.filter(brand => brand.categories.includes(activeCategory));

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-12 text-center">
          Marcas que confían en nosotros
        </h2>

        {/* Filtros */}
        <div className="flex justify-center mb-10 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 p-1 bg-white rounded-full shadow-sm border border-neutral-200">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-primary-500 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de marcas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/marcas/${brand.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg p-6 border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-neutral-200 rounded-full mb-4 flex items-center justify-center">
                  {/* Placeholder para el logo */}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {/* Aquí iría la imagen real si estuviera disponible */}
                  {/* <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  /> */}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  {brand.name}
                </h3>
                <div className="text-sm text-neutral-500 mb-3">
                  Exhibiendo desde {brand.since}
                </div>
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

        <div className="mt-10 text-center">
          <Link
            href="/marcas"
            className="btn btn-outline py-2 px-6 hover:bg-primary-50"
          >
            Descubre más marcas
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;