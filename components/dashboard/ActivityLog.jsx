'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;
  
  if (diffInHours < 1) {
    // Menos de una hora: "hace X minutos"
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffInHours < 24) {
    // Menos de un día: "hace X horas"
    const hours = Math.floor(diffInHours);
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  } else if (diffInDays < 7) {
    // Menos de una semana: "hace X días"
    const days = Math.floor(diffInDays);
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  } else {
    // Más de una semana: formato DD/MM/YYYY
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
};

// Componente para mostrar registros de actividad
const ActivityLog = ({ activities = [] }) => {
  // Renderizar icono según el tipo de actividad
  const renderIcon = (type) => {
    switch (type) {
      case 'showroom-view':
      case 'brand-view':
        return (
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="p-2 rounded-full bg-brand-mauve-100 text-brand-mauve-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'collaboration':
        return (
          <div className="p-2 rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        );
      case 'request':
        return (
          <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-brand-neutral-100 text-brand-neutral-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };
  
  // Generar enlace según el tipo de actividad
  const getActivityLink = (activity) => {
    switch (activity.type) {
      case 'message':
        return '/mensajes';
      case 'collaboration':
        return '/colaboraciones';
      case 'request':
        return '/solicitudes';
      default:
        return '#';
    }
  };
  
  // Renderizar lista vacía si no hay actividades
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-brand-neutral-500">No hay actividad reciente.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          className="flex items-start space-x-3 hover:bg-brand-neutral-50 p-2 rounded-lg transition-colors"
        >
          {renderIcon(activity.type)}
          
          <div className="flex-1 min-w-0">
            <Link 
              href={getActivityLink(activity)}
              className="block text-sm text-brand-neutral-800 hover:text-brand-mauve-600 transition-colors"
            >
              {activity.message}
            </Link>
            <p className="text-xs text-brand-neutral-500">
              {formatDate(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
      
      {activities.length > 5 && (
        <div className="text-center pt-2">
          <Link 
            href="/actividad"
            className="text-sm text-brand-mauve-600 hover:text-brand-mauve-700 font-medium"
          >
            Ver todo el historial
          </Link>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;