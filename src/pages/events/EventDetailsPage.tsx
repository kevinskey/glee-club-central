
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventAssignmentManager } from '@/components/admin/EventAssignmentManager';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Package, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissionChecker';

interface EventDetails {
  id: string;
  title: string;
  start_time: string;
  end_time?: string;
  location_name?: string;
  short_description?: string;
  full_description?: string;
  event_types: string[];
  is_public: boolean;
  allow_rsvp: boolean;
  image_url?: string;
  event_details?: any;
}

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setIsLoading(false);
    }
  };

  const canManageTourMerch = () => {
    if (!user || !profile) return false;
    
    const currentUser = {
      ...user,
      role_tags: profile?.role_tags || []
    };
    
    return hasPermission(currentUser, 'manage_shop') || 
           profile?.role_tags?.includes('Tour Manager') ||
           profile?.role_tags?.includes('Merchandise Manager') ||
           profile?.is_super_admin;
  };

  const isPerformanceEvent = () => {
    return event?.event_types?.some(type => 
      ['performance', 'concert', 'tour_concert'].includes(type)
    );
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-8">
        <PageHeader
          title="Event Not Found"
          description="The requested event could not be found"
          icon={<Calendar className="h-6 w-6" />}
        />
        <Card>
          <CardContent className="p-8 text-center">
            <p>Event not found or you don't have permission to access it.</p>
            <Button 
              onClick={() => navigate('/dashboard/events')} 
              className="mt-4"
            >
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/events')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </div>

        <PageHeader
          title={event.title}
          description="Event details and management"
          icon={<Calendar className="h-6 w-6" />}
        />

        {/* Event Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Event Overview</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/dashboard/events/edit/${event.id}`)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Event
                </Button>
                {canManageTourMerch() && isPerformanceEvent() && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/dashboard/tour-merch/${event.id}`)}
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    Manage Tour Merch
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(event.start_time).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(event.start_time).toLocaleTimeString()}</span>
              </div>
              {event.location_name && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{event.is_public ? 'Public Event' : 'Private Event'}</span>
              </div>
            </div>

            {event.event_types.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Event Types:</h4>
                <div className="flex flex-wrap gap-2">
                  {event.event_types.map((type, index) => (
                    <Badge key={index} variant="secondary">
                      {type.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {event.short_description && (
              <div>
                <h4 className="font-medium mb-2">Description:</h4>
                <p className="text-muted-foreground">{event.short_description}</p>
              </div>
            )}

            {event.full_description && (
              <div>
                <h4 className="font-medium mb-2">Full Description:</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.full_description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Management Tabs */}
        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="assignments">Performance Assignments</TabsTrigger>
            <TabsTrigger value="details">Event Details</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments">
            <EventAssignmentManager 
              event={event} 
              onAssignmentsChange={() => {
                // Refresh if needed
              }}
            />
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Event ID:</h4>
                    <p className="text-sm text-muted-foreground font-mono">{event.id}</p>
                  </div>
                  
                  {event.event_details && (
                    <div>
                      <h4 className="font-medium">Additional Details:</h4>
                      <pre className="text-sm text-muted-foreground bg-muted p-2 rounded mt-1">
                        {JSON.stringify(event.event_details, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium">Settings:</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>RSVP Enabled: {event.allow_rsvp ? 'Yes' : 'No'}</p>
                      <p>Public Event: {event.is_public ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
