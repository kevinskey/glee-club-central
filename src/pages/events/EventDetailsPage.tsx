
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Edit, 
  ArrowLeft,
  Download,
  ExternalLink
} from 'lucide-react';
import { getEventTypeLabel, getEventTypeColor } from '@/utils/eventTypes';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, loading } = useCalendarEvents();

  const event = events.find(e => e.id === id);

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50/50">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-purple"></div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (!event) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50/50">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Event Not Found</h2>
                  <p className="text-muted-foreground mt-2">The event you're looking for doesn't exist.</p>
                </div>
                <Button onClick={() => navigate('/admin/calendar')} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  const handleEdit = () => {
    navigate(`/admin/calendar?edit=${event.id}`);
  };

  const handleDownloadICS = () => {
    if (!event.allow_ics_download) return;
    
    // Create ICS file content
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
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin/calendar')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Calendar
              </Button>
              <Button onClick={handleEdit} className="bg-glee-purple hover:bg-glee-purple/90">
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Button>
            </div>
            
            <PageHeader
              title={event.title}
              description={event.short_description}
              icon={<Calendar className="h-6 w-6" />}
            />

            {/* Event Types */}
            {event.event_types && event.event_types.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {event.event_types.map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className={`${getEventTypeColor(type)}`}
                  >
                    {getEventTypeLabel(type)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Event Image */}
          {event.feature_image_url && (
            <Card>
              <CardContent className="p-0">
                <img 
                  src={event.feature_image_url} 
                  alt={event.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Main Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Event Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-glee-purple" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Start:</span>
                    <span className="ml-2">{format(new Date(event.start_time), 'PPP p')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">End:</span>
                    <span className="ml-2">{format(new Date(event.end_time), 'PPP p')}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {event.full_description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {event.full_description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Location */}
              {event.location_name && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-glee-purple" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">{event.location_name}</p>
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
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Host Information */}
              {(event.event_host_name || event.event_host_contact) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-glee-purple" />
                      Event Host
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {event.event_host_name && (
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.event_host_name}</span>
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

              {/* Event Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Private Event</span>
                    <Badge variant={event.is_private ? "default" : "secondary"}>
                      {event.is_private ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>RSVP Enabled</span>
                    <Badge variant={event.allow_rsvp ? "default" : "secondary"}>
                      {event.allow_rsvp ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Reminders</span>
                    <Badge variant={event.allow_reminders ? "default" : "secondary"}>
                      {event.allow_reminders ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {event.allow_ics_download && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleDownloadICS}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download to Calendar
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
