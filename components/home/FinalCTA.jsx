"use client";

import { useRef } from "react";
import Link from "next/link";

const FinalCTA = () => {
  const sectionRef = useRef(null);

  return (
    <section 
      ref={sectionRef}
      className="py-20 relative overflow-hidden bg-brand-mauve-700"
    >
      {/* Fondo simplificado sin exceso de elementos decorativos */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            ¿Listo para potenciar tu marca o espacio?
          </h2>
          <p className="text-lg text-white mb-10 max-w-2xl mx-auto">
            Únete a nuestra comunidad de marcas y showrooms innovadores. Descubre nuevas oportunidades, amplía tu red y lleva tu negocio al siguiente nivel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/registro?tipo=marca"
              className="btn py-3 px-8 bg-white text-brand-mauve-800 hover:bg-brand-neutral-50 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Soy una marca
            </Link>
            <Link
              href="/registro?tipo=showroom"
              className="btn py-3 px-8 bg-brand-neutral-100 text-brand-neutral-900 hover:bg-brand-neutral-200 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Tengo un showroom
            </Link>
          </div>
          
          <div className="mt-10 text-white flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Registro gratuito</span>
            </div>
            <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Sin comisiones ocultas</span>
            </div>
            <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>Comunidad en crecimiento</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS para el patrón de cuadrícula */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </section>
  );
};

export default FinalCTA;