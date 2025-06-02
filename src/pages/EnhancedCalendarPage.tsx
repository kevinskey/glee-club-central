import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Search, Filter, Plus } from 'lucide-react';
import { EnhancedCalendarView } from '@/components/calendar/EnhancedCalendarView';
import { CalendarViewToggle } from '@/components/calendar/CalendarViewToggle';
import { EventTypeFilter } from '@/components/calendar/EventTypeFilter';
import { UpcomingEventsList } from '@/components/calendar/UpcomingEventsList';
import { HolidayCard } from '@/components/calendar/HolidayCard';
import { SpelmanDateCard } from '@/components/calendar/SpelmanDateCard';
import { useAuth } from '@/contexts/AuthContext';

export default function EnhancedCalendarPage() {
  const { user, profile, isLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [calendarView, setCalendarView] = useState('month');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleEventType = (type: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Glee Club Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setActiveTab('all')}>
                All Events
              </TabsTrigger>
              <TabsTrigger value="performances" onClick={() => setActiveTab('performances')}>
                Performances
              </TabsTrigger>
              <TabsTrigger value="rehearsals" onClick={() => setActiveTab('rehearsals')}>
                Rehearsals
              </TabsTrigger>
              <TabsTrigger value="socials" onClick={() => setActiveTab('socials')}>
                Social Events
              </TabsTrigger>
            </TabsList>
            <div className="md:flex justify-between items-center">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="max-w-md"
                />
              </div>
              <div className="mt-2 md:mt-0">
                <CalendarViewToggle view={calendarView} setView={setCalendarView} />
              </div>
            </div>
            <TabsContent value="all" className="space-y-2">
              <div className="flex items-center space-x-2">
                <EventTypeFilter
                  selectedEventTypes={selectedEventTypes}
                  toggleEventType={toggleEventType}
                />
              </div>
              <EnhancedCalendarView
                searchQuery={searchQuery}
                activeTab={activeTab}
                calendarView={calendarView}
                selectedEventTypes={selectedEventTypes}
              />
            </TabsContent>
            <TabsContent value="performances">
              <div>Performances Content</div>
            </TabsContent>
            <TabsContent value="rehearsals">
              <div>Rehearsals Content</div>
            </TabsContent>
            <TabsContent value="socials">
              <div>Socials Content</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <HolidayCard />
        <SpelmanDateCard />
      </div>

      <div className="mt-6">
        <UpcomingEventsList />
      </div>
    </div>
  );
}
