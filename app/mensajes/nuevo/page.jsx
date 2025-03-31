'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PlaceholderImage from '@/components/ui/PlaceholderImage';

export default function NewMessagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtener parámetros de la URL si los hay
  const preselectedMarcaId = searchParams.get('marca');
  const preselectedShowroomId = searchParams.get('showroom');
  
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  // Determinar el tipo de usuario
  const userType = session?.user?.tipo_usuario || 'marca';
  const recipientType = userType === 'marca' ? 'showroom' : 'marca';
  
  useEffect(() => {
    // Solo cargar datos cuando la sesión está lista
    if (status === 'loading') return;
    
    // Función para cargar destinatarios potenciales
    const loadRecipients = async () => {
      setLoading(true);
      try {
        // En una implementación real, aquí harías llamadas a la API
        // Por ahora, usamos datos de ejemplo
        
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Datos de ejemplo para los destinatarios
        const mockRecipients = userType === 'marca' 
          ? [
              {
                id: 'showroom1',
                nombre: 'Espacio Central',
                imagen: '/images/showroom-1.jpg',
                ubicacion: 'Madrid, España',
                matchScore: 92
              },
              {
                id: 'showroom2',
                nombre: 'Urban Gallery',
                imagen: '/images/showroom-2.jpg',
                ubicacion: 'Barcelona, España',
                matchScore: 87
              },
              {
                id: 'showroom3',
                nombre: 'Fashion Hub',
                imagen: '/images/showroom-3.jpg',
                ubicacion: 'Valencia, España',
                matchScore: 85
              },
              {
                id: 'showroom4',
                nombre: 'Studio Concept',
                imagen: '/images/showroom-4.jpg',
                ubicacion: 'Sevilla, España',
                matchScore: 78
              },
              {
                id: 'showroom5',
                nombre: 'Design Loft',
                imagen: '/images/showroom-5.jpg',
                ubicacion: 'Bilbao, España',
                matchScore: 75
              }
            ]
          : [
              {
                id: 'marca1',
                nombre: 'Urban Style',
                logo: '/images/brand-1.jpg',
                categorias: ['Urbano', 'Streetwear'],
                matchScore: 95
              },
              {
                id: 'marca2',
                nombre: 'Eco Fashion',
                logo: '/images/brand-2.jpg',
                categorias: ['Sostenible', 'Casual'],
                matchScore: 90
              },
              {
                id: 'marca3',
                nombre: 'Elegance',
                logo: '/images/brand-3.jpg',
                categorias: ['Formal', 'Lujo'],
                matchScore: 82
              },
              {
                id: 'marca4',
                nombre: 'Modern Kids',
                logo: '/images/brand-4.jpg',
                categorias: ['Infantil', 'Casual'],
                matchScore: 76
              },
              {
                id: 'marca5',
                nombre: 'Sport Plus',
                logo: '/images/brand-5.jpg',
                categorias: ['Deportivo', 'Casual'],
                matchScore: 74
              }
            ];
            
        setRecipients(mockRecipients);
        
        // Si hay un recipient preseleccionado en los parámetros de URL, seleccionarlo
        if (preselectedMarcaId && userType === 'showroom') {
          const preselected = mockRecipients.find(r => r.id === preselectedMarcaId);
          if (preselected) {
            setSelectedRecipient(preselected);
          }
        } else if (preselectedShowroomId && userType === 'marca') {
          const preselected = mockRecipients.find(r => r.id === preselectedShowroomId);
          if (preselected) {
            setSelectedRecipient(preselected);
          }
        }
      } catch (error) {
        console.error('Error cargando destinatarios:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipients();
  }, [status, userType, preselectedMarcaId, preselectedShowroomId]);
  
  // Filtrar destinatarios según el término de búsqueda
  const filteredRecipients = recipients.filter(recipient => 
    recipient.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Manejar envío del mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!selectedRecipient || !message.trim()) {
      return;
    }
    
    setSending(true);
    
    try {
      // En una implementación real, aquí harías una llamada a la API
      // Por ahora, solo simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir a la página de conversaciones
      router.push('/mensajes');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('No se pudo enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };
  
  // Renderizar tarjeta de destinatario
  const renderRecipientCard = (recipient) => {
    if (userType === 'marca') {
      // Renderizar tarjeta de showroom
      return (
        <div 
          key={recipient.id}
          className={`flex border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedRecipient?.id === recipient.id
              ? 'border-brand-mauve-300 bg-brand-mauve-50'
              : 'border-brand-neutral-200 hover:border-brand-mauve-200 hover:bg-brand-neutral-50'
          }`}
          onClick={() => setSelectedRecipient(recipient)}
        >
          <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
            <PlaceholderImage
              src={recipient.imagen}
              alt={recipient.nombre}
              fill={true}
              className="object-cover"
              placeholderType="showroom"
            />
          </div>
          
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <h3 className="font-medium text-brand-neutral-900">{recipient.nombre}</h3>
              <span className="bg-brand-neutral-100 text-brand-neutral-800 text-xs px-2 py-1 rounded-full">
                {recipient.matchScore}% match
              </span>
            </div>
            <p className="text-sm text-brand-neutral-600 mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {recipient.ubicacion}
            </p>
          </div>
        </div>
      );
    } else {
      // Renderizar tarjeta de marca
      return (
        <div 
          key={recipient.id}
          className={`flex border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedRecipient?.id === recipient.id
              ? 'border-brand-mauve-300 bg-brand-mauve-50'
              : 'border-brand-neutral-200 hover:border-brand-mauve-200 hover:bg-brand-neutral-50'
          }`}
          onClick={() => setSelectedRecipient(recipient)}
        >
          <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
            <PlaceholderImage
              src={recipient.logo}
              alt={recipient.nombre}
              fill={true}
              className="object-cover"
              placeholderType="brand"
            />
          </div>
          
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <h3 className="font-medium text-brand-neutral-900">{recipient.nombre}</h3>
              <span className="bg-brand-neutral-100 text-brand-neutral-800 text-xs px-2 py-1 rounded-full">
                {recipient.matchScore}% match
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {recipient.categorias.map((categoria, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-brand-neutral-100 text-brand-neutral-700 rounded-full text-xs"
                >
                  {categoria}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <DashboardLayout type={userType} title="Nuevo mensaje">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 overflow-hidden">
          {/* Cabecera */}
          <div className="p-6 border-b border-brand-neutral-200">
            <h1 className="text-2xl font-bold text-brand-neutral-900">
              Nuevo mensaje
            </h1>
            <p className="text-brand-neutral-600 mt-1">
              Selecciona un {recipientType === 'marca' ? 'marca' : 'showroom'} y escribe tu mensaje.
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSendMessage}>
              {/* Buscador de destinatarios */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                  Selecciona un {recipientType}
                </label>
                
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-brand-neutral-200 rounded-md text-sm placeholder-brand-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-mauve-500 focus:border-brand-mauve-500"
                    placeholder={`Buscar ${recipientType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Lista de destinatarios */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {loading ? (
                    // Esqueleto de carga
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="border rounded-lg p-4 animate-pulse flex">
                        <div className="bg-brand-neutral-200 h-16 w-16 rounded-lg"></div>
                        <div className="ml-4 flex-1">
                          <div className="h-4 bg-brand-neutral-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-brand-neutral-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  ) : filteredRecipients.length > 0 ? (
                    filteredRecipients.map(recipient => renderRecipientCard(recipient))
                  ) : (
                    <div className="text-center py-6 bg-brand-neutral-50 rounded-lg border border-brand-neutral-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-brand-neutral-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-brand-neutral-600">
                        {searchTerm 
                          ? `No se encontraron ${recipientType}s con "${searchTerm}"`
                          : `No hay ${recipientType}s disponibles en este momento.`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Área de mensaje */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  rows="5"
                  className="block w-full px-3 py-2 border border-brand-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-mauve-500 focus:border-brand-mauve-500"
                  placeholder="Escribe tu mensaje aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!selectedRecipient}
                ></textarea>
              </div>
              
              {/* Botones de acción */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-brand-neutral-300 text-brand-neutral-700 rounded-md hover:bg-brand-neutral-50 transition-colors"
                  onClick={() => router.push('/mensajes')}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-mauve-600 text-white rounded-md hover:bg-brand-mauve-700 transition-colors disabled:bg-brand-neutral-300 disabled:cursor-not-allowed"
                  disabled={!selectedRecipient || !message.trim() || sending}
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : "Enviar mensaje"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}