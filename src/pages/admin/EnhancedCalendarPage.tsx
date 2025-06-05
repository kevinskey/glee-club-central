
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit, Trash2, Users, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIAssistantButton } from '@/components/ai/AIAssistantButton';
import { useAISettings } from '@/components/ai/useAISettings';

interface Event {
  id: string;
  title: string;
  event_type: string;
  start_time: string;
  end_time: string;
  call_time?: string;
  location_name?: string;
  short_description?: string;
  full_description?: string;
  ai_suggested_title?: string;
  conflict_detected: boolean;
  allow_rsvp: boolean;
  rsvp_count?: number;
}

const EVENT_TYPES = [
  'rehearsal', 'sectional', 'concert', 'tour', 'service', 'meeting', 'social', 'fundraising'
];

export default function EnhancedCalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isFeatureEnabled } = useAISettings();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'rehearsal',
    start_time: '',
    end_time: '',
    call_time: '',
    location_name: '',
    short_description: '',
    full_description: '',
    allow_rsvp: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_rsvps(count)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;

      const eventsWithRSVP = data?.map(event => ({
        ...event,
        rsvp_count: event.event_rsvps?.[0]?.count || 0
      })) || [];

      setEvents(eventsWithRSVP);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const checkTimeConflicts = async (startTime: string, endTime: string, excludeId?: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, start_time, end_time')
        .neq('id', excludeId || '')
        .or(`and(start_time.lte.${endTime},end_time.gte.${startTime})`);

      if (error) throw error;
      return data?.length > 0;
    } catch (error) {
      console.error('Error checking conflicts:', error);
      return false;
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.start_time || !formData.end_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Check for conflicts
      const hasConflict = await checkTimeConflicts(
        formData.start_time, 
        formData.end_time, 
        editingEvent?.id
      );

      const eventData = {
        ...formData,
        conflict_detected: hasConflict,
        call_time: formData.call_time || null
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast.success('Event updated successfully');
      } else {
        const { error } = await supabase
          .from('events')
          .insert(eventData);

        if (error) throw error;
        toast.success('Event created successfully');
      }

      if (hasConflict) {
        toast.warning('Time conflict detected with existing events');
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      event_type: 'rehearsal',
      start_time: '',
      end_time: '',
      call_time: '',
      location_name: '',
      short_description: '',
      full_description: '',
      allow_rsvp: true
    });
    setEditingEvent(null);
    setDialogOpen(false);
  };

  const openEditDialog = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        event_type: event.event_type || 'rehearsal',
        start_time: event.start_time.slice(0, 16),
        end_time: event.end_time.slice(0, 16),
        call_time: event.call_time?.slice(0, 16) || '',
        location_name: event.location_name || '',
        short_description: event.short_description || '',
        full_description: event.full_description || '',
        allow_rsvp: event.allow_rsvp
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendar & Events</h1>
          <p className="text-muted-foreground">Manage choir events and schedules</p>
        </div>
        <Button onClick={() => openEditDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className={event.conflict_detected ? 'border-orange-500' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant="outline">{event.event_type}</Badge>
                    {event.conflict_detected && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Conflict
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(event.start_time).toLocaleString()}
                    </div>
                    {event.location_name && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location_name}
                      </div>
                    )}
                    {event.allow_rsvp && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.rsvp_count} RSVPs
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {event.short_description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{event.short_description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Create Event'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Event Title *</label>
              <div className="flex gap-2">
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                />
                {isFeatureEnabled('event_suggestions') && (
                  <AIAssistantButton
                    currentValue={formData.title}
                    onValueChange={(value) => setFormData({ ...formData, title: value })}
                    type="generate"
                    context="choir event title"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Event Type</label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
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
                  value={formData.location_name}
                  onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                  placeholder="Event location"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time *</label>
                <Input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">End Time *</label>
                <Input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Call Time</label>
                <Input
                  type="datetime-local"
                  value={formData.call_time}
                  onChange={(e) => setFormData({ ...formData, call_time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Short Description</label>
              <div className="flex gap-2">
                <Textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Brief description for calendar view"
                  rows={2}
                />
                {isFeatureEnabled('content_generation') && (
                  <AIAssistantButton
                    currentValue={formData.short_description}
                    onValueChange={(value) => setFormData({ ...formData, short_description: value })}
                    type="summarize"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Full Description</label>
              <div className="flex gap-2">
                <Textarea
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="Detailed event information"
                  rows={4}
                />
                {isFeatureEnabled('content_generation') && (
                  <AIAssistantButton
                    currentValue={formData.full_description}
                    onValueChange={(value) => setFormData({ ...formData, full_description: value })}
                    type="generate"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingEvent ? 'Update' : 'Create'} Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
