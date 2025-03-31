'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PlaceholderImage from "@/components/ui/PlaceholderImage";

const BrandCard = ({ brand }) => {
  // Determinar el color de fondo del indicador de match según el porcentaje
  const getMatchBgColor = (matchPercent) => {
    if (matchPercent >= 90) return 'bg-green-100 text-green-800';
    if (matchPercent >= 75) return 'bg-brand-celeste-100 text-brand-celeste-800';
    return 'bg-brand-neutral-100 text-brand-neutral-800';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-brand-neutral-200 p-4 hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        {/* Logo de la marca */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <PlaceholderImage 
            src={brand.logo}
            alt={brand.name}
            fill={true}
            className="object-cover"
            placeholderType="brand"
          />
        </div>
        
        {/* Indicador de compatibilidad */}
        <div className={`py-1 px-2 rounded-full text-xs font-medium ${getMatchBgColor(brand.match)}`}>
          {brand.match}% match
        </div>
      </div>
      
      {/* Nombre de la marca */}
      <h3 className="text-lg font-medium text-brand-neutral-900 mb-1">{brand.name}</h3>
      
      {/* Desde */}
      <p className="text-xs text-brand-neutral-500 mb-3">
        Desde {brand.since}
      </p>
      
      {/* Categorías */}
      <div className="flex flex-wrap gap-1 mb-3">
        {brand.categories.map((category, index) => (
          <span 
            key={index}
            className="px-2 py-0.5 bg-brand-neutral-100 text-brand-neutral-700 rounded-full text-xs"
          >
            {category}
          </span>
        ))}
      </div>
      
      {/* Botones de acción */}
      <div className="mt-auto pt-3 border-t border-brand-neutral-100 flex justify-between">
        <Link
          href={`/marcas/${brand.id}`}
          className="text-sm text-brand-mauve-600 hover:text-brand-mauve-700 font-medium flex items-center"
        >
          Ver perfil
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
          href={`/mensajes/nuevo?marca=${brand.id}`}
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
  );
};

export default BrandCard;