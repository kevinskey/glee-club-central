
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface AbsenceRequestFormProps {
  events: Event[];
  onSubmit?: () => void;
}

export const AbsenceRequestForm: React.FC<AbsenceRequestFormProps> = ({ events, onSubmit }) => {
  const { profile } = useAuth();
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.id || !selectedEventId || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('absence_requests')
        .insert({
          member_id: profile.id,
          event_id: selectedEventId,
          reason: reason.trim(),
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Absence request submitted successfully');
      setSelectedEventId('');
      setReason('');
      onSubmit?.();
    } catch (error) {
      console.error('Error submitting absence request:', error);
      toast.error('Failed to submit absence request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEvent = events.find(event => event.id === selectedEventId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Request Absence
        </CardTitle>
        <CardDescription>
          Submit a request if you cannot attend a rehearsal or performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event">Select Event *</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event..." />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{event.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEvent && (
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-1">{selectedEvent.title}</h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(selectedEvent.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedEvent.time}
                </div>
              </div>
              {selectedEvent.location && (
                <p className="text-sm text-muted-foreground mt-1">
                  Location: {selectedEvent.location}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Absence *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed reason for your absence..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
