
import React from 'react';
import { EventType } from '@/types/calendar';

export const EventContent = (eventInfo: any) => {
  const { event } = eventInfo;
  const type: EventType = event.extendedProps.type || 'special';
  
  const getEventClassByType = (type: EventType): string => {
    switch (type) {
      case 'concert':
        return 'bg-glee-purple text-white';
      case 'rehearsal':
        return 'bg-blue-500 text-white';
      case 'sectional':
        return 'bg-green-500 text-white';
      case 'tour':
        return 'bg-amber-500 text-white';
      case 'special':
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`p-1 text-xs rounded-sm ${getEventClassByType(type)}`}>
      <div className="font-medium">{event.title}</div>
      {event.extendedProps.location && (
        <div className="text-xs opacity-90">{event.extendedProps.location}</div>
      )}
    </div>
  );
};
