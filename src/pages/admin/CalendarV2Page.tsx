import React, { useState, useEffect } from 'react';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit, Trash2, MapPin, Clock, Users, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

interface Event {
  id: string;
  title: string;
  event_type: string;
  start_time: string;
  end_time: string;
  location_name?: string;
  short_description?: string;
  full_description?: string;
  allow_rsvp: boolean;
  is_public: boolean;
  created_by: string;
  created_at: string;
}

interface RSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'not_going' | 'maybe';
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

const EVENT_TYPES = [
  'rehearsal',
  'sectional', 
  'performance',
  'tour',
  'social',
  'workshop',
  'meeting',
  'other'
];

export default function CalendarV2Page() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month' | 'list'>('week');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    event_type: '',
    start_time: '',
    end_time: '',
    location_name: '',
    short_description: '',
    full_description: '',
    allow_rsvp: true,
    is_public: true
  });

  useEffect(() => {
    fetchEvents();
    fetchRSVPs();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRSVPs = async () => {
    try {
      const { data, error } = await supabase
        .from('event_rsvps')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `);

      if (error) throw error;
      setRSVPs(data || []);
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.start_time || !eventForm.end_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventForm,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Event created successfully');
      setIsEventDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    try {
      const { error } = await supabase
        .from('events')
        .update(eventForm)
        .eq('id', editingEvent.id);

      if (error) throw error;

      toast.success('Event updated successfully');
      setIsEventDialogOpen(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      event_type: '',
      start_time: '',
      end_time: '',
      location_name: '',
      short_description: '',
      full_description: '',
      allow_rsvp: true,
      is_public: true
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingEvent(null);
    setIsEventDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEventForm({
      title: event.title,
      event_type: event.event_type,
      start_time: event.start_time,
      end_time: event.end_time,
      location_name: event.location_name || '',
      short_description: event.short_description || '',
      full_description: event.full_description || '',
      allow_rsvp: event.allow_rsvp,
      is_public: event.is_public
    });
    setEditingEvent(event);
    setIsEventDialogOpen(true);
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      rehearsal: 'bg-blue-100 text-blue-800 border-blue-200',
      sectional: 'bg-green-100 text-green-800 border-green-200',
      performance: 'bg-purple-100 text-purple-800 border-purple-200',
      tour: 'bg-orange-100 text-orange-800 border-orange-200',
      social: 'bg-pink-100 text-pink-800 border-pink-200',
      workshop: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      meeting: 'bg-gray-100 text-gray-800 border-gray-200',
      other: 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.start_time), date)
    );
  };

  const getRSVPCount = (eventId: string) => {
    return rsvps.filter(rsvp => rsvp.event_id === eventId);
  };

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminV2Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Calendar & Events</h1>
            <p className="text-muted-foreground">Manage rehearsals, performances, and activities</p>
          </div>
          <div className="flex gap-2">
            <Select value={view} onValueChange={(value: 'week' | 'month' | 'list') => setView(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Calendar View */}
        {view === 'week' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Week of {format(weekStart, 'MMM d, yyyy')}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
                  >
                    Next
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <div key={day.toString()} className="min-h-32 border rounded-lg p-2">
                    <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-blue-600' : 'text-gray-700'}`}>
                      {format(day, 'EEE d')}
                    </div>
                    <div className="space-y-1">
                      {getEventsForDate(day).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getEventTypeColor(event.event_type)}`}
                          onClick={() => openEditDialog(event)}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="opacity-75">{format(parseISO(event.start_time), 'h:mm a')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.event_type)}>
                          {event.event_type}
                        </Badge>
                        {event.allow_rsvp && (
                          <Badge variant="outline">RSVP</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {format(parseISO(event.start_time), 'MMM d, yyyy h:mm a')} - 
                          {format(parseISO(event.end_time), 'h:mm a')}
                        </div>
                        {event.location_name && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location_name}
                          </div>
                        )}
                        {event.allow_rsvp && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {getRSVPCount(event.id).length} RSVPs
                          </div>
                        )}
                      </div>
                      
                      {event.short_description && (
                        <p className="text-sm text-gray-700 mt-2">{event.short_description}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(event)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Event Dialog */}
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <div className="flex gap-2">
                  <Input
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                  />
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Event Type *</label>
                  <Select 
                    value={eventForm.event_type} 
                    onValueChange={(value) => setEventForm(prev => ({ ...prev, event_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={eventForm.location_name}
                    onChange={(e) => setEventForm(prev => ({ ...prev, location_name: e.target.value }))}
                    placeholder="Event location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time *</label>
                  <Input
                    type="datetime-local"
                    value={eventForm.start_time}
                    onChange={(e) => setEventForm(prev => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">End Time *</label>
                  <Input
                    type="datetime-local"
                    value={eventForm.end_time}
                    onChange={(e) => setEventForm(prev => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Short Description</label>
                <Input
                  value={eventForm.short_description}
                  onChange={(e) => setEventForm(prev => ({ ...prev, short_description: e.target.value }))}
                  placeholder="Brief description for calendar view"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Full Description</label>
                <div className="flex gap-2">
                  <Textarea
                    value={eventForm.full_description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, full_description: e.target.value }))}
                    placeholder="Detailed event description"
                    rows={3}
                  />
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={eventForm.allow_rsvp}
                    onChange={(e) => setEventForm(prev => ({ ...prev, allow_rsvp: e.target.checked }))}
                  />
                  Allow RSVPs
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={eventForm.is_public}
                    onChange={(e) => setEventForm(prev => ({ ...prev, is_public: e.target.checked }))}
                  />
                  Public Event
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}>
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminV2Layout>
  );
}
