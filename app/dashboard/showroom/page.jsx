'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityLog from '@/components/dashboard/ActivityLog';
import BrandCard from '@/components/dashboard/BrandCard';
import OccupancyCalendar from '@/components/dashboard/OccupancyCalendar';

export default function ShowroomDashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    visitas: 0,
    solicitudes: 0,
    colaboraciones: 0,
    mensajesNoLeidos: 0,
    ocupacion: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendedBrands, setRecommendedBrands] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  
  useEffect(() => {
    // Solo cargar datos cuando la sesión está lista
    if (status === 'loading') return;
    
    // Función para cargar datos del dashboard
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // En una implementación real, aquí harías llamadas a la API
        // Por ahora, usamos datos de ejemplo
        
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Estadísticas
        setStats({
          visitas: 248,
          solicitudes: 12,
          colaboraciones: 4,
          mensajesNoLeidos: Math.floor(Math.random() * 5),
          ocupacion: 75
        });
        
        // Actividad reciente
        setRecentActivity([
          {
            id: 1,
            type: 'brand-view',
            message: 'Urban Style ha visto tu perfil',
            timestamp: '2025-03-28T15:30:00',
            icon: 'eye'
          },
          {
            id: 2,
            type: 'message',
            message: 'Nuevo mensaje de Eco Fashion',
            timestamp: '2025-03-27T10:15:00',
            icon: 'message'
          },
          {
            id: 3,
            type: 'request',
            message: 'Nueva solicitud de Modern Kids',
            timestamp: '2025-03-25T14:20:00',
            icon: 'notification'
          }
        ]);
        
        // Marcas recomendadas
        setRecommendedBrands([
          {
            id: 'b1',
            name: 'Urban Style',
            logo: '/images/brand-1.jpg', // Placeholder
            categories: ['Urbano', 'Streetwear'],
            match: 95,
            since: '2020'
          },
          {
            id: 'b2',
            name: 'Eco Fashion',
            logo: '/images/brand-2.jpg', // Placeholder
            categories: ['Sostenible', 'Casual'],
            match: 92,
            since: '2019'
          },
          {
            id: 'b3',
            name: 'Minimal',
            logo: '/images/brand-3.jpg', // Placeholder
            categories: ['Minimalista', 'Formal'],
            match: 88,
            since: '2021'
          }
        ]);
        
        // Datos de ocupación para el calendario
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Generar fechas de ocupación para los próximos 2 meses
        const occupancyDates = [];
        
        // Marcas actualmente en el showroom
        const activeBrands = [
          { id: 'b1', name: 'Urban Style', color: '#8A4CEF' },
          { id: 'b2', name: 'Eco Fashion', color: '#5DB4B6' }
        ];
        
        // Generar algunas fechas de ocupación aleatoria
        for (let month = currentMonth; month < currentMonth + 2; month++) {
          const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
          
          // Asignar algunas fechas ocupadas
          const occupiedDays = new Set();
          for (let i = 0; i < 15; i++) {
            occupiedDays.add(Math.floor(Math.random() * daysInMonth) + 1);
          }
          
          // Crear eventos para el calendario
          Array.from(occupiedDays).forEach(day => {
            // Seleccionar una marca aleatoria para este evento
            const brand = activeBrands[Math.floor(Math.random() * activeBrands.length)];
            
            // Duración aleatoria de 1-3 días
            const duration = Math.floor(Math.random() * 3) + 1;
            
            occupancyDates.push({
              id: `event-${month}-${day}`,
              title: brand.name,
              start: new Date(currentYear, month, day),
              end: new Date(currentYear, month, day + duration),
              brand: brand.id,
              color: brand.color
            });
          });
        }
        
        setOccupancyData(occupancyDates);
        
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [status]);
  
  // Obtener nombre del showroom desde la sesión
  const showroomName = session?.user?.userDetails?.nombre || "Tu Showroom";
  
  return (
    <DashboardLayout type="showroom" title="Dashboard">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-neutral-900">
          Bienvenido, {showroomName}
        </h1>
        <p className="text-brand-neutral-600 mt-1">
          Aquí tienes un resumen de la actividad y el estado de tu espacio.
        </p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard 
          title="Visitas al perfil" 
          value={stats.visitas}
          icon="eye"
          change={8}
          period="último mes"
        />
        <StatsCard 
          title="Solicitudes" 
          value={stats.solicitudes}
          icon="notification"
          change={3}
          period="último mes"
        />
        <StatsCard 
          title="Colaboraciones" 
          value={stats.colaboraciones}
          icon="handshake"
          change={1}
          period="último mes"
        />
        <StatsCard 
          title="Tasa de ocupación" 
          value={`${stats.ocupacion}%`}
          icon="chart-bar"
          change={5}
          period="último mes"
          chartData={[60, 65, 70, 75]}
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
          {/* Calendario de ocupación */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-brand-neutral-200">
              <h2 className="text-xl font-semibold text-brand-neutral-900">
                Calendario de ocupación
              </h2>
              <p className="text-brand-neutral-600 text-sm mt-1">
                Gestiona tus reservas y disponibilidad
              </p>
            </div>
            
            <div className="p-6">
              {loading ? (
                // Esqueleto de carga
                <div className="rounded-lg bg-brand-neutral-100 h-80 animate-pulse"></div>
              ) : (
                <OccupancyCalendar events={occupancyData} />
              )}
            </div>
          </div>
          
          {/* Marcas recomendadas */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-brand-neutral-200">
              <h2 className="text-xl font-semibold text-brand-neutral-900">
                Marcas recomendadas para tu espacio
              </h2>
              <p className="text-brand-neutral-600 text-sm mt-1">
                Basadas en tu perfil y disponibilidad
              </p>
            </div>
            
            <div className="p-6">
              {loading ? (
                // Esqueleto de carga
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg bg-brand-neutral-100 h-40 animate-pulse"></div>
                  ))}
                </div>
              ) : recommendedBrands.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedBrands.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} />
                  ))}
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <p className="mt-2 text-brand-neutral-600">
                    No hay marcas recomendadas disponibles en este momento.
                  </p>
                  <Link
                    href="/marcas"
                    className="mt-4 inline-block text-brand-mauve-600 hover:text-brand-mauve-700"
                  >
                    Explorar todas las marcas
                  </Link>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Link 
                  href="/marcas" 
                  className="inline-flex items-center text-brand-mauve-600 hover:text-brand-mauve-700 font-medium"
                >
                  Ver todas las marcas disponibles
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
          </div>
        </div>
        
        {/* Columna derecha (1/3) */}
        <div className="space-y-8">
          {/* Actividad reciente */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-brand-neutral-200">
              <h2 className="text-xl font-semibold text-brand-neutral-900">
                Actividad reciente
              </h2>
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
          
          {/* Completar perfil - condicional */}
          {(!session?.user?.userDetails?.verified) && (
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
                      Los showrooms con fotos de alta calidad reciben un 90% más de solicitudes. Agrega imágenes de tu espacio, servicios y características.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Ver mi perfil
                </Link>
                
                <Link
                  href="/solicitudes"
                  className="flex items-center p-3 rounded-lg hover:bg-brand-neutral-50 text-brand-neutral-700 hover:text-brand-neutral-900 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-3 text-brand-neutral-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Solicitudes pendientes
                </Link>
                
                <Link
                  href="/disponibilidad"
                  className="flex items-center p-3 rounded-lg hover:bg-brand-neutral-50 text-brand-neutral-700 hover:text-brand-neutral-900 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-3 text-brand-neutral-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Gestionar disponibilidad
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
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