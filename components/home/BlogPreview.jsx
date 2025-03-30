"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Datos de ejemplo para los artículos del blog
const BLOG_POSTS = [
  {
    id: "post1",
    title: "10 Tendencias en moda sostenible para este año",
    slug: "tendencias-moda-sostenible",
    excerpt: "Descubre cómo la industria de la moda está evolucionando hacia prácticas más sostenibles y cómo las marcas están adaptándose a estas nuevas exigencias del mercado.",
    category: "Tendencias",
    image: "/images/blog-1.jpg", // Placeholder
    date: "12 Mar 2025",
    author: "María González"
  },
  {
    id: "post2",
    title: "Cómo elegir el showroom perfecto para tu marca",
    slug: "elegir-showroom-perfecto",
    excerpt: "Una guía completa para que las marcas emergentes puedan identificar y seleccionar los espacios que mejor se adapten a su identidad y objetivos comerciales.",
    category: "Consejos",
    image: "/images/blog-2.jpg", // Placeholder
    date: "28 Feb 2025",
    author: "Carlos Martínez"
  },
  {
    id: "post3",
    title: "Fashion Week: Oportunidades para marcas independientes",
    slug: "fashion-week-marcas-independientes",
    excerpt: "Analizamos cómo los eventos de moda de gran escala están abriendo sus puertas a marcas independientes y el impacto que esto tiene en la visibilidad y el crecimiento.",
    category: "Eventos",
    image: "/images/blog-3.jpg", // Placeholder
    date: "15 Feb 2025",
    author: "Laura Sánchez"
  }
];

// Mapa de colores para categorías - actualizado con la nueva paleta
const CATEGORY_COLORS = {
  "Tendencias": "bg-brand-mauve-100 text-brand-mauve-800",
  "Consejos": "bg-brand-neutral-100 text-brand-neutral-800",
  "Eventos": "bg-yellow-100 text-yellow-800",
  "Industria": "bg-emerald-100 text-emerald-800",
  "Entrevistas": "bg-indigo-100 text-indigo-800"
};

const BlogPreview = () => {
  const sectionRef = useRef(null);

  return (
    <section className="py-20 relative bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-neutral-900 mb-4 text-center">
          Tendencias y novedades
        </h2>
        <p className="text-lg text-brand-neutral-600 mb-12 text-center max-w-3xl mx-auto">
          Explora nuestros artículos más recientes sobre las últimas tendencias, consejos prácticos y eventos de la industria de la moda.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <article 
              key={post.id} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-brand-neutral-200 group transform hover:translate-y-[-8px] duration-300"
              style={{ 
                transitionDelay: `${index * 100}ms`,
                opacity: 0,
                animation: `fadeIn 0.5s ease-out ${index * 0.2}s forwards`
              }}
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-48 w-full overflow-hidden">
                  {/* Placeholder para la imagen */}
                  <div className="absolute inset-0 bg-brand-neutral-200 flex items-center justify-center group-hover:opacity-90 transition-opacity">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-brand-neutral-400 group-hover:text-brand-neutral-500 transition-colors"
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
                  </div>
                  {/* Aquí iría la imagen real si estuviera disponible */}
                  {/* <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  /> */}
                </div>
              </Link>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || "bg-brand-neutral-100 text-brand-neutral-800"}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-brand-neutral-500">{post.date}</span>
                </div>
                
                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="text-xl font-bold mb-3 text-brand-neutral-900 group-hover:text-brand-mauve-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-brand-neutral-600 text-sm mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-brand-neutral-200 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-brand-neutral-600">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm text-brand-neutral-600">
                      {post.author}
                    </span>
                  </div>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-brand-mauve-600 hover:text-brand-mauve-700 font-medium text-sm flex items-center"
                  >
                    Leer más
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
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="btn btn-outline py-2 px-6 hover:bg-brand-neutral-50 transform transition-transform hover:scale-105 duration-300"
          >
            Visitar el blog
          </Link>
        </div>
      </div>

      {/* CSS para la animación de aparición de las tarjetas */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default BlogPreview;