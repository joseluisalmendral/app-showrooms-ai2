"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Datos de ejemplo para el autocompletado de ubicaciones
const LOCATIONS = [
  "Madrid, España",
  "Barcelona, España",
  "Valencia, España",
  "Sevilla, España",
  "Bilbao, España",
  "Zaragoza, España",
  "Málaga, España",
  "Murcia, España",
  "Palma de Mallorca, España",
  "Las Palmas, España",
  "Alicante, España",
  "Córdoba, España",
  "Valladolid, España",
  "Vigo, España",
  "Gijón, España",
  "París, Francia",
  "Londres, Reino Unido",
  "Berlín, Alemania",
  "Roma, Italia",
  "Milán, Italia"
];

const Hero = () => {
  const [searchType, setSearchType] = useState("showrooms");
  const [location, setLocation] = useState("");
  const [style, setStyle] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  // Estados para el autocompletado
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const videoRef = useRef(null);
  // Referencias para el autocompletado
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const howItWorksRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Filtrar ubicaciones basadas en el texto de entrada
  useEffect(() => {
    if (location.trim() === "") {
      // Si no hay texto, mostrar todas las ubicaciones
      setFilteredLocations(LOCATIONS);
    } else {
      // Si hay texto, filtrar las ubicaciones
      const filtered = LOCATIONS.filter(
        loc => loc.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [location]);

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

  // Manejar cambio en el campo de ubicación
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setShowSuggestions(true);
  };

  // Manejar foco en el campo de ubicación (mostrar todas las ubicaciones)
  const handleLocationFocus = () => {
    // Mostrar todas las ubicaciones al recibir el foco
    setFilteredLocations(LOCATIONS);
    setShowSuggestions(true);
  };

  // Seleccionar una ubicación de las sugerencias
  const handleSelectLocation = (loc) => {
    setLocation(loc);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  // Manejar teclado para navegación en sugerencias
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({
      type: searchType,
      location,
      style,
    });
  };

  // Función para scroll a la sección "Cómo funciona"
  const scrollToHowItWorks = () => {
    // Obtener el elemento con ID "como-funciona"
    const howItWorksSection = document.getElementById("como-funciona");
    
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden">
      {/* Contenedor de background con imagen/video */}
      <div className="absolute inset-0 z-0">
        {/* Overlay con opacidad equilibrada y gradiente moderno */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-neutral-950/80 via-brand-neutral-900/60 to-brand-neutral-950/70 z-10"></div>
        
        {/* Imagen de fondo estática (visible hasta que el video cargue) con efecto parallax */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          <Image
            src="/images/hero-background.jpg"
            alt="Showroom elegante con marcas exhibiendo"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        
        {/* Video de fondo con efecto parallax */}
        <div 
          className={`absolute w-full h-full overflow-hidden transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute w-full h-full object-cover scale-110"
          >
            <source src="/videos/hero_video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-md">
            Conectamos marcas con los mejores espacios para brillar
          </h1>
          <p className="text-xl text-white mb-10 max-w-2xl drop-shadow-md">
            Encuentra el showroom perfecto para tu marca o las marcas ideales para tu espacio. Potencia tu negocio con nuestra plataforma especializada.
          </p>

          {/* Formulario de búsqueda con autocompletado - Diseño moderno */}
          <div className="bg-white/95 p-6 rounded-xl shadow-xl backdrop-blur-sm">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="md:flex md:items-center md:space-x-4">
                {/* Selector tipo radio con diseño moderno */}
                <div className="w-full md:w-auto mb-4 md:mb-0">
                  <div className="flex border border-brand-neutral-200 rounded-lg overflow-hidden shadow-sm">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 text-center whitespace-nowrap ${
                        searchType === "marcas"
                          ? "bg-brand-mauve-300 text-white"
                          : "bg-white text-brand-neutral-700 hover:bg-brand-neutral-50"
                      }`}
                      onClick={() => setSearchType("marcas")}
                    >
                      Busco Marcas
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 text-center whitespace-nowrap ${
                        searchType === "showrooms"
                          ? "bg-brand-mauve-300 text-white"
                          : "bg-white text-brand-neutral-700 hover:bg-brand-neutral-50"
                      }`}
                      onClick={() => setSearchType("showrooms")}
                    >
                      Busco Showrooms
                    </button>
                  </div>
                </div>

                {/* Campos de búsqueda */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:space-x-3 space-y-4 md:space-y-0">
                  {/* Campo de ubicación con autocompletado */}
                  <div className="flex-1 relative" ref={autocompleteRef}>
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ubicación (ciudad, país...)"
                        className="w-full px-4 py-2 border border-brand-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-mauve-300 focus:border-brand-mauve-300 shadow-sm"
                        value={location}
                        onChange={handleLocationChange}
                        onFocus={handleLocationFocus}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                      />
                      {/* Icono indicador de que hay un desplegable */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg 
                          className="h-5 w-5 text-brand-neutral-400" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor" 
                          aria-hidden="true"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Lista de sugerencias de autocompletado - diseño mejorado */}
                    {showSuggestions && filteredLocations.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-brand-neutral-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredLocations.map((loc, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-brand-mauve-50 cursor-pointer text-brand-neutral-700"
                            onClick={() => handleSelectLocation(loc)}
                          >
                            <div className="flex items-center">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 mr-2 text-brand-mauve-400" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {loc}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Dropdown de estilos */}
                  <div className="flex-1">
                    <select
                      className="w-full px-4 py-2 border border-brand-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-mauve-300 focus:border-brand-mauve-300 appearance-none bg-white shadow-sm"
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
                      className="w-full md:w-auto px-6 py-2 bg-brand-celeste-300 hover:bg-brand-celeste-400 text-brand-neutral-900 font-medium rounded-lg transition-colors shadow-md"
                    >
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Indicadores con diseño moderno */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 mt-10 text-white">
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2 drop-shadow-md">500+</div>
              <div className="text-white drop-shadow-md">Showrooms</div>
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2 drop-shadow-md">1,200+</div>
              <div className="text-white drop-shadow-md">Marcas</div>
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2 drop-shadow-md">30+</div>
              <div className="text-white drop-shadow-md">Ciudades</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botón "Descubrir más" */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center z-10">
        <button 
          onClick={scrollToHowItWorks}
          className="text-white flex flex-col items-center transition-transform hover:translate-y-1 animate-bounce"
          aria-label="Descubrir más"
        >
          <span className="mb-2 text-sm font-medium">Descubrir más</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Hero;