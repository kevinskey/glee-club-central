
export const EVENT_TYPES = [
  { value: 'event', label: 'Event' },
  { value: 'rehearsal', label: 'Rehearsal' },
  { value: 'performance', label: 'Performance' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'social', label: 'Social Event' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'audition', label: 'Audition' },
  { value: 'fundraiser', label: 'Fundraiser' },
  { value: 'competition', label: 'Competition' },
  { value: 'masterclass', label: 'Master Class' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'academic', label: 'Academic Date' },
] as const;

export type EventType = typeof EVENT_TYPES[number]['value'];

export const getEventTypeLabel = (type: string): string => {
  const eventType = EVENT_TYPES.find(t => t.value === type);
  return eventType?.label || type;
};

export const getEventTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    event: 'text-gray-700 bg-gray-100 border-gray-300',
    rehearsal: 'text-blue-700 bg-blue-100 border-blue-300',
    performance: 'text-green-700 bg-green-100 border-green-300',
    meeting: 'text-purple-700 bg-purple-100 border-purple-300',
    social: 'text-pink-700 bg-pink-100 border-pink-300',
    workshop: 'text-orange-700 bg-orange-100 border-orange-300',
    audition: 'text-red-700 bg-red-100 border-red-300',
    fundraiser: 'text-yellow-700 bg-yellow-100 border-yellow-300',
    competition: 'text-indigo-700 bg-indigo-100 border-indigo-300',
    masterclass: 'text-cyan-700 bg-cyan-100 border-cyan-300',
    outreach: 'text-green-700 bg-green-100 border-green-300',
    holiday: 'text-red-700 bg-red-100 border-red-300',
    academic: 'text-blue-700 bg-blue-100 border-blue-300',
  };
  
  return colorMap[type] || 'text-gray-700 bg-gray-100 border-gray-300';
};
