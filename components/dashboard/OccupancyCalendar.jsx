'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const OccupancyCalendar = ({ events = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
  
  // Obtener días del mes actual
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Obtener eventos del día seleccionado
  useEffect(() => {
    if (!selectedDay) {
      setDayEvents([]);
      return;
    }
    
    // Filtrar eventos que ocurren en el día seleccionado
    const filteredEvents = events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // Comprobar si el día seleccionado está dentro del rango del evento
      return (
        selectedDay >= eventStart && 
        selectedDay <= eventEnd
      );
    });
    
    setDayEvents(filteredEvents);
  }, [selectedDay, events]);
  
  // Ir al mes anterior
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Ir al mes siguiente
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Ir al mes actual
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDay(new Date());
  };
  
  // Comprobar si hay eventos en una fecha específica
  const hasEvents = (day) => {
    return events.some(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return day >= eventStart && day <= eventEnd;
    });
  };
  
  // Obtener color de evento para un día específico
  const getEventColors = (day) => {
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return day >= eventStart && day <= eventEnd;
    });
    
    // Si hay múltiples eventos, devolver un degradado
    if (dayEvents.length > 1) {
      const colors = dayEvents.map(event => event.color || '#8A4CEF').join(', ');
      return `linear-gradient(135deg, ${colors})`;
    }
    
    // Si hay un solo evento, devolver su color
    return dayEvents.length === 1 ? dayEvents[0].color || '#8A4CEF' : '';
  };
  
  // Renderizar nombre de día de la semana
  const renderDayName = (index) => {
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dayNames[index];
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Cabecera del calendario */}
      <div className="flex items-center justify-between p-4 border-b border-brand-neutral-200">
        <h3 className="text-lg font-medium text-brand-neutral-900">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={goToToday}
            className="px-2 py-1 text-sm bg-brand-neutral-100 hover:bg-brand-neutral-200 rounded transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={prevMonth}
            className="p-1 rounded hover:bg-brand-neutral-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded hover:bg-brand-neutral-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-brand-neutral-200">
        {/* Nombres de los días */}
        {Array.from({ length: 7 }).map((_, index) => (
          <div 
            key={`header-${index}`}
            className="bg-brand-neutral-100 text-brand-neutral-700 text-center py-2 text-sm font-medium"
          >
            {renderDayName(index)}
          </div>
        ))}
        
        {/* Días del mes con relleno para alinear correctamente */}
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div 
            key={`padding-start-${index}`}
            className="bg-white h-16 p-1 text-sm"
          ></div>
        ))}
        
        {/* Días del mes actual */}
        {monthDays.map((day) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDay && isSameDay(day, selectedDay);
          const hasEventsOnDay = hasEvents(day);
          const eventColors = getEventColors(day);
          
          return (
            <div 
              key={day.toISOString()}
              className={`bg-white h-16 p-1 text-sm relative ${
                isToday ? 'bg-brand-neutral-50' : ''
              }`}
              onClick={() => setSelectedDay(day)}
            >
              <div 
                className={`w-7 h-7 flex items-center justify-center rounded-full ${
                  isSelected
                    ? 'bg-brand-mauve-600 text-white'
                    : isToday
                    ? 'bg-brand-mauve-100 text-brand-mauve-800'
                    : ''
                } cursor-pointer hover:bg-brand-mauve-100 hover:text-brand-mauve-800 transition-colors`}
              >
                {format(day, 'd')}
              </div>
              
              {/* Indicador de eventos */}
              {hasEventsOnDay && (
                <div 
                  className="absolute bottom-1 left-1 right-1 h-3 rounded-sm"
                  style={{ background: eventColors }}
                ></div>
              )}
            </div>
          );
        })}
        
        {/* Relleno para completar la última semana */}
        {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
          <div 
            key={`padding-end-${index}`}
            className="bg-white h-16 p-1 text-sm"
          ></div>
        ))}
      </div>
      
      {/* Lista de eventos del día seleccionado */}
      {selectedDay && (
        <div className="border-t border-brand-neutral-200 p-4">
          <div className="mb-3">
            <h4 className="font-medium text-brand-neutral-900">
              {format(selectedDay, 'EEEE, d MMMM yyyy', { locale: es })}
            </h4>
          </div>
          
          {dayEvents.length > 0 ? (
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-2 rounded-md text-sm flex items-center"
                  style={{ backgroundColor: `${event.color}30` }}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: event.color || '#8A4CEF' }}
                  ></div>
                  <div>
                    <div className="font-medium" style={{ color: event.color || '#8A4CEF' }}>
                      {event.title}
                    </div>
                    <div className="text-xs text-brand-neutral-600">
                      {format(new Date(event.start), 'dd/MM/yyyy')} - {format(new Date(event.end), 'dd/MM/yyyy')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-neutral-500">
              No hay eventos para este día.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OccupancyCalendar;