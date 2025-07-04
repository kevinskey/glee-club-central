import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useEventRSVPs } from '@/hooks/useEventRSVPs';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft, 
  ExternalLink,
  Download,
  Users,
  Edit
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { EventRSVPForm } from '@/components/events/EventRSVPForm';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import ErrorBoundary from '@/components/ErrorBoundary';

function EventDetailPageContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, loading } = useCalendarEvents();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const { rsvpStats } = useEventRSVPs(id);

  useEffect(() => {
    if (events.length > 0 && id) {
      const foundEvent = events.find(e => e.id === id);
      setEvent(foundEvent || null);
    }
  }, [events, id]);

  const formatEventDate = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isSameDay(start, end)) {
      return `${format(start, 'EEEE, MMMM d, yyyy')} • ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    } else {
      return `${format(start, 'EEEE, MMMM d, yyyy, h:mm a')} - ${format(end, 'EEEE, MMMM d, yyyy, h:mm a')}`;
    }
  };

  const handleDownloadICS = () => {
    if (!event || !event.allow_ics_download) return;
    
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

  const getEventTypeColor = (eventType?: string) => {
    switch (eventType) {
      case 'concert':
      case 'performance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rehearsal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'community':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'tour':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportRSVPsToCSV = () => {
    if (!event || !isAdmin) return;
    
    // This would typically fetch detailed RSVP data
    const csvContent = `Name,Email,Status,Created At\n`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title}_rsvps.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="mobile-container mobile-section-padding">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-spelman mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mobile-container mobile-section-padding">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
            <Calendar className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <h2 className="text-xl font-semibold">Event Not Found</h2>
              <p className="text-muted-foreground mt-2">The event you're looking for doesn't exist or may have been removed.</p>
            </div>
            <Button onClick={() => navigate('/calendar')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mobile-container mobile-section-padding space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/calendar')}
          className="text-muted-foreground hover:text-foreground mobile-touch-target"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calendar
        </Button>
        
        {isAdmin && (
          <Link to={`/admin/calendar?edit=${event.id}`}>
            <Button variant="outline" size="sm" className="mobile-touch-target">
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Button>
          </Link>
        )}
      </div>
      
      <PageHeader
        title={event.title}
        description={event.short_description}
        icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
      />

      {/* Event Types */}
      <div className="flex flex-wrap gap-2">
        {event.event_types?.map((type) => (
          <Badge
            key={type}
            variant="outline"
            className={getEventTypeColor(type)}
          >
            {type.replace('_', ' ')}
          </Badge>
        )) || (event.event_type && (
          <Badge
            variant="outline"
            className={getEventTypeColor(event.event_type)}
          >
            {event.event_type.replace('_', ' ')}
          </Badge>
        ))}
        {event.is_private && (
          <Badge variant="secondary">Private Event</Badge>
        )}
      </div>

      {/* Event Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Event Image */}
          {event.feature_image_url && (
            <Card>
              <CardContent className="p-0">
                <img 
                  src={event.feature_image_url} 
                  alt={event.title}
                  className="w-full h-48 sm:h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {event.full_description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {event.full_description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Clock className="h-5 w-5 mr-2 text-glee-spelman" />
                When
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                {formatEventDate(event.start_time, event.end_time)}
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          {event.location_name && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <MapPin className="h-5 w-5 mr-2 text-glee-spelman" />
                  Where
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 font-medium text-sm sm:text-base">{event.location_name}</p>
                {event.location_map_url && event.allow_google_map_link && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(event.location_map_url, '_blank')}
                    className="mobile-touch-target"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Google Maps
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Host Information */}
          {(event.event_host_name || event.event_host_contact) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <User className="h-5 w-5 mr-2 text-glee-spelman" />
                  Host
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.event_host_name && (
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{event.event_host_name}</span>
                  </div>
                )}
                {event.event_host_contact && (
                  <div className="flex items-center text-sm">
                    {event.event_host_contact.includes('@') ? (
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <span>{event.event_host_contact}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.allow_ics_download && (
                <Button 
                  variant="outline" 
                  className="w-full mobile-touch-target"
                  onClick={handleDownloadICS}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full mobile-touch-target"
                onClick={() => navigate('/calendar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View All Events
              </Button>
            </CardContent>
          </Card>

          {/* Admin Info */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Users className="h-5 w-5 mr-2 text-glee-spelman" />
                  Admin Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Total RSVPs: </span>
                  <span>{rsvpStats.total}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{rsvpStats.going}</div>
                    <div className="text-muted-foreground">Going</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-yellow-600">{rsvpStats.maybe}</div>
                    <div className="text-muted-foreground">Maybe</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">{rsvpStats.notGoing}</div>
                    <div className="text-muted-foreground">Can't Go</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/events/${event.id}/rsvps`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full mobile-touch-target">
                      <Users className="h-4 w-4 mr-2" />
                      View RSVPs
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={exportRSVPsToCSV}
                    className="mobile-touch-target"
                  >
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* RSVP Form */}
          {event.allow_rsvp && event.is_public && (
            <EventRSVPForm event={event} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  return (
    <ErrorBoundary>
      <EventDetailPageContent />
    </ErrorBoundary>
  );
}
