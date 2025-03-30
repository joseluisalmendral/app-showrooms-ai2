"use client";

import { useEffect, useState, useRef } from "react";

// Datos de ejemplo para las estadísticas
const STATS_DATA = [
  {
    id: 1,
    label: "Conexiones exitosas",
    value: 2500,
    suffix: "+",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 2,
    label: "Tasa de ocupación promedio",
    value: 85,
    suffix: "%",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 3,
    label: "Ciudades activas",
    value: 32,
    suffix: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 4,
    label: "Satisfacción media",
    value: 4.8,
    suffix: "/5",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
];

const PlatformStats = () => {
  const [counters, setCounters] = useState(STATS_DATA.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  // Función para animar contadores
  const animateValue = (start, end, duration, index) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      let value;
      if (Number.isInteger(end)) {
        value = Math.floor(progress * (end - start) + start);
      } else {
        // Para números decimales (como 4.8)
        value = (progress * (end - start) + start).toFixed(1);
      }
      
      setCounters(prevCounters => {
        const newCounters = [...prevCounters];
        newCounters[index] = value;
        return newCounters;
      });
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // Comprueba si el elemento está visible y activa la animación
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          STATS_DATA.forEach((stat, index) => {
            const startValue = 0;
            const endValue = stat.value;
            const duration = 2000; // Duración de la animación en ms
            animateValue(startValue, endValue, duration, index);
          });
          setHasAnimated(true);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-white border-t border-b border-neutral-200"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-brand-teal-800 mb-14">
          Datos que respaldan nuestra plataforma
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {STATS_DATA.map((stat, index) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 w-14 h-14 bg-brand-teal-50 rounded-full flex items-center justify-center border border-brand-teal-100">
                <div className="text-brand-teal-600">
                  {stat.icon}
                </div>
              </div>
              
              <div className="mb-2">
                <span className="text-4xl font-bold text-brand-teal-700">
                  {counters[index]}
                </span>
                <span className="text-2xl font-medium text-brand-teal-700 ml-1">
                  {stat.suffix}
                </span>
              </div>
              
              <div className="text-neutral-700 text-lg">
                {stat.label}
              </div>
              
              {/* Línea decorativa sutil */}
              <div className="mt-4 w-12 h-1 bg-brand-teal-200 rounded-full"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <p className="text-neutral-600 leading-relaxed">
            Estas cifras reflejan el crecimiento y éxito continuo de nuestra plataforma, 
            garantizando una experiencia fiable y profesional tanto para marcas como para showrooms.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;