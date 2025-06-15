
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { EventRSVPManager } from '@/components/admin/EventRSVPManager';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function EventRSVPsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, loading } = useCalendarEvents();

  const event = events.find(e => e.id === id);

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50/50">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
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
          <div className="container mx-auto px-4 py-6 max-w-7xl">
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
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
            </div>
            
            <PageHeader
              title={`RSVPs: ${event.title}`}
              description={`Manage attendee list and RSVPs for this event`}
              icon={<Users className="h-6 w-6" />}
            />
          </div>

          {/* RSVP Manager */}
          <EventRSVPManager eventId={event.id} eventTitle={event.title} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
