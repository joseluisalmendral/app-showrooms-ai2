"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const Hero = () => {
  const [searchType, setSearchType] = useState("showrooms");
  const [location, setLocation] = useState("");
  const [style, setStyle] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Manejar la carga del video
  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      const handleLoadedData = () => {
        setVideoLoaded(true);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      
      // Si el video ya está cargado cuando se monta el componente
      if (video.readyState >= 3) {
        setVideoLoaded(true);
      }
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({
      type: searchType,
      location,
      style,
    });
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Contenedor de background con imagen/video */}
      <div className="absolute inset-0 z-0">
        {/* Overlay con gradiente para mejorar contraste */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 to-neutral-900/80 z-10"></div>
        
        {/* Imagen de fondo estática (visible hasta que el video cargue) */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src="/images/hero-background.jpg"
            alt="Showroom elegante con marcas exhibiendo"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        
        {/* Video de fondo */}
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="/videos/hero_video.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Conectamos marcas con los mejores espacios para brillar
          </h1>
          <p className="text-xl text-white mb-10 max-w-2xl">
            Encuentra el showroom perfecto para tu marca o las marcas ideales para tu espacio. Potencia tu negocio con nuestra plataforma especializada.
          </p>

          {/* Formulario de búsqueda */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="md:flex md:items-center md:space-x-4">
                {/* Selector tipo radio */}
                <div className="w-full md:w-auto mb-4 md:mb-0">
                  <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 text-center whitespace-nowrap ${
                        searchType === "marcas"
                          ? "bg-brand-teal-600 text-white"
                          : "bg-white text-neutral-700 hover:bg-neutral-100"
                      }`}
                      onClick={() => setSearchType("marcas")}
                    >
                      Busco Marcas
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 text-center whitespace-nowrap ${
                        searchType === "showrooms"
                          ? "bg-brand-teal-600 text-white"
                          : "bg-white text-neutral-700 hover:bg-neutral-100"
                      }`}
                      onClick={() => setSearchType("showrooms")}
                    >
                      Busco Showrooms
                    </button>
                  </div>
                </div>

                {/* Campos de búsqueda */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:space-x-3 space-y-4 md:space-y-0">
                  {/* Campo de ubicación */}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Ubicación (ciudad, país...)"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  {/* Dropdown de estilos */}
                  <div className="flex-1">
                    <select
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 appearance-none bg-white"
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
                  <div className="md:w-auto">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-2 bg-brand-coral-600 hover:bg-brand-coral-700 text-white font-medium rounded-lg transition-colors shadow-md"
                    >
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Indicadores */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 mt-10 text-white">
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">500+</div>
              <div className="text-white">Showrooms</div>
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">1,200+</div>
              <div className="text-white">Marcas</div>
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">30+</div>
              <div className="text-white">Ciudades</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;