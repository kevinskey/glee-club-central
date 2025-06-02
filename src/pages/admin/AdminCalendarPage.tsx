import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { EnhancedCalendarView } from '@/components/calendar/EnhancedCalendarView';
import { CalendarViewToggle } from '@/components/calendar/CalendarViewToggle';
import { EventTypeFilter } from '@/components/calendar/EventTypeFilter';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminCalendarPage() {
  const { user, profile, isLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState('month');
  const [selectedEventType, setSelectedEventType] = useState('all');

  useEffect(() => {
    if (user && profile) {
      console.log('AdminCalendarPage: User and profile loaded', { user, profile });
    } else {
      console.log('AdminCalendarPage: Loading or missing user/profile');
    }
  }, [user, profile]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Admin Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Top Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="md:w-64"
                />
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <CalendarViewToggle
                  selectedView={selectedView}
                  onViewChange={setSelectedView}
                />
                <EventTypeFilter
                  selectedEventType={selectedEventType}
                  onEventTypeChange={setSelectedEventType}
                />
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>

            {/* Calendar View */}
            <EnhancedCalendarView view={selectedView} />

            {/* Bottom Controls - Example Actions */}
            <div className="flex items-center justify-end space-x-2">
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
