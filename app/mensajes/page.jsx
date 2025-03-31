'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ConversationList from '@/components/messages/ConversationList';
import MessageThread from '@/components/messages/MessageThread';
import EmptyState from '@/components/messages/EmptyState';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Solo cargar datos cuando la sesión está lista
    if (status === 'loading') return;
    
    // Función para cargar conversaciones del usuario
    const loadConversations = async () => {
      setLoading(true);
      try {
        // En una implementación real, aquí harías llamadas a la API
        // Por ahora, usamos datos de ejemplo
        
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Datos de ejemplo para las conversaciones
        const mockConversations = [
          {
            id: 'c1',
            participants: ['user1', 'user2'],
            tipo: session?.user?.tipo_usuario === 'marca' ? 'marca-showroom' : 'showroom-marca',
            creada_en: '2025-03-20T10:30:00',
            ultima_actividad: '2025-03-29T15:45:00',
            estado: 'activa',
            metadata: {
              id_marca: 'marca1',
              id_showroom: 'showroom1',
              nombre_marca: 'Urban Style',
              nombre_showroom: 'Espacio Central',
              logo_marca: '/images/brand-1.jpg',
              imagen_showroom: '/images/showroom-1.jpg'
            },
            ultimo_mensaje: {
              emisor_id: 'user2',
              contenido: '¡Perfecto! ¿Podemos agendar una visita para el próximo martes?',
              timestamp: '2025-03-29T15:45:00',
              leido: false
            }
          },
          {
            id: 'c2',
            participants: ['user1', 'user3'],
            tipo: session?.user?.tipo_usuario === 'marca' ? 'marca-showroom' : 'showroom-marca',
            creada_en: '2025-03-18T14:20:00',
            ultima_actividad: '2025-03-28T11:30:00',
            estado: 'activa',
            metadata: {
              id_marca: 'marca1',
              id_showroom: 'showroom2',
              nombre_marca: 'Urban Style',
              nombre_showroom: 'Design Loft',
              logo_marca: '/images/brand-1.jpg',
              imagen_showroom: '/images/showroom-2.jpg'
            },
            ultimo_mensaje: {
              emisor_id: 'user1',
              contenido: 'Gracias por la información, lo revisaré con mi equipo.',
              timestamp: '2025-03-28T11:30:00',
              leido: true
            }
          },
          {
            id: 'c3',
            participants: ['user1', 'user4'],
            tipo: 'sistema-usuario',
            creada_en: '2025-03-15T09:10:00',
            ultima_actividad: '2025-03-15T09:10:00',
            estado: 'activa',
            metadata: {
              titulo: 'Bienvenido a The Showroom App'
            },
            ultimo_mensaje: {
              emisor_id: 'sistema',
              contenido: '¡Bienvenido a The Showroom App! Estamos aquí para ayudarte a impulsar tu negocio.',
              timestamp: '2025-03-15T09:10:00',
              leido: true
            }
          }
        ];
        
        setConversations(mockConversations);
        
        // Seleccionar la primera conversación por defecto
        if (mockConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(mockConversations[0]);
          // Cargar mensajes de la conversación seleccionada
          loadMessages(mockConversations[0].id);
        }
      } catch (error) {
        console.error('Error cargando conversaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Función para cargar mensajes de una conversación
    const loadMessages = async (conversationId) => {
      try {
        // En una implementación real, aquí harías llamadas a la API
        // Por ahora, usamos datos de ejemplo
        
        // Datos de ejemplo para los mensajes
        const mockMessages = [
          {
            id: 'm1',
            id_conversacion: 'c1',
            emisor_id: 'user1',
            emisor_tipo: 'usuario',
            emisor_nombre: 'Tu',
            contenido: 'Hola, estoy interesado en tu showroom para exponer mi colección de verano. ¿Tendrías disponibilidad para las fechas del 15 al 20 de abril?',
            timestamp: '2025-03-28T10:15:00',
            leido_por: ['user1', 'user2']
          },
          {
            id: 'm2',
            id_conversacion: 'c1',
            emisor_id: 'user2',
            emisor_tipo: 'usuario',
            emisor_nombre: 'Espacio Central',
            contenido: '¡Hola! Gracias por tu interés. Sí tenemos disponibilidad para esas fechas. ¿Cuántos m² necesitarías aproximadamente?',
            timestamp: '2025-03-28T10:30:00',
            leido_por: ['user1', 'user2']
          },
          {
            id: 'm3',
            id_conversacion: 'c1',
            emisor_id: 'user1',
            emisor_tipo: 'usuario',
            emisor_nombre: 'Tu',
            contenido: 'Estupendo. Necesitaría alrededor de 25m² para la colección completa. También me gustaría saber si cuentan con sistema de iluminación ajustable.',
            timestamp: '2025-03-28T11:00:00',
            leido_por: ['user1', 'user2']
          },
          {
            id: 'm4',
            id_conversacion: 'c1',
            emisor_id: 'user2',
            emisor_tipo: 'usuario',
            emisor_nombre: 'Espacio Central',
            contenido: 'Perfecto, contamos con ese espacio disponible. Y sí, nuestro sistema de iluminación es completamente ajustable según tus necesidades. También ofrecemos servicio de montaje si lo necesitas. Te puedo enviar nuestro catálogo de servicios si quieres.',
            timestamp: '2025-03-29T09:20:00',
            leido_por: ['user1', 'user2']
          },
          {
            id: 'm5',
            id_conversacion: 'c1',
            emisor_id: 'user1',
            emisor_tipo: 'usuario',
            emisor_nombre: 'Tu',
            contenido: 'Eso sería genial, gracias. Me gustaría recibir el catálogo para revisar todos los servicios. ¿Podrías indicarme también las tarifas para las fechas mencionadas?',
            timestamp: '2025-03-29T10:45:00',
            leido_por: ['user1', 'user2']
          },
          {
            id: 'm6',
            id_conversacion: 'c1',
            emisor_id: 'user2',
            emisor_tipo: 'usuario',
            emisor_nombre: 'Espacio Central',
            contenido: 'Claro, aquí tienes nuestro catálogo y las tarifas: Para 25m² durante 6 días (15-20 abril), el precio sería de 1.800€ con todos los servicios básicos incluidos. También ofrecemos un descuento del 10% si confirmas la reserva con 3 semanas de antelación.',
            timestamp: '2025-03-29T14:30:00',
            leido_por: ['user1', 'user2']
          },
          {
            id: 'm7',
            id_conversacion: 'c1',
            emisor_id: 'user1',
            emisor_tipo: 'usuario',
            emisor_nombre: 'Tu',
            contenido: 'Me parece muy bien. Estoy interesado en confirmar la reserva para aprovechar el descuento. ¿Sería posible visitar el espacio antes para familiarizarme con la distribución?',
            timestamp: '2025-03-29T15:10:00',
            leido_por: ['user1', 'user2']
          },
          {
            id: 'm8',
            id_conversacion: 'c1',
            emisor_id: 'user2',
            emisor_tipo: 'usuario',
            emisor_nombre: 'Espacio Central',
            contenido: '¡Perfecto! ¿Podemos agendar una visita para el próximo martes?',
            timestamp: '2025-03-29T15:45:00',
            leido_por: ['user1']
          }
        ];
        
        // Filtrar mensajes de la conversación seleccionada
        const filteredMessages = mockMessages.filter(message => message.id_conversacion === conversationId);
        setMessages(filteredMessages);
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      }
    };
    
    loadConversations();
  }, [status, selectedConversation]);
  
  // Manejar selección de conversación
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Cargar mensajes de la conversación seleccionada
    const mockMessages = [
      {
        id: 'm1',
        id_conversacion: conversation.id,
        emisor_id: 'user1',
        emisor_tipo: 'usuario',
        emisor_nombre: 'Tu',
        contenido: 'Hola, estoy interesado en tu showroom para exponer mi colección de verano. ¿Tendrías disponibilidad para las fechas del 15 al 20 de abril?',
        timestamp: '2025-03-28T10:15:00',
        leido_por: ['user1', 'user2']
      },
      {
        id: 'm2',
        id_conversacion: conversation.id,
        emisor_id: 'user2',
        emisor_tipo: 'usuario',
        emisor_nombre: conversation.metadata.nombre_showroom,
        contenido: '¡Hola! Gracias por tu interés. Sí tenemos disponibilidad para esas fechas. ¿Cuántos m² necesitarías aproximadamente?',
        timestamp: '2025-03-28T10:30:00',
        leido_por: ['user1', 'user2']
      },
      {
        id: 'm3',
        id_conversacion: conversation.id,
        emisor_id: 'user1',
        emisor_tipo: 'usuario',
        emisor_nombre: 'Tu',
        contenido: 'Estupendo. Necesitaría alrededor de 25m² para la colección completa. También me gustaría saber si cuentan con sistema de iluminación ajustable.',
        timestamp: '2025-03-28T11:00:00',
        leido_por: ['user1', 'user2']
      },
      {
        id: 'm4',
        id_conversacion: conversation.id,
        emisor_id: 'user2',
        emisor_tipo: 'usuario',
        emisor_nombre: conversation.metadata.nombre_showroom,
        contenido: 'Perfecto, contamos con ese espacio disponible. Y sí, nuestro sistema de iluminación es completamente ajustable según tus necesidades. También ofrecemos servicio de montaje si lo necesitas. Te puedo enviar nuestro catálogo de servicios si quieres.',
        timestamp: '2025-03-29T09:20:00',
        leido_por: ['user1', 'user2']
      }
    ];
    
    setMessages(mockMessages);
  };
  
  // Manejar envío de nuevo mensaje
  const handleSendMessage = (content) => {
    if (!selectedConversation || !content.trim()) return;
    
    // Crear un nuevo mensaje
    const newMessage = {
      id: `m${messages.length + 1}`,
      id_conversacion: selectedConversation.id,
      emisor_id: 'user1',
      emisor_tipo: 'usuario',
      emisor_nombre: 'Tu',
      contenido: content,
      timestamp: new Date().toISOString(),
      leido_por: ['user1']
    };
    
    // Añadir mensaje a la lista
    setMessages([...messages, newMessage]);
    
    // Actualizar última actividad en la conversación
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          ultima_actividad: new Date().toISOString(),
          ultimo_mensaje: {
            emisor_id: 'user1',
            contenido: content,
            timestamp: new Date().toISOString(),
            leido: true
          }
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      ultima_actividad: new Date().toISOString(),
      ultimo_mensaje: {
        emisor_id: 'user1',
        contenido: content,
        timestamp: new Date().toISOString(),
        leido: true
      }
    });
    
    // Simular respuesta automática después de 1-3 segundos
    setTimeout(() => {
      const autoReply = {
        id: `m${messages.length + 2}`,
        id_conversacion: selectedConversation.id,
        emisor_id: 'user2',
        emisor_tipo: 'usuario',
        emisor_nombre: selectedConversation.metadata.nombre_showroom || selectedConversation.metadata.nombre_marca,
        contenido: '¡Gracias por tu mensaje! Te responderemos lo antes posible.',
        timestamp: new Date().toISOString(),
        leido_por: ['user1']
      };
      
      setMessages(prevMessages => [...prevMessages, autoReply]);
      
      // Actualizar última actividad en la conversación
      const updatedConvs = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            ultima_actividad: new Date().toISOString(),
            ultimo_mensaje: {
              emisor_id: 'user2',
              contenido: '¡Gracias por tu mensaje! Te responderemos lo antes posible.',
              timestamp: new Date().toISOString(),
              leido: true
            }
          };
        }
        return conv;
      });
      
      setConversations(updatedConvs);
      setSelectedConversation({
        ...selectedConversation,
        ultima_actividad: new Date().toISOString(),
        ultimo_mensaje: {
          emisor_id: 'user2',
          contenido: '¡Gracias por tu mensaje! Te responderemos lo antes posible.',
          timestamp: new Date().toISOString(),
          leido: true
        }
      });
    }, Math.random() * 2000 + 1000); // Entre 1 y 3 segundos
  };
  
  // Obtener el tipo de usuario para el layout
  const userType = session?.user?.tipo_usuario || 'marca';
  
  return (
    <DashboardLayout type={userType} title="Mensajes">
      <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 h-[calc(100vh-11rem)]">
        <div className="flex h-full">
          {/* Lista de conversaciones */}
          <div className="w-full md:w-1/3 border-r border-brand-neutral-200 h-full">
            <ConversationList 
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              isLoading={loading}
              userType={userType}
            />
          </div>
          
          {/* Mensajes de la conversación seleccionada */}
          <div className="hidden md:block md:w-2/3 h-full">
            {selectedConversation ? (
              <MessageThread 
                conversation={selectedConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                userType={userType}
              />
            ) : (
              <EmptyState
                title="Selecciona una conversación"
                description="Elige una conversación de la lista o inicia una nueva."
                icon="message"
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}