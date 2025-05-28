
import React, { useState } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, Download, ExternalLink, Users } from 'lucide-react';
import { format } from 'date-fns';

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  canRSVP?: boolean;
  userRSVP?: 'going' | 'maybe' | 'not_going' | null;
  onRSVP?: (status: 'going' | 'maybe' | 'not_going') => void;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  event,
  isOpen,
  onClose,
  canRSVP = false,
  userRSVP,
  onRSVP
}) => {
  const [rsvpLoading, setRsvpLoading] = useState(false);

  if (!event) return null;

  const handleRSVP = async (status: 'going' | 'maybe' | 'not_going') => {
    setRsvpLoading(true);
    try {
      await onRSVP?.(status);
    } finally {
      setRsvpLoading(false);
    }
  };

  const downloadICS = () => {
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Glee World//Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@gleeworld.com`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.full_description || event.short_description || ''}`,
      event.location_name ? `LOCATION:${event.location_name}` : '',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
            {event.is_private && (
              <Badge variant="secondary">Private</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {event.feature_image_url && (
            <img 
              src={event.feature_image_url} 
              alt={event.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <div>
                <div>{format(new Date(event.start_time), 'EEEE, MMMM d, yyyy')}</div>
                <div>{format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}</div>
              </div>
            </div>

            {event.location_name && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <div>
                  {event.location_name}
                  {event.allow_google_map_link && event.location_map_url && (
                    <a 
                      href={event.location_map_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {event.event_host_name && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                {event.event_host_name}
                {event.event_host_contact && (
                  <span className="text-muted-foreground">({event.event_host_contact})</span>
                )}
              </div>
            )}
          </div>

          {event.short_description && (
            <p className="text-muted-foreground">{event.short_description}</p>
          )}

          {event.full_description && (
            <div className="prose prose-sm max-w-none">
              <p>{event.full_description}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {event.allow_ics_download && (
              <Button variant="outline" onClick={downloadICS}>
                <Download className="h-4 w-4 mr-2" />
                Download Calendar
              </Button>
            )}

            {event.allow_rsvp && canRSVP && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium mr-2">RSVP:</span>
                <Button
                  size="sm"
                  variant={userRSVP === 'going' ? 'default' : 'outline'}
                  onClick={() => handleRSVP('going')}
                  disabled={rsvpLoading}
                >
                  Going
                </Button>
                <Button
                  size="sm"
                  variant={userRSVP === 'maybe' ? 'default' : 'outline'}
                  onClick={() => handleRSVP('maybe')}
                  disabled={rsvpLoading}
                >
                  Maybe
                </Button>
                <Button
                  size="sm"
                  variant={userRSVP === 'not_going' ? 'default' : 'outline'}
                  onClick={() => handleRSVP('not_going')}
                  disabled={rsvpLoading}
                >
                  Can't Go
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
