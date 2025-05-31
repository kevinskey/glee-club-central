import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ExternalLink,
  Download,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { EventRSVPForm } from '@/components/events/EventRSVPForm';

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  canRSVP?: boolean;
  userRSVP?: 'going' | 'maybe' | 'not_going' | null;
  onRSVP?: (status: 'going' | 'maybe' | 'not_going') => void;
  adminActions?: React.ReactNode;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  event,
  isOpen,
  onClose,
  canRSVP = false,
  userRSVP,
  onRSVP,
  adminActions
}) => {
  if (!event) return null;

  const handleDownloadICS = () => {
    if (!event.allow_ics_download) return;
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Glee Club//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${new Date(event.start_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(event.end_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.full_description || event.short_description || ''}
LOCATION:${event.location_name || ''}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Types */}
          {event.event_types && event.event_types.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.event_types.map((type) => (
                <Badge key={type} variant="outline">
                  {type.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Event Details */}
            <div className="space-y-4">
              {/* Date & Time */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Start:</span>
                  <span>{format(new Date(event.start_time), 'PPP p')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">End:</span>
                  <span>{format(new Date(event.end_time), 'PPP p')}</span>
                </div>
              </div>

              {/* Location */}
              {event.location_name && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span>
                    <span>{event.location_name}</span>
                  </div>
                  {event.location_map_url && event.allow_google_map_link && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(event.location_map_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  )}
                </div>
              )}

              {/* Description */}
              {event.full_description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {event.full_description}
                  </p>
                </div>
              )}

              {/* Host Information */}
              {(event.event_host_name || event.event_host_contact) && (
                <div className="space-y-2">
                  <h4 className="font-medium">Event Host</h4>
                  {event.event_host_name && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{event.event_host_name}</span>
                    </div>
                  )}
                  {event.event_host_contact && (
                    <div className="flex items-center gap-2">
                      {event.event_host_contact.includes('@') ? (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{event.event_host_contact}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {event.allow_ics_download && (
                  <Button variant="outline" onClick={handleDownloadICS}>
                    <Download className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                )}
              </div>
            </div>

            {/* Right Column - RSVP Form */}
            <div>
              {event.allow_rsvp && (event.is_public || canRSVP) && (
                <EventRSVPForm event={event} />
              )}
            </div>
          </div>

          {/* Admin Actions */}
          {adminActions && (
            <>
              <Separator />
              {adminActions}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
