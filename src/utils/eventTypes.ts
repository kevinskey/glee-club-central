
export const EVENT_TYPES = [
  { value: 'concert', label: 'Concert' },
  { value: 'tour_concert', label: 'Tour Concert' },
  { value: 'rehearsal', label: 'Rehearsal' },
  { value: 'sectional', label: 'Sectional' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'outing', label: 'Outing' },
  { value: 'community_service', label: 'Community Service' },
  { value: 'social_event', label: 'Social Event' },
];

export const getEventTypeLabel = (value: string): string => {
  const eventType = EVENT_TYPES.find(type => type.value === value);
  return eventType?.label || value;
};

export const getEventTypeColor = (value: string): string => {
  const colors: Record<string, string> = {
    concert: 'bg-purple-100 text-purple-800 border-purple-300',
    tour_concert: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    rehearsal: 'bg-blue-100 text-blue-800 border-blue-300',
    sectional: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    meeting: 'bg-green-100 text-green-800 border-green-300',
    outing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    community_service: 'bg-orange-100 text-orange-800 border-orange-300',
    social_event: 'bg-pink-100 text-pink-800 border-pink-300',
  };
  
  return colors[value] || 'bg-gray-100 text-gray-800 border-gray-300';
};
