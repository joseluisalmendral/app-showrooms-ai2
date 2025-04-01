'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityLog from '@/components/dashboard/ActivityLog';
import ShowroomCard from '@/components/dashboard/ShowroomCard';

export default function MarcaDashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    visitas: 0,
    contactos: 0,
    colaboraciones: 0,
    mensajesNoLeidos: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendedShowrooms, setRecommendedShowrooms] = useState([]);
  
  // Función mejorada para obtener el nombre del perfil con verificaciones más seguras
  const getProfileName = () => {
    if (!session?.user) return "Cargando...";
    
    // Intentar obtener el nombre de varias fuentes posibles
    const name = session.user.userDetails?.nombre || // Nombre desde userDetails
               session.user.name || // Nombre desde la sesión directamente
               session.user.email?.split('@')[0] || // Primera parte del email
               "Tu Marca"; // Fallback
               
    return name;
  };
  
  // Función para verificar si hay información completa del perfil
  const hasCompleteProfile = () => {
    if (!session?.user?.userDetails) return false;
    
    const details = session.user.userDetails;
    
    // Verificar campos importantes para marca
    return !!(details.nombre && 
             details.descripcion && 
             (details.logo_url || details.foto_portada));
  };

  // Mejorar la carga de datos solo cuando la sesión esté totalmente cargada
  useEffect(() => {
    const loadDashboardData = async () => {
      // Solo cargar datos cuando tengamos la sesión completamente cargada
      // y tengamos información del usuario
      if (status === 'loading' || !session?.user) return;

      console.log('Dashboard - Iniciando carga de datos con sesión:', {
        userType: session.user.tipo_usuario,
        userId: session.user.id,
        hasUserDetails: !!session.user.userDetails
      });

      setLoading(true);

      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 800));

        // En una implementación real, estas serían llamadas a la API
        // usando el ID de usuario y tipo de la sesión
        /*
        const statsResponse = await fetch(`/api/dashboard/${session.user.tipo_usuario}/stats?userId=${session.user.id}`);
        const activityResponse = await fetch(`/api/dashboard/${session.user.tipo_usuario}/activity?userId=${session.user.id}`);
        
        if (statsResponse.ok && activityResponse.ok) {
          const statsData = await statsResponse.json();
          const activityData = await activityResponse.json();
          
          setStats(statsData);
          setRecentActivity(activityData);
        }
        */

        // Datos simulados
        setStats({
          visitas: 324,
          contactos: 18,
          colaboraciones: 5,
          mensajesNoLeidos: Math.floor(Math.random() * 5)
        });

        setRecentActivity([
          {
            id: 1,
            type: 'showroom-view',
            message: 'Espacio Central ha visto tu perfil',
            timestamp: '2025-03-28T15:30:00',
            icon: 'eye'
          },
          {
            id: 2,
            type: 'message',
            message: 'Nuevo mensaje de Urban Gallery',
            timestamp: '2025-03-27T10:15:00',
            icon: 'message'
          },
          {
            id: 3,
            type: 'collaboration',
            message: 'Colaboración con Fashion Hub confirmada',
            timestamp: '2025-03-25T14:20:00',
            icon: 'handshake'
          }
        ]);
        
        // Cargar showrooms recomendados
        setRecommendedShowrooms([
          {
            id: 's1',
            name: 'Espacio Central',
            location: 'Madrid, España',
            image: '/images/showroom-1.jpg', // Placeholder
            rating: 4.8,
            match: 95,
            priceRange: '€120-150/día'
          },
          {
            id: 's2',
            name: 'Urban Gallery',
            location: 'Barcelona, España',
            image: '/images/showroom-2.jpg', // Placeholder
            rating: 4.7,
            match: 92,
            priceRange: '€100-130/día'
          },
          {
            id: 's3',
            name: 'Design Loft',
            location: 'Valencia, España',
            image: '/images/showroom-3.jpg', // Placeholder
            rating: 4.6,
            match: 88,
            priceRange: '€90-110/día'
          }
        ]);

        console.log('Dashboard - Datos cargados correctamente');
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [status, session]);
  
  // Método para refrescar los datos del dashboard
  const refreshDashboardData = async () => {
    if (status !== 'authenticated' || !session?.user) return;
    
    setLoading(true);
    
    try {
      // Aquí irían las llamadas reales a la API
      console.log('Actualizando datos del dashboard...');
      
      // Simulación de refresco
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Actualizar estados con nuevos datos simulados
      setStats(prevStats => ({
        ...prevStats,
        mensajesNoLeidos: Math.floor(Math.random() * 5)
      }));
      
      console.log('Datos del dashboard actualizados');
    } catch (error) {
      console.error('Error al actualizar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Obtener nombre de la marca desde la sesión usando la función mejorada
  const brandName = getProfileName();
  
  return (
    <DashboardLayout type="marca" title="Dashboard">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-neutral-900">
          Bienvenido, {brandName}
        </h1>
        <p className="text-brand-neutral-600 mt-1">
          Aquí tienes un resumen de la actividad y oportunidades para tu marca.
        </p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Visitas al perfil" 
          value={stats.visitas}
          icon="eye"
          change={12}
          period="último mes"
        />
        <StatsCard 
          title="Contactos recibidos" 
          value={stats.contactos}
          icon="message"
          change={5}
          period="último mes"
        />
        <StatsCard 
          title="Colaboraciones" 
          value={stats.colaboraciones}
          icon="handshake"
          change={2}
          period="último mes"
        />
        <StatsCard 
          title="Mensajes sin leer" 
          value={stats.mensajesNoLeidos}
          icon="mail"
          change={null}
          actionLink="/mensajes"
          actionText="Ver mensajes"
        />
      </div>
      
      {/* Contenido principal del dashboard en 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sección de showrooms recomendados */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-brand-neutral-200">
              <h2 className="text-xl font-semibold text-brand-neutral-900">
                Showrooms recomendados para ti
              </h2>
              <p className="text-brand-neutral-600 text-sm mt-1">
                Basados en tu perfil y preferencias
              </p>
            </div>
            
            <div className="p-6">
              {loading ? (
                // Esqueleto de carga
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg bg-brand-neutral-100 h-28 animate-pulse"></div>
                  ))}
                </div>
              ) : recommendedShowrooms.length > 0 ? (
                <div className="space-y-4">
                  {recommendedShowrooms.map((showroom) => (
                    <ShowroomCard key={showroom.id} showroom={showroom} />
                  ))}
                  
                  <div className="mt-4 text-center">
                    <Link 
                      href="/showrooms" 
                      className="inline-flex items-center text-brand-mauve-600 hover:text-brand-mauve-700 font-medium"
                    >
                      Ver todos los showrooms disponibles
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
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-brand-neutral-400"
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
                  <p className="mt-2 text-brand-neutral-600">
                    No hay showrooms recomendados disponibles en este momento.
                  </p>
                  <Link
                    href="/showrooms"
                    className="mt-4 inline-block text-brand-mauve-600 hover:text-brand-mauve-700"
                  >
                    Explorar todos los showrooms
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Completar perfil - condicional mejorado usando hasCompleteProfile */}
          {(!hasCompleteProfile()) && (
            <div className="bg-brand-celeste-50 rounded-xl border border-brand-celeste-200 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-brand-celeste-700" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-medium text-brand-celeste-800">
                    Completa tu perfil para aumentar la visibilidad
                  </h3>
                  <div className="mt-2 text-brand-celeste-700">
                    <p>
                      Los perfiles completos reciben un 70% más de contactos. Agrega imágenes de tus productos, una descripción detallada y tus enlaces de redes sociales.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/perfil/editar"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-celeste-600 hover:bg-brand-celeste-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-celeste-500"
                    >
                      Completar mi perfil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Columna derecha (1/3) */}
        <div className="space-y-8">
          {/* Actividad reciente */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-brand-neutral-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-brand-neutral-900">
                Actividad reciente
              </h2>
              
              {/* Botón para refrescar los datos */}
              <button 
                onClick={refreshDashboardData}
                disabled={loading}
                className="p-2 rounded-full text-brand-neutral-500 hover:text-brand-mauve-600 hover:bg-brand-neutral-100 transition-colors disabled:opacity-50"
                aria-label="Refrescar datos"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {loading ? (
                // Esqueleto de carga
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="rounded-full bg-brand-neutral-100 h-10 w-10 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-brand-neutral-100 rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-brand-neutral-100 rounded w-1/2 mt-2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <ActivityLog activities={recentActivity} />
              ) : (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-brand-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-2 text-brand-neutral-600">
                    No hay actividad reciente.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Accesos rápidos */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-brand-neutral-200">
              <h2 className="text-xl font-semibold text-brand-neutral-900">
                Accesos rápidos
              </h2>
            </div>
            
            <div className="p-4">
              <nav className="space-y-2">
                <Link
                  href="/mensajes"
                  className="flex items-center p-3 rounded-lg hover:bg-brand-neutral-50 text-brand-neutral-700 hover:text-brand-neutral-900 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-3 text-brand-neutral-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Bandeja de mensajes
                  {stats.mensajesNoLeidos > 0 && (
                    <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {stats.mensajesNoLeidos}
                    </span>
                  )}
                </Link>
                
                <Link
                  href="/perfil"
                  className="flex items-center p-3 rounded-lg hover:bg-brand-neutral-50 text-brand-neutral-700 hover:text-brand-neutral-900 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-3 text-brand-neutral-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Ver mi perfil
                </Link>
                
                <Link
                  href="/colaboraciones"
                  className="flex items-center p-3 rounded-lg hover:bg-brand-neutral-50 text-brand-neutral-700 hover:text-brand-neutral-900 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-3 text-brand-neutral-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Mis colaboraciones
                </Link>
                
                <Link
                  href="/configuracion"
                  className="flex items-center p-3 rounded-lg hover:bg-brand-neutral-50 text-brand-neutral-700 hover:text-brand-neutral-900 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-3 text-brand-neutral-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.533 1.533 0 00-2.287-.947c-1.543.836-2.942-.734-2.106-2.106a1.724 1.724 0 00-.947-2.287c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 00.947-2.287c-.836-1.372.734-2.942 2.106-2.106a1.724 1.724 0 002.287-.947z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configuración
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}