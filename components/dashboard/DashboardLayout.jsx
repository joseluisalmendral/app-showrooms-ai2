'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const DashboardLayout = ({ children, type = 'marca', title = 'Dashboard' }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Comprobar si el usuario está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/iniciar-sesion');
    }
  }, [status, router]);
  
  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Comprobar al cargar
    checkIsMobile();
    
    // Comprobar al cambiar tamaño
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  // Cerrar sidebar en móvil al cambiar de ruta
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Comprobar qué ruta está activa
  const isActive = (path) => {
    return pathname.startsWith(path);
  };
  
  // Obtener enlaces según el tipo de usuario
  const getNavLinks = () => {
    if (type === 'marca') {
      return [
        { 
          name: 'Dashboard', 
          href: '/dashboard/marca', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          )
        },
        { 
          name: 'Showrooms', 
          href: '/showrooms', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          )
        },
        { 
          name: 'Colaboraciones', 
          href: '/colaboraciones', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          )
        },
        { 
          name: 'Mensajes', 
          href: '/mensajes', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          )
        },
        { 
          name: 'Estadísticas', 
          href: '/estadisticas/marca', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          )
        }
      ];
    } else {
      return [
        { 
          name: 'Dashboard', 
          href: '/dashboard/showroom', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          )
        },
        { 
          name: 'Disponibilidad', 
          href: '/disponibilidad', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          )
        },
        { 
          name: 'Marcas', 
          href: '/marcas', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          )
        },
        { 
          name: 'Solicitudes', 
          href: '/solicitudes', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          )
        },
        { 
          name: 'Mensajes', 
          href: '/mensajes', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          )
        },
        { 
          name: 'Estadísticas', 
          href: '/estadisticas/showroom', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          )
        }
      ];
    }
  };
  
  const navLinks = getNavLinks();
  
  // Enlaces de cuenta comunes para ambos tipos
  const accountLinks = [
    { 
      name: 'Mi perfil', 
      href: '/perfil', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Configuración', 
      href: '/configuracion', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];
  
  // Renderizar el dashboard solo si el usuario está autenticado
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mauve-700"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-brand-neutral-50">
      {/* Overlay para móvil */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-20 bg-brand-neutral-900 bg-opacity-50 transition-opacity lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-brand-neutral-200 transition duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-brand-neutral-200">
            <Link href={`/dashboard/${type}`} className="flex items-center">
              <div className="w-8 h-8 bg-brand-mauve-600 rounded-md flex items-center justify-center text-white font-bold">
                TS
              </div>
              <span className="ml-2 text-xl font-semibold text-brand-neutral-900">
                The Showroom
              </span>
            </Link>
          </div>
          
          {/* Enlaces de navegación */}
          <div className="flex-grow px-4 py-6 overflow-y-auto">
            <div className="mb-8">
              <h3 className="px-3 text-xs font-semibold text-brand-neutral-500 uppercase tracking-wider">
                Principal
              </h3>
              <nav className="mt-5 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                      isActive(link.href)
                        ? 'bg-brand-mauve-50 text-brand-mauve-700'
                        : 'text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-neutral-900'
                    }`}
                  >
                    <span className={`mr-3 ${
                      isActive(link.href)
                        ? 'text-brand-mauve-500'
                        : 'text-brand-neutral-500 group-hover:text-brand-neutral-500'
                    }`}>
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div>
              <h3 className="px-3 text-xs font-semibold text-brand-neutral-500 uppercase tracking-wider">
                Cuenta
              </h3>
              <nav className="mt-5 space-y-1">
                {accountLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                      isActive(link.href)
                        ? 'bg-brand-mauve-50 text-brand-mauve-700'
                        : 'text-brand-neutral-700 hover:bg-brand-neutral-50 hover:text-brand-neutral-900'
                    }`}
                  >
                    <span className={`mr-3 ${
                      isActive(link.href)
                        ? 'text-brand-mauve-500'
                        : 'text-brand-neutral-500 group-hover:text-brand-neutral-500'
                    }`}>
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Información de usuario */}
          <div className="flex items-center p-4 border-t border-brand-neutral-200">
            <div className="flex-shrink-0">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Foto de perfil"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-mauve-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-brand-mauve-800">
                    {session?.user?.name
                      ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                      : session?.user?.email.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-brand-neutral-900">
                {session?.user?.name || session?.user?.email.split('@')[0]}
              </p>
              <p className="text-xs text-brand-neutral-500">
                {type === 'marca' ? 'Marca' : 'Showroom'}
              </p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior */}
        <header className="bg-white border-b border-brand-neutral-200 h-16 flex items-center">
          <div className="container px-6 mx-auto flex justify-between items-center">
            {/* Botón de toggle para móvil */}
            <button
              onClick={toggleSidebar}
              className="text-brand-neutral-700 lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Título de la página */}
            <h1 className="text-xl font-semibold text-brand-neutral-900 hidden sm:block">
              {title}
            </h1>
            
            {/* Botones de acción */}
            <div className="flex items-center space-x-2">
              <Link
                href="/mensajes"
                className="p-1 rounded-full text-brand-neutral-700 hover:bg-brand-neutral-100 relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </Link>
              <Link
                href="/notificaciones"
                className="p-1 rounded-full text-brand-neutral-700 hover:bg-brand-neutral-100 relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-brand-neutral-50 p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;