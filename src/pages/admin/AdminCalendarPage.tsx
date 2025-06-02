
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Search, Filter, Plus, Edit, Trash2, CalendarDays, X } from 'lucide-react';
import { AdminCalendarView } from '@/components/calendar/AdminCalendarView';
import { CalendarViewToggle } from '@/components/calendar/CalendarViewToggle';
import { EventTypeFilter } from '@/components/calendar/EventTypeFilter';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminCalendarPage() {
  const { user, profile, isLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEventType, setSelectedEventType] = useState('all');

  useEffect(() => {
    if (user && profile) {
      console.log('AdminCalendarPage: User and profile loaded', { user, profile });
    } else {
      console.log('AdminCalendarPage: Loading or missing user/profile');
    }
  }, [user, profile]);

  const handleViewChange = (view: string) => {
    if (view === 'month' || view === 'week' || view === 'day') {
      setSelectedView(view);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedEventType('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedEventType !== 'all';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-spelman mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-glee-spelman/10 rounded-lg">
              <CalendarDays className="h-6 w-6 text-glee-spelman" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Event Calendar
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage events, performances, and rehearsals
              </p>
            </div>
          </div>
          
          <Button className="bg-glee-spelman hover:bg-glee-spelman/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Enhanced Search and Filters Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Section */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search events by title, description, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 h-12 text-base"
                      />
                      {searchQuery && (
                        <button
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Filter and View Controls */}
                  <div className="flex items-center gap-3">
                    <EventTypeFilter
                      selectedEventType={selectedEventType}
                      onEventTypeChange={setSelectedEventType}
                    />
                    
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                    
                    <CalendarViewToggle
                      selectedView={selectedView}
                      onViewChange={handleViewChange}
                    />
                  </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active filters:
                    </span>
                    
                    {searchQuery.trim() && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: "{searchQuery.trim()}"
                        <button
                          onClick={clearSearch}
                          className="ml-1 hover:text-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    
                    {selectedEventType !== 'all' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Type: {selectedEventType}
                        <button
                          onClick={() => setSelectedEventType('all')}
                          className="ml-1 hover:text-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-glee-spelman" />
                Calendar View - {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AdminCalendarView 
                view={selectedView}
                searchQuery={searchQuery}
                selectedEventType={selectedEventType}
              />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                    <p className="text-xs text-gray-500">Events scheduled</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                    <p className="text-xs text-gray-500">Performances</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                    <p className="text-xs text-gray-500">Rehearsals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
