"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Componente para mostrar placeholders de imagen con fallback
 * @param {Object} props - Props del componente
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo
 * @param {string} props.className - Clases adicionales
 * @param {string} props.placeholderType - Tipo de placeholder (avatar, showroom, brand, blog)
 * @param {boolean} props.fill - Si la imagen debe llenar el contenedor
 * @param {number} props.width - Ancho de la imagen (si no se usa fill)
 * @param {number} props.height - Alto de la imagen (si no se usa fill)
 */
const PlaceholderImage = ({
  src,
  alt,
  className = "",
  placeholderType = "generic",
  fill = false,
  width,
  height,
  ...props
}) => {
  // Estado para manejar errores en la carga de imágenes
  const [error, setError] = useState(false);

  // Función para obtener el icono de placeholder según el tipo
  const getPlaceholderIcon = () => {
    switch (placeholderType) {
      case "avatar":
        return (
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
        );
      case "showroom":
        return (
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
      case "brand":
        return (
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
              d="M16 11a4 4 0 11-8 0 4 4 0 018 0zm-4-7a7 7 0 00-7 7h14a7 7 0 00-7-7zm-7 9h14v2a7 7 0 01-7 7 7 7 0 01-7-7v-2z"
            />
          </svg>
        );
      case "blog":
        return (
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
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        );
      default:
        return (
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
        );
    }
  };

  // Renderizar placeholder si hay error o no hay src
  if (error || !src) {
    return (
      <div
        className={`bg-neutral-200 flex items-center justify-center ${className}`}
        style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}
        {...props}
      >
        {getPlaceholderIcon()}
      </div>
    );
  }

  // Renderizar imagen con Next/Image
  return fill ? (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      onError={() => setError(true)}
      {...props}
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default PlaceholderImage;