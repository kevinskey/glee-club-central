
import React from 'react';
import { Music, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { HeroSection } from '@/components/landing/HeroSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UpcomingEvents } from '@/components/calendar/UpcomingEvents';
import { EventsSlider } from '@/components/landing/events/EventsSlider';
import { PerformanceSection } from '@/components/landing/performance/PerformanceSection';

const HomePage = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-cover bg-center flex flex-col"
           style={{ backgroundImage: isMobile ? "none" : "url('/lovable-uploads/b57ced8e-7ed7-405b-8302-41ab726303af.png')" }}>
        {/* Semi-transparent overlay */}
        {!isMobile && <div className="absolute inset-0 bg-black/70 z-0"></div>}
        
        {/* Display hero section on mobile */}
        {isMobile && <HeroSection />}
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12 z-10 relative flex-1 flex flex-col">
          <main className={`flex-1 flex flex-col items-center justify-start ${isMobile ? "text-foreground" : "text-white"}`}>
            {!isMobile && (
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Spelman College Glee Club
                </h1>
                <p className="text-xl mb-8 text-white/80">
                  Welcome to the central digital hub for the Spelman College Glee Club. 
                  Manage sheet music, attendance, calendar events, and more in one seamless platform.
                </p>
              </div>
            )}
            
            {/* Upcoming Events Section - More compact on mobile */}
            <div className={`w-full mt-4 md:mt-8 mb-6 md:mb-12 ${isMobile ? "bg-white dark:bg-gray-800 py-4 px-4 rounded-lg shadow-sm" : "bg-white/5 backdrop-blur-sm p-6 rounded-lg"}`}>
              <UpcomingEvents />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mt-4 md:mt-8">
              <Card className={`${isMobile ? "bg-card" : "bg-white/10 backdrop-blur border-none text-white"}`}>
                <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                  <Music className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 text-glee-purple" />
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Sheet Music</h3>
                  <p className={isMobile ? "text-muted-foreground text-sm" : "text-white/80 text-sm md:text-base"}>Access your sheet music library organized by section</p>
                </CardContent>
              </Card>
              
              <Card className={`${isMobile ? "bg-card" : "bg-white/10 backdrop-blur border-none text-white"}`}>
                <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                  <Calendar className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 text-glee-purple" />
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Events</h3>
                  <p className={isMobile ? "text-muted-foreground text-sm" : "text-white/80 text-sm md:text-base"}>Track rehearsals and performances in one place</p>
                </CardContent>
              </Card>
              
              <Card className={`${isMobile ? "bg-card" : "bg-white/10 backdrop-blur border-none text-white"}`}>
                <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                  <Users className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 text-glee-purple" />
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Members</h3>
                  <p className={isMobile ? "text-muted-foreground text-sm" : "text-white/80 text-sm md:text-base"}>Connect with other members of the Glee Club</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      
      {/* Add performance section outside the hero area */}
      <PerformanceSection />
      
      {/* Add events slider section */}
      <EventsSlider />
    </SidebarProvider>
  );
};

export default HomePage;
