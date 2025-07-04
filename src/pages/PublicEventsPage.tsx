
import React, { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventDialog } from '@/components/calendar/EventDialog';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/types/calendar';
import { PageHeader } from '@/components/ui/page-header';
import { Calendar, ShoppingBag, Phone, ExternalLink, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NewsTicker } from '@/components/landing/news/NewsTicker';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function PublicEventsPage() {
  const { events, loading, error, fetchEvents } = useCalendarEvents();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Filter to only show public events
  const publicEvents = events.filter(event => !event.is_private);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  if (loading) {
    return (
      <div className="mobile-container mobile-section-padding">
        <div className="flex justify-between items-start mb-6">
          <PageHeader
            title="Performance Schedule"
            description="View our upcoming public performances and events"
            icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
          />
        </div>
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="text-muted-foreground text-sm sm:text-base">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobile-container mobile-section-padding">
        <div className="flex justify-between items-start mb-6">
          <PageHeader
            title="Performance Schedule"
            description="View our upcoming public performances and events"
            icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
          />
        </div>
        <div className="flex flex-col items-center justify-center h-48 sm:h-64 space-y-4">
          <div className="text-red-600 text-center">
            <p className="font-semibold text-sm sm:text-base">Error loading events</p>
            <p className="text-xs sm:text-sm mt-1">{error}</p>
          </div>
          <Button onClick={fetchEvents} variant="outline" className="mobile-touch-target">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* News Ticker */}
      <NewsTicker />
      
      <div className="mobile-container mobile-section-padding space-y-6 mobile-scroll">
        {/* Header with Glowing Join Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <PageHeader
            title="Performance Schedule"
            description="View our upcoming public performances and events"
            icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  asChild
                  className="relative bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group light-blue-glow"
                >
                  <Link to="/join-glee-fam" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Join the Glee Fam!</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Receive up-to-date news about the glee club!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-glee-spelman/5 to-glee-purple/5 border-glee-spelman/20 dark:from-glee-spelman/10 dark:to-glee-purple/10 dark:border-glee-spelman/30">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-glee-spelman dark:text-blue-400 mb-2">
              Welcome, Music Lovers!
            </h2>
            <p className="text-muted-foreground dark:text-gray-300">
              Stay up to date with the Spelman College Glee Club's upcoming public performances and events. 
              Mark your calendars and join us for unforgettable musical experiences.
            </p>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <CalendarView
          events={publicEvents}
          onEventClick={handleEventClick}
          showPrivateEvents={false}
          viewMode={viewMode}
        />

        {/* Quick Actions for Fans */}
        <Card className="dark:bg-card/50 dark:border-border/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center dark:text-foreground">
              <ShoppingBag className="h-5 w-5 mr-2 text-glee-spelman dark:text-blue-400" />
              Connect With Us
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Merchandise Store */}
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start text-left hover:bg-glee-spelman/5 hover:border-glee-spelman/50 dark:hover:bg-blue-400/10 dark:hover:border-blue-400/50 dark:border-border"
                asChild
              >
                <Link to="/store" className="block">
                  <div>
                    <div className="flex items-center mb-1">
                      <ShoppingBag className="h-4 w-4 mr-2 text-glee-spelman dark:text-blue-400" />
                      <span className="font-medium dark:text-foreground">Glee Store</span>
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      Discover our new Square-powered store
                    </p>
                  </div>
                </Link>
              </Button>

              {/* Contact Us */}
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start text-left hover:bg-glee-spelman/5 hover:border-glee-spelman/50 dark:hover:bg-blue-400/10 dark:hover:border-blue-400/50 dark:border-border"
                asChild
              >
                <Link to="/contact" className="block">
                  <div>
                    <div className="flex items-center mb-1">
                      <Phone className="h-4 w-4 mr-2 text-glee-spelman dark:text-blue-400" />
                      <span className="font-medium dark:text-foreground">Contact Us</span>
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      Get in touch with the Glee Club
                    </p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card className="dark:bg-card/50 dark:border-border/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-foreground">This Season</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-glee-spelman dark:text-blue-400">
                  {publicEvents.filter(e => new Date(e.start_time) > new Date()).length}
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Upcoming Shows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-glee-spelman dark:text-blue-400">
                  {publicEvents.filter(e => e.event_type === 'concert').length}
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Concerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-glee-spelman dark:text-blue-400">
                  {publicEvents.filter(e => e.event_type === 'community').length}
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Community Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-glee-spelman dark:text-blue-400">
                  {publicEvents.filter(e => e.event_type === 'performance').length}
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Performances</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <Card className="bg-muted/50 dark:bg-muted/20 dark:border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
              Want to stay updated? Follow us on social media or join our mailing list.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="ghost" size="sm" asChild className="dark:hover:bg-muted/40">
                <Link to="/social" className="flex items-center dark:text-foreground">
                  Follow Us
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="dark:hover:bg-muted/40">
                <Link to="/about" className="dark:text-foreground">
                  About the Glee Club
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="dark:hover:bg-muted/40">
                <Link to="/press-kit" className="dark:text-foreground">
                  Press Kit
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <EventDialog
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        canRSVP={false} // Public users cannot RSVP
        userRSVP={null}
        onRSVP={() => {}} // No-op for public users
      />
    </div>
  );
}
