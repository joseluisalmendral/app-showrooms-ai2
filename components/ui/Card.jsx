"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * Componente Card reutilizable con la nueva paleta Nord
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la tarjeta
 * @param {string} props.description - Descripción o contenido de la tarjeta
 * @param {string} props.imageUrl - URL de la imagen (opcional)
 * @param {string} props.linkUrl - URL del enlace (opcional)
 * @param {string} props.linkText - Texto del enlace (opcional)
 * @param {React.ReactNode} props.children - Contenido adicional
 * @param {string} props.className - Clases adicionales
 * @param {string} props.badge - Texto para la insignia (opcional)
 * @param {string} props.badgeColor - Color de la insignia (opcional: "blue", "teal", "purple", etc.)
 * @param {boolean} props.elevated - Si la tarjeta debe tener elevación adicional
 */
const Card = ({
  title,
  description,
  imageUrl,
  linkUrl,
  linkText = "Ver más",
  children,
  className = "",
  badge,
  badgeColor = "blue",
  elevated = false,
}) => {
  // Determinar las clases de la insignia según el color
  const getBadgeClasses = () => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full absolute top-4 right-4 z-10";
    
    switch (badgeColor) {
      case "blue":
        return `${baseClasses} bg-accent-blue bg-opacity-90 text-nord-white`;
      case "teal":
        return `${baseClasses} bg-accent-teal bg-opacity-90 text-nord-gunmetal`;
      case "purple":
        return `${baseClasses} bg-accent-purple bg-opacity-90 text-nord-white`;
      case "orange":
        return `${baseClasses} bg-accent-orange bg-opacity-90 text-nord-gunmetal`;
      case "red":
        return `${baseClasses} bg-accent-red bg-opacity-90 text-nord-white`;
      case "yellow":
        return `${baseClasses} bg-accent-yellow bg-opacity-90 text-nord-gunmetal`;
      case "green":
        return `${baseClasses} bg-accent-green bg-opacity-90 text-nord-gunmetal`;
      default:
        return `${baseClasses} bg-nord-payne bg-opacity-90 text-nord-white`;
    }
  };

  return (
    <div 
      className={`bg-nord-white rounded-xl overflow-hidden border border-nord-lavender transition-all ${
        elevated 
          ? "shadow-md hover:shadow-xl" 
          : "shadow-sm hover:shadow-md"
      } ${className}`}
    >
      {/* Imagen (si se proporciona) */}
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title || "Card image"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
          />
          
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-nord-gunmetal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      {/* Badge (si se proporciona) */}
      {badge && (
        <span className={getBadgeClasses()}>
          {badge}
        </span>
      )}
      
      {/* Contenido */}
      <div className="p-6">
        {title && (
          <h3 className="text-xl font-semibold mb-2 text-nord-gunmetal group-hover:text-accent-blue transition-colors">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="text-nord-payne mb-4 text-sm">
            {description}
          </p>
        )}
        
        {/* Contenido adicional */}
        {children}
        
        {/* Enlace (si se proporciona) */}
        {linkUrl && (
          <div className="mt-4">
            <Link
              href={linkUrl}
              className="inline-flex items-center text-accent-blue hover:text-accent-teal transition-colors font-medium text-sm"
            >
              {linkText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;