'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import PlaceholderImage from "@/components/ui/PlaceholderImage";

// Mensaje individual
const Message = ({ message, isOwnMessage, otherUserName, otherUserImage, messageType }) => {
  // Formatear la hora del mensaje
  const formattedTime = format(new Date(message.timestamp), 'HH:mm');
  const formattedDate = format(new Date(message.timestamp), 'EEEE, d MMM yyyy', { locale: es });
  
  // Referencia para desplazamiento automático
  const messageRef = useRef(null);
  
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);
  
  return (
    <div
      ref={messageRef}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {/* Avatar (solo para mensajes de otros) */}
      {!isOwnMessage && (
        <div className="mr-2 flex-shrink-0">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <PlaceholderImage
              src={otherUserImage}
              alt={otherUserName}
              fill={false}
              width={32}
              height={32}
              className="object-cover"
              placeholderType={messageType}
            />
          </div>
        </div>
      )}
      
      {/* Contenido del mensaje */}
      <div className={`max-w-[70%]`}>
        {/* Remitente */}
        <div className={`text-xs ${isOwnMessage ? 'text-right' : ''} text-brand-neutral-500 mb-1`}>
          {isOwnMessage ? 'Tú' : otherUserName}
        </div>
        
        {/* Burbuja de mensaje */}
        <div className={`p-3 rounded-lg break-words ${
          isOwnMessage 
            ? 'bg-brand-mauve-600 text-white rounded-tr-none'
            : 'bg-brand-neutral-100 text-brand-neutral-800 rounded-tl-none'
        }`}>
          <p>{message.contenido}</p>
        </div>
        
        {/* Hora */}
        <div className={`text-xs mt-1 ${isOwnMessage ? 'text-right' : ''} text-brand-neutral-500`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

// Separador de fecha
const DateSeparator = ({ date }) => {
  return (
    <div className="flex justify-center my-4">
      <div className="bg-brand-neutral-100 text-brand-neutral-600 text-xs px-3 py-1 rounded-full">
        {date}
      </div>
    </div>
  );
};

const MessageThread = ({ conversation, messages, onSendMessage, userType }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Determinar qué nombre y avatar mostrar según el tipo de usuario
  const otherUserName = userType === 'marca'
    ? conversation.metadata.nombre_showroom
    : conversation.metadata.nombre_marca;
  
  const otherUserImage = userType === 'marca'
    ? conversation.metadata.imagen_showroom
    : conversation.metadata.logo_marca;
  
  const messageType = userType === 'marca' ? 'showroom' : 'brand';
  
  // Desplazarse al final de los mensajes cuando se carguen o cuando haya un nuevo mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Efecto para simular "está escribiendo..."
  useEffect(() => {
    if (newMessage.length > 0) {
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [newMessage]);
  
  // Manejar envío de mensaje
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  // Manejar escritura de mensaje
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
    }
  };
  
  // Agrupar mensajes por fecha
  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach(message => {
      const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const messagesByDate = groupMessagesByDate();
  
  return (
    <div className="flex flex-col h-full">
      {/* Cabecera de la conversación */}
      <div className="p-4 border-b border-brand-neutral-200 flex items-center">
        <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <PlaceholderImage
            src={otherUserImage}
            alt={otherUserName}
            fill={false}
            width={40}
            height={40}
            className="object-cover"
            placeholderType={messageType}
          />
        </div>
        <div>
          <h2 className="text-lg font-medium text-brand-neutral-900">
            {otherUserName}
          </h2>
          <p className="text-sm text-brand-neutral-500">
            {conversation.tipo === 'marca-showroom' ? 
              (userType === 'marca' ? 'Showroom' : 'Marca') : 
              'Sistema'}
          </p>
        </div>
      </div>
      
      {/* Área de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {Object.entries(messagesByDate).map(([date, dateMessages]) => (
          <div key={date}>
            <DateSeparator date={format(new Date(date), 'EEEE, d MMM yyyy', { locale: es })} />
            {dateMessages.map(message => (
              <Message
                key={message.id}
                message={message}
                isOwnMessage={message.emisor_id === 'user1'}
                otherUserName={otherUserName}
                otherUserImage={otherUserImage}
                messageType={messageType}
              />
            ))}
          </div>
        ))}
        
        {/* Indicador "está escribiendo" */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center bg-brand-neutral-100 text-brand-neutral-600 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-brand-neutral-400 animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-brand-neutral-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-brand-neutral-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="ml-2 text-sm">{otherUserName} está escribiendo...</span>
            </div>
          </div>
        )}
        
        {/* Referencia para desplazamiento */}
        <div ref={messagesEndRef}></div>
      </div>
      
      {/* Área de entrada de mensaje */}
      <div className="p-4 border-t border-brand-neutral-200">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-brand-neutral-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-brand-mauve-500 focus:border-brand-mauve-500"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={handleTyping}
          />
          <button
            type="submit"
            className="bg-brand-mauve-600 hover:bg-brand-mauve-700 text-white px-4 py-2 rounded-r-md transition-colors"
            disabled={!newMessage.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageThread;