"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userType, setUserType] = useState("marca"); // "marca" o "showroom"
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Variable para determinar si el usuario está autenticado
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  // Detectar scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Marcar cuando termina la carga inicial
  useEffect(() => {
    if (status !== 'loading') {
      setInitialLoadComplete(true);
    }
  }, [status]);

  // Efecto para obtener mensajes no leídos (simulado para el MVP)
  useEffect(() => {
    if (isAuthenticated) {
      // Este sería reemplazado por una llamada a la API real
      // que obtendría los mensajes no leídos desde MongoDB
      const fakeUnreadCount = Math.floor(Math.random() * 5);
      setUnreadMessages(fakeUnreadCount);
      
      // Simulación de notificaciones no leídas
      const fakeNotificationsCount = Math.floor(Math.random() * 3);
      setUnreadNotifications(fakeNotificationsCount);
    }
  }, [isAuthenticated]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Depuración de sesión con información más detallada
  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Navbar - Usuario autenticado:', {
        name: session?.user?.name,
        email: session?.user?.email,
        tipo_usuario: session?.user?.tipo_usuario,
        userDetails: session?.user?.userDetails
      });
    } else if (status === 'loading') {
      console.log('Navbar - Cargando sesión...');
    } else {
      console.log('Navbar - Usuario no autenticado');
    }
  }, [status, session]);

  // Función para manejar el inicio de sesión
  const handleSignIn = async () => {
    toggleLoginModal();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      });
      
      if (result?.error) {
        console.error('Error de inicio de sesión:', result.error);
      } else {
        router.push('/auth-redirect');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  // Función para manejar el cierre de sesión
  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut({ redirect: false });
    router.push('/');
  };

  // Determinar el tipo de usuario y el texto a mostrar
  const getUserTypeText = () => {
    if (!session?.user) return "";
    
    return session.user.tipo_usuario === "marca" 
      ? "Marca" 
      : "Showroom";
  };

  // Obtener la URL de la imagen de perfil o iniciales si no hay imagen
  const getProfileImage = () => {
    if (!session?.user) return null;
    
    if (session.user.image) {
      return (
        <Image
          src={session.user.image}
          alt="Foto de perfil"
          width={32}
          height={32}
          className="rounded-full"
        />
      );
    } else {
      // Iniciales del usuario
      const initials = session.user.name
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : session.user.email.substring(0, 2).toUpperCase();
      
      return (
        <div className="w-8 h-8 rounded-full bg-brand-mauve-200 flex items-center justify-center">
          <span className="text-xs font-medium text-brand-mauve-800">
            {initials}
          </span>
        </div>
      );
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white shadow-sm border-b border-brand-neutral-100" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="block">
              <div className="h-14 flex items-center">
                <span className={`font-handwritten text-3xl font-bold ${
                  scrolled ? "text-brand-mauve-700" : "text-white"
                } transition-colors duration-300`}>
                  The Showroom App
                </span>
              </div>
            </Link>
          </div>

          {/* Enlaces de navegación centrados - Visibles en desktop */}
          <div className="hidden sm:flex sm:items-center sm:justify-center flex-1">
            <div className="flex space-x-10 justify-center">
              {/* Dropdown Marcas */}
              <div className="relative group flex items-center">
                <button className={`inline-flex items-center px-2 py-2 text-base font-medium ${
                  scrolled 
                    ? "text-brand-neutral-800 hover:text-brand-mauve-600" 
                    : "text-white hover:text-brand-neutral-200"
                } transition-colors`}>
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
                <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-brand-neutral-200">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href="/marcas/casual"
                      className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-mauve-600"
                      role="menuitem"
                    >
                      Casual
                    </Link>
                    <Link
                      href="/marcas/urbano"
                      className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-mauve-600"
                      role="menuitem"
                    >
                      Urbano
                    </Link>
                    <Link
                      href="/marcas/formal"
                      className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-mauve-600"
                      role="menuitem"
                    >
                      Formal
                    </Link>
                    <Link
                      href="/marcas/streetwear"
                      className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-mauve-600"
                      role="menuitem"
                    >
                      Streetwear
                    </Link>
                    <Link
                      href="/marcas/sostenible"
                      className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-mauve-600"
                      role="menuitem"
                    >
                      Sostenible
                    </Link>
                    <Link
                      href="/marcas"
                      className="block px-4 py-2 text-sm font-medium text-brand-mauve-600 hover:bg-brand-neutral-50"
                      role="menuitem"
                    >
                      Ver todas
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dropdown Showrooms */}
              <div className="relative group flex items-center">
                <button className={`inline-flex items-center px-2 py-2 text-base font-medium ${
                  scrolled 
                    ? "text-brand-neutral-800 hover:text-brand-mauve-600" 
                    : "text-white hover:text-brand-neutral-200"
                } transition-colors`}>
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
                <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-brand-neutral-200">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href="/showrooms/filtrar?ubicacion=madrid"
                      className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-mauve-600"
                      role="menuitem"
                    >
                      Madrid
                    </Link>
                    <Link
                      href="/showrooms/filtrar?ubicacion=barcelona"
                      className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-mauve-600"
                      role="menuitem"
                    >
                      Barcelona
                    </Link>
                    <Link
                      href="/showrooms/filtrar?capacidad=pequeño"
                      className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-mauve-600"
                      role="menuitem"
                    >
                      Pequeños (1-5 marcas)
                    </Link>
                    <Link
                      href="/showrooms/filtrar?capacidad=grande"
                      className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-mauve-600"
                      role="menuitem"
                    >
                      Grandes (6+ marcas)
                    </Link>
                    <Link
                      href="/showrooms"
                      className="block px-4 py-2 text-sm font-medium text-brand-mauve-600 hover:bg-brand-neutral-50"
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
                className={`inline-flex items-center px-2 py-2 text-base font-medium ${
                  scrolled 
                    ? "text-brand-neutral-800 hover:text-brand-mauve-600" 
                    : "text-white hover:text-brand-neutral-200"
                } transition-colors`}
              >
                Cómo funciona
              </Link>
            </div>
          </div>

          {/* Botones de autenticación o menú de usuario */}
          <div className="hidden sm:flex sm:items-center space-x-2">
            {isLoading || !initialLoadComplete ? (
              // Mostrar un placeholder de carga
              <div className="w-8 h-8 rounded-full bg-brand-neutral-200 animate-pulse"></div>
            ) : isAuthenticated ? (
              // Si el usuario está autenticado, mostrar opciones de usuario
              <>
                {/* Botón de mensajes */}
                <Link
                  href="/mensajes"
                  className={`p-2 rounded-full relative ${
                    scrolled ? "text-brand-neutral-700 hover:bg-brand-neutral-100" : "text-white hover:bg-white/10"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  
                  {/* Indicador de mensajes no leídos */}
                  {unreadMessages > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 text-white">
                      {unreadMessages}
                    </span>
                  )}
                </Link>

                {/* Botón de notificaciones */}
                <Link
                  href="/notificaciones"
                  className={`p-2 rounded-full relative ${
                    scrolled ? "text-brand-neutral-700 hover:bg-brand-neutral-100" : "text-white hover:bg-white/10"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  
                  {/* Indicador de notificaciones no leídas */}
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* Menú de usuario */}
                <div className="relative user-menu-container">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center focus:outline-none"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="flex items-center">
                      {getProfileImage()}
                      <span className={`ml-2 ${
                        scrolled ? "text-brand-neutral-800" : "text-white"
                      }`}>
                        {session.user.name?.split(' ')[0] || session.user.email.split('@')[0]}
                      </span>
                      <svg className={`ml-1 h-4 w-4 ${
                        scrolled ? "text-brand-neutral-600" : "text-white"
                      }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                      {/* Tipo de usuario */}
                      <div className="px-4 py-2 text-xs text-brand-neutral-500 border-b border-brand-neutral-200">
                        {getUserTypeText()}
                      </div>
                      
                      {/* Enlaces de usuario */}
                      <Link
                        href={`/dashboard/${session.user.tipo_usuario || 'marca'}`}
                        className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-100"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/perfil"
                        className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-100"
                      >
                        Mi perfil
                      </Link>
                      <Link
                        href="/mensajes"
                        className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-100"
                      >
                        Mensajes 
                        {unreadMessages > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                            {unreadMessages}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/configuracion"
                        className="block px-4 py-2 text-sm text-brand-neutral-700 hover:bg-brand-neutral-100"
                      >
                        Configuración
                      </Link>
                      <div className="border-t border-brand-neutral-200"></div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Si el usuario no está autenticado, mostrar botón de inicio de sesión
              <button
                onClick={toggleLoginModal}
                className={`btn ${
                  scrolled 
                    ? "btn-primary text-white" 
                    : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                } shadow-sm hover:shadow-md transition-all`}
              >
                Iniciar sesión / Registrarse
              </button>
            )}
          </div>

          {/* Botón de menú móvil */}
          <div className="flex items-center sm:hidden">
            {isAuthenticated ? (
              // Icono de usuario para móvil (cuando autenticado)
              <button
                onClick={toggleMobileMenu}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  scrolled 
                    ? "text-brand-neutral-700 hover:text-brand-mauve-600 hover:bg-brand-neutral-50" 
                    : "text-white hover:text-brand-neutral-200 hover:bg-white/10"
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-mauve-300 transition-colors`}
              >
                <span className="sr-only">Abrir menú de usuario</span>
                <div className="relative">
                  {getProfileImage()}
                  {/* Indicador combinado de notificaciones para móvil */}
                  {(unreadMessages + unreadNotifications) > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold rounded-full bg-red-500 text-white">
                      {unreadMessages + unreadNotifications}
                    </span>
                  )}
                </div>
              </button>
            ) : (
              // Icono de menú hamburguesa (cuando no autenticado)
              <button
                onClick={toggleMobileMenu}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  scrolled 
                    ? "text-brand-neutral-700 hover:text-brand-mauve-600 hover:bg-brand-neutral-50" 
                    : "text-white hover:text-brand-neutral-200 hover:bg-white/10"
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-mauve-300 transition-colors`}
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
            )}
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} sm:hidden bg-white border-t border-brand-neutral-100`}>
        {isAuthenticated ? (
          // Menú móvil para usuarios autenticados
          <div className="pt-2 pb-3 space-y-1">
            {/* Info de usuario */}
            <div className="px-4 py-3 border-b border-brand-neutral-200">
              <div className="flex items-center">
                {getProfileImage()}
                <div className="ml-3">
                  <div className="text-base font-medium text-brand-neutral-800">
                    {session.user.name || session.user.email.split('@')[0]}
                  </div>
                  <div className="text-sm font-medium text-brand-neutral-500">
                    {session.user.email}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enlaces de navegación */}
            <Link
              href={`/dashboard/${session.user.tipo_usuario || 'marca'}`}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-brand-neutral-700 hover:text-brand-neutral-800 hover:bg-brand-neutral-50 hover:border-brand-mauve-300"
            >
              Dashboard
            </Link>
            <Link
              href="/mensajes"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-brand-neutral-700 hover:text-brand-neutral-800 hover:bg-brand-neutral-50 hover:border-brand-mauve-300 flex justify-between items-center"
            >
              <span>Mensajes</span>
              {unreadMessages > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                  {unreadMessages}
                </span>
              )}
            </Link>
            <Link
              href="/notificaciones"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-brand-neutral-700 hover:text-brand-neutral-800 hover:bg-brand-neutral-50 hover:border-brand-mauve-300 flex justify-between items-center"
            >
              <span>Notificaciones</span>
              {unreadNotifications > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </Link>
            <Link
              href="/perfil"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-brand-neutral-700 hover:text-brand-neutral-800 hover:bg-brand-neutral-50 hover:border-brand-mauve-300"
            >
              Mi perfil
            </Link>
            <Link
              href="/marcas"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-brand-neutral-700 hover:text-brand-neutral-800 hover:bg-brand-neutral-50 hover:border-brand-mauve-300"
            >
              Marcas
            </Link>
            <Link
              href="/showrooms"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-brand-neutral-700 hover:text-brand-neutral-800 hover:bg-brand-neutral-50 hover:border-brand-mauve-300"
            >
              Showrooms
            </Link>
            <Link
              href="/configuracion"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-brand-neutral-700 hover:text-brand-neutral-800 hover:bg-brand-neutral-50 hover:border-brand-mauve-300"
            >
              Configuración
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-red-300 text-base font-medium text-red-700 bg-red-50"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          // Menú móvil para usuarios no autenticados
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/marcas"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-brand-neutral-700 hover:text-brand-neutral-800 hover:bg-brand-neutral-50 hover:border-brand-mauve-300"
            >
              Marcas
            </Link>
            <Link
              href="/showrooms"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-brand-neutral-700 hover:text-brand-neutral-800 hover:bg-brand-neutral-50 hover:border-brand-mauve-300"
            >
              Showrooms
            </Link>
            <Link
              href="/como-funciona"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-brand-neutral-700 hover:text-brand-neutral-800 hover:bg-brand-neutral-50 hover:border-brand-mauve-300"
            >
              Cómo funciona
            </Link>
            <button
              onClick={toggleLoginModal}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-brand-mauve-300 text-base font-medium text-brand-mauve-700 bg-brand-mauve-50"
            >
              Iniciar sesión / Registrarse
            </button>
          </div>
        )}
      </div>

      {/* Modal de Login */}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-brand-neutral-950 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-xl">
            {/* Botón de cerrar */}
            <button
              onClick={toggleLoginModal}
              className="absolute top-3 right-3 text-brand-neutral-500 hover:text-brand-neutral-700"
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
            <h2 className="text-3xl font-bold text-center mb-6 font-handwritten text-brand-mauve-700">
              Iniciar sesión / Registrarse
            </h2>

            {/* Selector de tipo de usuario */}
            <div className="flex border border-brand-neutral-200 rounded-lg mb-6 overflow-hidden">
              <button
                className={`flex-1 py-2 text-center ${
                  userType === "marca"
                    ? "bg-brand-mauve-300 text-white"
                    : "bg-white text-brand-neutral-700 hover:bg-brand-neutral-50"
                }`}
                onClick={() => setUserType("marca")}
              >
                Soy una marca
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  userType === "showroom"
                    ? "bg-brand-mauve-300 text-white"
                    : "bg-white text-brand-neutral-700 hover:bg-brand-neutral-50"
                }`}
                onClick={() => setUserType("showroom")}
              >
                Tengo un showroom
              </button>
            </div>

            {/* Formulario de inicio de sesión */}
            <div className="mb-6">
              <form>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-brand-neutral-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-3 py-2 border border-brand-neutral-300 rounded-md"
                    placeholder="Tu contraseña"
                  />
                </div>
              </form>
            </div>

            {/* Opciones de autenticación */}
            <div className="space-y-4">
              <button
                onClick={handleSignIn}
                className="w-full py-2 px-4 bg-brand-mauve-600 text-white rounded-md hover:bg-brand-mauve-700 focus:outline-none focus:ring-2 focus:ring-brand-mauve-500 focus:ring-offset-2"
              >
                Iniciar sesión
              </button>
              
              <button
                onClick={() => {
                  toggleLoginModal();
                  signIn('google', { callbackUrl: `/onboarding?userType=${userType}` });
                }}
                className="w-full flex items-center justify-center py-2 px-4 border border-brand-neutral-300 rounded-md shadow-sm bg-white text-brand-neutral-700 hover:bg-brand-neutral-50"
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
              
              <div className="text-center">
                <button
                  onClick={() => {
                    toggleLoginModal();
                    router.push(`/registro?tipo=${userType}`);
                  }}
                  className="text-brand-mauve-600 hover:text-brand-mauve-700"
                >
                  ¿No tienes cuenta? Regístrate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;