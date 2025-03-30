"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userType, setUserType] = useState("marca"); // "marca" o "showroom"

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
  };

  return (
    <nav className="bg-brand-beige-200 sticky top-0 z-50 border-b-2 border-brand-teal-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo y enlaces principales */}
          <div className="flex items-center">
            {/* Logo - Aumentado de tamaño */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="block">
                {/* Logo de The Showroom App */}
                <div className="h-14 flex items-center">
                  <Image 
                    src="/images/logo.png" 
                    alt="The Showroom App" 
                    width={56} 
                    height={56} 
                    className="mr-3"
                  />
                  <span className="font-handwritten text-3xl font-bold text-brand-teal-700">The Showroom App</span>
                </div>
              </Link>
            </div>

            {/* Enlaces de navegación - Visibles en desktop */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {/* Dropdown Marcas */}
              <div className="relative group flex items-center">
                <button className="inline-flex items-center px-2 py-2 text-base font-medium text-neutral-900 hover:text-brand-teal-700 transition-colors">
                  Marcas
                  <svg
                    className="ml-1 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown content */}
                <div className="absolute left-0 mt-40 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-300 z-50 border-2 border-brand-teal-500">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href="/marcas/casual"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Casual
                    </Link>
                    <Link
                      href="/marcas/urbano"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Urbano
                    </Link>
                    <Link
                      href="/marcas/formal"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Formal
                    </Link>
                    <Link
                      href="/marcas/streetwear"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Streetwear
                    </Link>
                    <Link
                      href="/marcas/sostenible"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Sostenible
                    </Link>
                    <Link
                      href="/marcas"
                      className="block px-4 py-2 text-sm font-medium text-brand-teal-600 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Ver todas
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dropdown Showrooms */}
              <div className="relative group flex items-center">
                <button className="inline-flex items-center px-2 py-2 text-base font-medium text-neutral-900 hover:text-brand-teal-700 transition-colors">
                  Showrooms
                  <svg
                    className="ml-1 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown content */}
                <div className="absolute left-0 mt-40 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-300 z-50 border-2 border-brand-teal-500">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href="/showrooms/filtrar?ubicacion=madrid"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Madrid
                    </Link>
                    <Link
                      href="/showrooms/filtrar?ubicacion=barcelona"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Barcelona
                    </Link>
                    <Link
                      href="/showrooms/filtrar?capacidad=pequeño"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Pequeños (1-5 marcas)
                    </Link>
                    <Link
                      href="/showrooms/filtrar?capacidad=grande"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Grandes (6+ marcas)
                    </Link>
                    <Link
                      href="/showrooms"
                      className="block px-4 py-2 text-sm font-medium text-brand-teal-600 hover:bg-brand-beige-100"
                      role="menuitem"
                    >
                      Ver todos
                    </Link>
                  </div>
                </div>
              </div>

              {/* Enlace Cómo Funciona */}
              <Link
                href="/como-funciona"
                className="inline-flex items-center px-2 py-2 text-base font-medium text-neutral-900 hover:text-brand-teal-700 transition-colors"
              >
                Cómo funciona
              </Link>
            </div>
          </div>

          {/* Botón de autenticación */}
          <div className="hidden sm:flex sm:items-center">
            <button
              onClick={toggleLoginModal}
              className="btn btn-primary text-white shadow-md hover:shadow-lg"
            >
              Iniciar sesión / Registrarse
            </button>
          </div>

          {/* Botón de menú móvil */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-brand-teal-700 hover:bg-brand-beige-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-teal-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Icono menú hamburguesa */}
              <svg
                className={`${mobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icono cerrar */}
              <svg
                className={`${mobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} sm:hidden bg-brand-beige-200`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/marcas"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-brand-beige-100 hover:border-brand-teal-300"
          >
            Marcas
          </Link>
          <Link
            href="/showrooms"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-brand-beige-100 hover:border-brand-teal-300"
          >
            Showrooms
          </Link>
          <Link
            href="/como-funciona"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-brand-beige-100 hover:border-brand-teal-300"
          >
            Cómo funciona
          </Link>
          <button
            onClick={toggleLoginModal}
            className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-brand-teal-500 text-base font-medium text-brand-teal-700 bg-brand-teal-50"
          >
            Iniciar sesión / Registrarse
          </button>
        </div>
      </div>

      {/* Modal de Login */}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-beige-50 rounded-lg max-w-md w-full p-6 relative border-2 border-brand-teal-500">
            {/* Botón de cerrar */}
            <button
              onClick={toggleLoginModal}
              className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Título del modal */}
            <h2 className="text-3xl font-bold text-center mb-6 font-handwritten text-brand-teal-700">
              Iniciar sesión / Registrarse
            </h2>

            {/* Selector de tipo de usuario */}
            <div className="flex border border-neutral-300 rounded-lg mb-6 overflow-hidden">
              <button
                className={`flex-1 py-2 text-center ${
                  userType === "marca"
                    ? "bg-brand-teal-600 text-white"
                    : "bg-white text-neutral-700 hover:bg-brand-beige-100"
                }`}
                onClick={() => setUserType("marca")}
              >
                Soy una marca
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  userType === "showroom"
                    ? "bg-brand-teal-600 text-white"
                    : "bg-white text-neutral-700 hover:bg-brand-beige-100"
                }`}
                onClick={() => setUserType("showroom")}
              >
                Tengo un showroom
              </button>
            </div>

            {/* Formulario de login */}
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-teal-500 focus:border-brand-teal-500"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-teal-500 focus:border-brand-teal-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brand-teal-600 focus:ring-brand-teal-500 border-neutral-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-neutral-700"
                  >
                    Recordarme
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-brand-teal-600 hover:text-brand-teal-500"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full btn btn-primary py-2 px-4 text-white bg-brand-teal-600 hover:bg-brand-teal-700"
                >
                  Iniciar sesión
                </button>
              </div>
              <div className="text-center">
                <span className="text-sm text-neutral-700">o</span>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full flex items-center justify-center btn btn-outline py-2 px-4"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continuar con Google
                </button>
              </div>
              <div className="text-center text-sm">
                <span className="text-neutral-700">
                  ¿No tienes una cuenta?{" "}
                </span>
                <a
                  href="#"
                  className="font-medium text-brand-teal-600 hover:text-brand-teal-500"
                >
                  Regístrate
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;