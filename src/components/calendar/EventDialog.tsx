
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, ExternalLink, Download } from 'lucide-react';
import { format } from 'date-fns';

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  canRSVP?: boolean;
  onRSVP?: (status: 'going' | 'maybe' | 'not_going') => void;
  adminActions?: React.ReactNode;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  event,
  isOpen,
  onClose,
  canRSVP = false,
  onRSVP,
  adminActions
}) => {
  if (!event) return null;

  const formatEventDate = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const startDate = format(start, 'PPP');
    const startTimeStr = format(start, 'p');
    const endTimeStr = format(end, 'p');
    
    return `${startDate} from ${startTimeStr} to ${endTimeStr}`;
  };

  const handleMapClick = () => {
    if (event.location_map_url) {
      window.open(event.location_map_url, '_blank');
    } else if (event.location_name) {
      const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(event.location_name)}`;
      window.open(mapUrl, '_blank');
    }
  };

  const generateICSFile = () => {
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Spelman Glee Club//Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@spelman-glee.com`,
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.short_description || ''}`,
      `LOCATION:${event.location_name || ''}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Image */}
          {event.feature_image_url && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <img 
                src={event.feature_image_url} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Event Status */}
          <div className="flex gap-2">
            {event.is_private && (
              <Badge variant="secondary">Members Only</Badge>
            )}
            {event.allow_rsvp && (
              <Badge variant="outline">RSVP Enabled</Badge>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Date & Time</p>
              <p className="text-muted-foreground">
                {formatEventDate(event.start_time, event.end_time)}
              </p>
            </div>
          </div>

          {/* Location */}
          {event.location_name && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground">{event.location_name}</p>
                {(event.allow_google_map_link && (event.location_map_url || event.location_name)) && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto"
                    onClick={handleMapClick}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View on Map
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Host Information */}
          {event.event_host_name && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Host</p>
                <p className="text-muted-foreground">{event.event_host_name}</p>
                {event.event_host_contact && (
                  <p className="text-sm text-muted-foreground">{event.event_host_contact}</p>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {event.short_description && (
            <div>
              <p className="font-medium mb-2">Description</p>
              <p className="text-muted-foreground">{event.short_description}</p>
            </div>
          )}

          {/* Full Description */}
          {event.full_description && event.full_description !== event.short_description && (
            <div>
              <p className="font-medium mb-2">Details</p>
              <p className="text-muted-foreground whitespace-pre-wrap">{event.full_description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {/* RSVP Actions */}
            {canRSVP && event.allow_rsvp && onRSVP && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onRSVP('going')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Going
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRSVP('maybe')}
                >
                  Maybe
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRSVP('not_going')}
                >
                  Can't Go
                </Button>
              </div>
            )}

            {/* Download Calendar */}
            {event.allow_ics_download && (
              <Button
                size="sm"
                variant="outline"
                onClick={generateICSFile}
              >
                <Download className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            )}
          </div>

          {/* Admin Actions */}
          {adminActions}
        </div>
      </DialogContent>
    </Dialog>
  );
};
