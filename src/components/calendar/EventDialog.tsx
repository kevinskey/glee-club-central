
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, MapPin, Clock, Save } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';

export interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  canRSVP?: boolean;
  canEdit?: boolean;
  userRSVP?: any;
  onRSVP?: () => void;
  onSave?: (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => Promise<void>;
}

export function EventDialog({ 
  event, 
  isOpen, 
  onClose, 
  canRSVP = false, 
  canEdit = false,
  userRSVP, 
  onRSVP,
  onSave 
}: EventDialogProps) {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(!event);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state for creating new events
  const [formData, setFormData] = useState({
    title: event?.title || '',
    start_time: event?.start_time || new Date().toISOString().slice(0, 16),
    end_time: event?.end_time || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
    location_name: event?.location_name || '',
    short_description: event?.short_description || '',
    is_public: event?.is_public ?? true,
    is_private: event?.is_private ?? false,
    allow_rsvp: event?.allow_rsvp ?? true,
    allow_reminders: event?.allow_reminders ?? true,
    allow_ics_download: event?.allow_ics_download ?? true,
    allow_google_map_link: event?.allow_google_map_link ?? true,
  });

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // If viewing an existing event
  if (event && !isCreating) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {new Date(event.start_time).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            {event.location_name && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <p>{event.location_name}</p>
              </div>
            )}

            {event.short_description && (
              <p className="text-sm text-muted-foreground">{event.short_description}</p>
            )}

            {canRSVP && user && (
              <div className="flex gap-2">
                <Button onClick={onRSVP} className="flex-1">
                  {userRSVP ? 'Update RSVP' : 'RSVP'}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If creating a new event
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location_name}
              onChange={(e) => handleInputChange('location_name', e.target.value)}
              placeholder="Event location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_public">Public Event</Label>
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => handleInputChange('is_public', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="allow_rsvp">Allow RSVP</Label>
              <Switch
                id="allow_rsvp"
                checked={formData.allow_rsvp}
                onCheckedChange={(checked) => handleInputChange('allow_rsvp', checked)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.title || isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>Creating...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Event
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
