
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';

export interface EventDialogProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  canRSVP?: boolean;
  userRSVP?: any;
  onRSVP?: () => void;
}

export function EventDialog({ event, isOpen, onClose, canRSVP = false, userRSVP, onRSVP }: EventDialogProps) {
  const { user } = useAuth();

  if (!event) return null;

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
