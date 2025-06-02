
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { TourMerchAssignment } from '@/components/admin/TourMerchAssignment';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Package, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface EventDetails {
  id: string;
  title: string;
  start_time: string;
  location_name: string;
  event_details?: {
    expectedAttendance?: number;
    venueType?: string;
  };
}

export default function TourMerchPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
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
      navigate('/dashboard/events');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="Tour Merch Assignment"
            description="Loading..."
            icon={<Package className="h-6 w-6" />}
          />
          <Card>
            <CardContent className="p-8 text-center">
              Loading event details...
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (!event) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="Tour Merch Assignment"
            description="Event not found"
            icon={<Package className="h-6 w-6" />}
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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
          title="Tour Merch Assignment"
          description={`Assign merchandise for ${event.title}`}
          icon={<Package className="h-6 w-6" />}
        />

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.start_time).toLocaleDateString()} • {event.location_name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <TourMerchAssignment
          eventId={event.id}
          eventTitle={event.title}
          expectedAttendance={event.event_details?.expectedAttendance || 100}
          venueType={event.event_details?.venueType || 'general'}
        />
      </div>
    </AdminLayout>
  );
}
