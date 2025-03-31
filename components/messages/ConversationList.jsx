'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import PlaceholderImage from "@/components/ui/PlaceholderImage";

// Función para formatear la fecha a formato relativo
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { 
      addSuffix: true,
      locale: es
    });
  } catch (error) {
    return 'Fecha desconocida';
  }
};

// Componente para cada elemento de conversación
const ConversationItem = ({ conversation, isSelected, onClick, userType }) => {
  // Determinar si el usuario actual es emisor del último mensaje
  const isCurrentUserLastMessage = conversation.ultimo_mensaje?.emisor_id === 'user1';
  
  // Determinar si hay mensajes no leídos
  const hasUnreadMessages = !conversation.ultimo_mensaje?.leido && !isCurrentUserLastMessage;
  
  // Determinar qué nombre y avatar mostrar según el tipo de usuario
  const displayName = userType === 'marca'
    ? conversation.metadata.nombre_showroom
    : conversation.metadata.nombre_marca;
  
  const avatarImage = userType === 'marca'
    ? conversation.metadata.imagen_showroom
    : conversation.metadata.logo_marca;
  
  const avatarType = userType === 'marca' ? 'showroom' : 'brand';
  
  return (
    <div 
      className={`px-4 py-3 flex cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-brand-mauve-50'
          : 'hover:bg-brand-neutral-50'
      } ${hasUnreadMessages ? 'bg-brand-neutral-50' : ''}`}
      onClick={() => onClick(conversation)}
    >
      {/* Avatar */}
      <div className="relative h-12 w-12 rounded-full flex-shrink-0 mr-3">
        <PlaceholderImage
          src={avatarImage}
          alt={displayName}
          fill={true}
          className="object-cover rounded-full"
          placeholderType={avatarType}
        />
      </div>
      
      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className={`font-medium truncate ${
            hasUnreadMessages ? 'text-brand-neutral-900' : 'text-brand-neutral-700'
          }`}>
            {displayName}
          </h3>
          <span className="text-xs text-brand-neutral-500 whitespace-nowrap ml-2">
            {formatDate(conversation.ultima_actividad)}
          </span>
        </div>
        
        <p className={`text-sm truncate mt-1 ${
          hasUnreadMessages 
            ? 'text-brand-neutral-800 font-medium' 
            : 'text-brand-neutral-600'
        }`}>
          {isCurrentUserLastMessage && <span className="text-brand-neutral-500">Tú: </span>}
          {conversation.ultimo_mensaje?.contenido}
        </p>
      </div>
      
      {/* Indicador de no leído */}
      {hasUnreadMessages && (
        <div className="ml-2 flex-shrink-0 bg-brand-mauve-500 h-2 w-2 rounded-full self-center"></div>
      )}
    </div>
  );
};

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  isLoading,
  userType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar conversaciones según el término de búsqueda
  const filteredConversations = conversations.filter(conversation => {
    const searchTarget = userType === 'marca'
      ? conversation.metadata.nombre_showroom
      : conversation.metadata.nombre_marca;
    
    return searchTarget?.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  return (
    <div className="flex flex-col h-full">
      {/* Cabecera */}
      <div className="p-4 border-b border-brand-neutral-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-brand-neutral-900">Mensajes</h2>
          <Link 
            href="/mensajes/nuevo"
            className="p-2 rounded-full bg-brand-mauve-50 text-brand-mauve-600 hover:bg-brand-mauve-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {/* Buscador */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-brand-neutral-200 rounded-md text-sm placeholder-brand-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-mauve-500 focus:border-brand-mauve-500"
            placeholder={`Buscar ${userType === 'marca' ? 'showroom' : 'marca'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          // Esqueleto de carga
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="rounded-full bg-brand-neutral-200 h-12 w-12 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-brand-neutral-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-brand-neutral-200 rounded w-1/2 mt-2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="divide-y divide-brand-neutral-200">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
                onClick={onSelectConversation}
                userType={userType}
              />
            ))}
          </div>
        ) : (
          // Estado vacío
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            {searchTerm ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-neutral-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-brand-neutral-500">
                  No se encontraron conversaciones con "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-brand-mauve-600 hover:text-brand-mauve-700 text-sm font-medium"
                >
                  Borrar búsqueda
                </button>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-neutral-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-brand-neutral-500">
                  No tienes conversaciones aún
                </p>
                <Link
                  href="/mensajes/nuevo"
                  className="mt-2 text-brand-mauve-600 hover:text-brand-mauve-700 text-sm font-medium"
                >
                  Iniciar una nueva conversación
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;