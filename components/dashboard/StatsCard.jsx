'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Componente para mostrar estadísticas en el dashboard
const StatsCard = ({ 
  title, 
  value, 
  icon = 'chart', 
  change = null, 
  period = '',
  chartData = null,
  actionLink = null,
  actionText = null 
}) => {
  const [isPositive, setIsPositive] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    if (change !== null) {
      setIsPositive(change >= 0);
    }
  }, [change]);
  
  // Renderizar icono según el tipo
  const renderIcon = () => {
    switch (icon) {
      case 'eye':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'message':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'handshake':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
        );
      case 'mail':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'chart-bar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'notification':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
    }
  };
  
  // Renderizar mini gráfico si hay datos
  const renderMiniChart = () => {
    if (!chartData || chartData.length < 2) return null;
    
    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min;
    
    // Calcular puntos para el path del SVG
    const points = chartData.map((value, index) => {
      const x = (index / (chartData.length - 1)) * 80; // 80px width
      const normalizedValue = range === 0 ? 0.5 : (value - min) / range;
      const y = 30 - (normalizedValue * 30); // 30px height, invertido para que mayor valor = más alto
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="absolute bottom-4 right-4 opacity-30">
        <svg width="80" height="30" viewBox="0 0 80 30">
          <polyline
            points={points}
            fill="none"
            stroke={isPositive ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6 relative overflow-hidden">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-brand-mauve-50 text-brand-mauve-600">
          {renderIcon()}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-brand-neutral-500 text-sm font-medium">
            {title}
          </h3>
          <div className="flex items-end mt-1">
            <p className="text-2xl font-semibold text-brand-neutral-900">
              {value}
            </p>
            
            {change !== null && (
              <div 
                className="ml-2 mb-1 flex items-center"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span className={`flex items-center text-sm font-medium ${
                  isPositive 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  <span className="mr-1">
                    {isPositive ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  {Math.abs(change)}%
                </span>
                
                {/* Tooltip */}
                {showTooltip && (
                  <div className="absolute z-10 w-36 text-center -mt-16 ml-8 px-2 py-1 bg-brand-neutral-800 text-white text-xs rounded">
                    {isPositive ? 'Incremento' : 'Decremento'} del {Math.abs(change)}% en el {period}
                    <div className="absolute h-2 w-2 bg-brand-neutral-800 transform rotate-45 left-0 -ml-1 mt-4"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mini gráfico */}
      {renderMiniChart()}
      
      {/* Enlace de acción opcional */}
      {actionLink && (
        <div className="mt-4">
          <Link
            href={actionLink}
            className="text-sm text-brand-mauve-600 hover:text-brand-mauve-700 font-medium flex items-center"
          >
            {actionText}
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
      )}
    </div>
  );
};

export default StatsCard;