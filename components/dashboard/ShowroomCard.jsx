'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PlaceholderImage from "@/components/ui/PlaceholderImage";

const ShowroomCard = ({ showroom }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Determinar el color de fondo del indicador de match según el porcentaje
  const getMatchBgColor = (matchPercent) => {
    if (matchPercent >= 90) return 'bg-green-100 text-green-800';
    if (matchPercent >= 75) return 'bg-brand-celeste-100 text-brand-celeste-800';
    return 'bg-brand-neutral-100 text-brand-neutral-800';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-brand-neutral-200 hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex items-center p-4">
        {/* Imagen del showroom */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <PlaceholderImage 
            src={showroom.image}
            alt={showroom.name}
            fill={true}
            className="object-cover"
            placeholderType="showroom"
          />
        </div>
        
        {/* Información básica */}
        <div className="ml-4 flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-brand-neutral-900 truncate">{showroom.name}</h3>
              <p className="text-sm text-brand-neutral-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {showroom.location}
              </p>
            </div>
            
            {/* Indicador de compatibilidad */}
            <div className={`ml-2 py-1 px-2 rounded-full text-xs font-medium ${getMatchBgColor(showroom.match)}`}>
              {showroom.match}% match
            </div>
          </div>
          
          {/* Calificación y precio */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm text-brand-neutral-700">{showroom.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-brand-neutral-700">{showroom.priceRange}</span>
          </div>
        </div>
        
        {/* Botón para expandir/colapsar */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-brand-neutral-400 hover:text-brand-neutral-600 transition-colors"
          aria-label={expanded ? "Ver menos" : "Ver más"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* Detalles expandibles */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-brand-neutral-100 pt-3">
          <div className="flex justify-between mb-4">
            <Link
              href={`/showrooms/${showroom.id}`}
              className="text-sm text-brand-mauve-600 hover:text-brand-mauve-700 font-medium flex items-center"
            >
              Ver detalles
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </Link>
            
            <Link
              href={`/mensajes/nuevo?showroom=${showroom.id}`}
              className="text-sm text-brand-celeste-600 hover:text-brand-celeste-700 font-medium flex items-center"
            >
              Contactar
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowroomCard;