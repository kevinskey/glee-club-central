
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
import { Header } from '@/components/landing/Header';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';

export default function EnhancedCalendarPage() {
  const { events, loading, error, fetchEvents } = useCalendarEvents();
  const { isAuthenticated } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Filter to show public events, and member/private events if authenticated
  const visibleEvents = events.filter(event => {
    if (event.is_public) return true;
    return isAuthenticated && !event.is_private;
  });

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NewsTicker />
        <div className="mobile-container mobile-section-padding">
          <PageHeader
            title="Performance Schedule"
            description="View our upcoming performances and events"
            icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
          />
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-spelman mx-auto"></div>
              <p className="mt-4 text-muted-foreground text-sm sm:text-base">Loading calendar...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NewsTicker />
        <div className="mobile-container mobile-section-padding">
          <PageHeader
            title="Performance Schedule"
            description="View our upcoming performances and events"
            icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
          />
          <Card className="mt-6">
            <CardContent className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="text-red-600 text-center">
                <p className="font-semibold text-sm sm:text-base">Error loading calendar</p>
                <p className="text-xs sm:text-sm mt-1">{error}</p>
              </div>
              <Button onClick={fetchEvents} variant="outline" className="mobile-touch-target">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <Header />
      
      {/* News Ticker */}
      <NewsTicker />
      
      <div className="mobile-container mobile-section-padding space-y-6 mobile-scroll">
        {/* Header with Join Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <PageHeader
            title="Performance Schedule"
            description={`View ${isAuthenticated ? 'all events and performances' : 'upcoming public performances and events'}`}
            icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
          />
          
          {!isAuthenticated && (
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
          )}
        </div>

        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-glee-spelman/5 to-glee-purple/5 border-glee-spelman/20 dark:from-glee-spelman/10 dark:to-glee-purple/10 dark:border-glee-spelman/30">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-glee-spelman dark:text-blue-400 mb-2">
              {isAuthenticated ? 'Welcome Back!' : 'Welcome, Music Lovers!'}
            </h2>
            <p className="text-muted-foreground dark:text-gray-300">
              {isAuthenticated 
                ? 'View all events, performances, and member activities. Mark your calendars for upcoming events.'
                : 'Stay up to date with the Spelman College Glee Club\'s upcoming public performances and events. Mark your calendars and join us for unforgettable musical experiences.'
              }
            </p>
          </CardContent>
        </Card>

        {/* Calendar View */}
        {visibleEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-48 space-y-4">
              <Calendar className="h-12 w-12 text-gray-400" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">No Events Found</h3>
                <p className="text-gray-500 mt-2">
                  {isAuthenticated 
                    ? "There are no upcoming events at this time." 
                    : "There are no upcoming public events. Check back soon for new performances!"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <CalendarView
            events={visibleEvents}
            onEventClick={handleEventClick}
            showPrivateEvents={isAuthenticated}
          />
        )}

        {/* Quick Actions for Fans */}
        {!isAuthenticated && (
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
                        <span className="font-medium dark:text-foreground">Merchandise Store</span>
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        Shop official Glee Club merchandise
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
        )}

        {/* Performance Stats */}
        <Card className="dark:bg-card/50 dark:border-border/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-foreground">This Season</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-glee-spelman dark:text-blue-400">
                  {visibleEvents.filter(e => new Date(e.start_time) > new Date()).length}
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Upcoming Shows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-glee-spelman dark:text-blue-400">
                  {visibleEvents.filter(e => e.event_type === 'concert').length}
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Concerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-glee-spelman dark:text-blue-400">
                  {visibleEvents.filter(e => e.event_type === 'community').length}
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Community Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-glee-spelman dark:text-blue-400">
                  {visibleEvents.filter(e => e.event_type === 'performance').length}
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Performances</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        {!isAuthenticated && (
          <Card className="bg-muted/50 dark:bg-muted/20 dark:border-border/50">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
                Want to stay updated? Follow us on social media or join our mailing list.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="ghost" size="sm" asChild className="dark:hover:bg-muted/40">
                  <Link to="/join-glee-fam" className="flex items-center dark:text-foreground">
                    Follow Us
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="dark:hover:bg-muted/40">
                  <Link to="/about" className="dark:text-foreground">
                    About the Glee Club
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <EventDialog
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        canRSVP={isAuthenticated && selectedEvent?.allow_rsvp}
        userRSVP={null}
        onRSVP={() => {}} // Will be implemented when RSVP functionality is needed
      />
    </div>
  );
}
