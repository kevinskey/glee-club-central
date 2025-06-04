import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Search, Filter, Plus, Edit, Trash2, CalendarDays, X, Settings } from 'lucide-react';
import { AdminCalendarView } from '@/components/calendar/AdminCalendarView';
import { CalendarViewToggle } from '@/components/calendar/CalendarViewToggle';
import { EventTypeFilter } from '@/components/calendar/EventTypeFilter';
import { EventCategoryFilter } from '@/components/calendar/EventCategoryFilter';
import { EventEditor } from '@/components/admin/EventEditor';
import { useAuth } from '@/contexts/AuthContext';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/types/calendar';
import { toast } from 'sonner';

export default function AdminCalendarPage() {
  const { user, profile, isLoading } = useAuth();
  const { createEvent } = useCalendarEvents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  
  // Category filter state - all enabled by default
  const [enabledCategories, setEnabledCategories] = useState([
    'rehearsal', 'performance', 'meeting', 'event', 'academic', 'holiday', 'religious', 'travel'
  ]);

  // Event creation state
  const [isEventEditorOpen, setIsEventEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

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

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    setEnabledCategories(prev => 
      enabled 
        ? [...prev, categoryId]
        : prev.filter(id => id !== categoryId)
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedEventType('all');
  };

  const handleCreateEvent = () => {
    console.log('Opening event editor for new event');
    setEditingEvent(null);
    setIsEventEditorOpen(true);
  };

  const handleSaveNewEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    try {
      console.log('Creating new event:', eventData);
      await createEvent(eventData);
      toast.success('Event created successfully');
      setIsEventEditorOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleCloseEditor = () => {
    console.log('Closing event editor');
    setIsEventEditorOpen(false);
    setEditingEvent(null);
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-glee-spelman/10 rounded-xl">
            <CalendarDays className="h-8 w-8 text-glee-spelman" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Event Calendar Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
              Manage events, performances, rehearsals, and important dates
            </p>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                <Calendar className="h-3 w-3 mr-1" />
                {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} View
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Users className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Categories
            {enabledCategories.length < 8 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {8 - enabledCategories.length} hidden
              </Badge>
            )}
          </Button>
          <Button 
            onClick={handleCreateEvent}
            className="bg-glee-spelman hover:bg-glee-spelman/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Category Filter Panel */}
      {showCategoryFilter && (
        <EventCategoryFilter
          enabledCategories={enabledCategories}
          onCategoryToggle={handleCategoryToggle}
        />
      )}

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
            {enabledCategories.length < 8 && (
              <Badge variant="outline" className="text-xs ml-2">
                {8 - enabledCategories.length} categories hidden
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AdminCalendarView 
            view={selectedView}
            searchQuery={searchQuery}
            selectedEventType={selectedEventType}
            enabledCategories={enabledCategories}
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

      {/* Event Editor Dialog */}
      <EventEditor
        event={editingEvent}
        isOpen={isEventEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveNewEvent}
      />
    </div>
  );
}
