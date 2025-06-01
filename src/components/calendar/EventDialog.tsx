
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventRSVPForm } from '@/components/events/EventRSVPForm';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, ExternalLink, Download } from 'lucide-react';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';

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
  const { isAuthenticated } = useSimpleAuthContext();

  if (!event) return null;

  const handleDownloadICS = () => {
    if (!event.allow_ics_download) return;
    
    // Create ICS file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Spelman Glee Club//Calendar//EN
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${new Date(event.start_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(event.end_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.short_description || ''}
LOCATION:${event.location_name || ''}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openInGoogleMaps = () => {
    if (event.location_map_url) {
      window.open(event.location_map_url, '_blank');
    } else if (event.location_name) {
      const encodedLocation = encodeURIComponent(event.location_name);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5" />
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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

          {/* Event Types */}
          {event.event_types && event.event_types.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.event_types.map(type => (
                <Badge key={type} variant="secondary">
                  {type.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          )}

          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">
                {format(new Date(event.start_time), 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="text-muted-foreground">
                {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location_name && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="font-medium">{event.location_name}</div>
                {event.allow_google_map_link && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={openInGoogleMaps}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Map
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Host Information */}
          {event.event_host_name && (
            <div className="text-sm">
              <div className="font-medium">Hosted by: {event.event_host_name}</div>
              {event.event_host_contact && (
                <div className="text-muted-foreground">Contact: {event.event_host_contact}</div>
              )}
            </div>
          )}

          {/* Description */}
          {event.short_description && (
            <div className="text-sm">
              <div className="font-medium mb-1">Description</div>
              <div className="text-muted-foreground">{event.short_description}</div>
            </div>
          )}

          {/* Full Description */}
          {event.full_description && (
            <div className="text-sm">
              <div className="font-medium mb-1">Details</div>
              <div className="text-muted-foreground whitespace-pre-wrap">{event.full_description}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {event.allow_ics_download && (
              <Button variant="outline" onClick={handleDownloadICS}>
                <Download className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            )}
            
            {event.allow_google_map_link && event.location_name && (
              <Button variant="outline" onClick={openInGoogleMaps}>
                <MapPin className="h-4 w-4 mr-2" />
                Directions
              </Button>
            )}
          </div>

          {/* RSVP Form - Only show for authenticated users and when RSVP is allowed */}
          {canRSVP && isAuthenticated && event.allow_rsvp && onRSVP && (
            <div className="pt-4 border-t">
              <div className="mb-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  RSVP for this event
                </h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={userRSVP === 'going' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onRSVP('going')}
                >
                  Going
                </Button>
                <Button
                  variant={userRSVP === 'maybe' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onRSVP('maybe')}
                >
                  Maybe
                </Button>
                <Button
                  variant={userRSVP === 'not_going' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onRSVP('not_going')}
                >
                  Can't Go
                </Button>
              </div>
            </div>
          )}

          {/* Admin Actions */}
          {adminActions}
        </div>
      </DialogContent>
    </Dialog>
  );
};
