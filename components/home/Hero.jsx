"use client";

import { useState } from "react";
import Image from "next/image";

const Hero = () => {
  const [searchType, setSearchType] = useState("showrooms"); // "marcas" o "showrooms"
  const [location, setLocation] = useState("");
  const [style, setStyle] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Aquí implementaríamos la lógica real de búsqueda
    console.log({
      type: searchType,
      location,
      style,
    });
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 to-neutral-900/70 z-10"></div>
        <Image
          src="/images/hero-background.jpg" // Placeholder - se reemplazaría con una imagen real
          alt="Showroom elegante con marcas exhibiendo"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Conectamos marcas con los mejores espacios para brillar
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl">
            Encuentra el showroom perfecto para tu marca o las marcas ideales para tu espacio. Potencia tu negocio con nuestra plataforma especializada.
          </p>

          {/* Formulario de búsqueda */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Selector tipo radio */}
                <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 text-center ${
                      searchType === "marcas"
                        ? "bg-primary-500 text-white"
                        : "bg-white text-neutral-700 hover:bg-neutral-100"
                    }`}
                    onClick={() => setSearchType("marcas")}
                  >
                    Busco Marcas
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 text-center ${
                      searchType === "showrooms"
                        ? "bg-primary-500 text-white"
                        : "bg-white text-neutral-700 hover:bg-neutral-100"
                    }`}
                    onClick={() => setSearchType("showrooms")}
                  >
                    Busco Showrooms
                  </button>
                </div>

                {/* Campo de ubicación */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Ubicación (ciudad, país...)"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {/* Dropdown de estilos */}
                <div className="flex-1">
                  <select
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    <option value="">Todos los estilos</option>
                    <option value="casual">Casual</option>
                    <option value="urbano">Urbano</option>
                    <option value="formal">Formal</option>
                    <option value="streetwear">Streetwear</option>
                    <option value="sostenible">Sostenible</option>
                  </select>
                </div>

                {/* Botón de búsqueda */}
                <button
                  type="submit"
                  className="px-6 py-2 bg-secondary-500 hover:bg-secondary-600 text-white font-medium rounded-lg transition-colors"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* Indicadores */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 mt-10 text-white">
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">500+</div>
              <div className="text-white/80">Showrooms</div>
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">1,200+</div>
              <div className="text-white/80">Marcas</div>
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">30+</div>
              <div className="text-white/80">Ciudades</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;