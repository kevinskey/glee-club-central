
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CalendarEvent } from '@/types/calendar';

interface GoogleCalendarSyncProps {
  onEventsSync: (events: CalendarEvent[]) => void;
  isConnected: boolean;
}

export function GoogleCalendarSync({ onEventsSync, isConnected }: GoogleCalendarSyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const syncGoogleCalendarEvents = async () => {
    if (!isConnected) {
      toast.error('Please connect to Google Calendar first');
      return;
    }

    setIsSyncing(true);
    try {
      // First try to get the session for Supabase authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        toast.error('Please log in again to sync Google Calendar');
        return;
      }

      console.log('Attempting to sync Google Calendar events...');
      
      // Try calling with Supabase session first
      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'fetch_events', calendar_id: 'primary' },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Error with Supabase auth, trying stored Google token:', error);
        
        // Fallback to stored Google token
        const googleToken = localStorage.getItem('google_access_token');
        
        if (!googleToken) {
          toast.error('No Google access token found. Please reconnect to Google Calendar.');
          return;
        }

        // Try with Google token directly
        const { data: googleData, error: googleError } = await supabase.functions.invoke('google-calendar-auth', {
          body: { action: 'fetch_events', calendar_id: 'primary' },
          headers: {
            'Authorization': `Bearer ${googleToken}`,
          }
        });

        if (googleError) {
          console.error('Error with Google token:', googleError);
          toast.error('Failed to sync Google Calendar. Please reconnect.');
          return;
        }

        if (googleData?.error) {
          console.error('API error:', googleData.error);
          toast.error(googleData.error);
          return;
        }

        const googleEvents = googleData?.events || [];
        console.log(`Fetched ${googleEvents.length} Google Calendar events`);
        
        // Transform and sync events
        const transformedEvents: CalendarEvent[] = googleEvents.map((event: any) => ({
          id: `google-${event.id}`,
          title: event.title,
          start: event.start,
          end: event.end || event.start,
          description: event.description || '',
          location: event.location || '',
          type: 'event' as const,
          allDay: event.allDay || false,
          source: 'google' as const,
          created_by: undefined
        }));

        onEventsSync(transformedEvents);
        setLastSyncTime(new Date());
        toast.success(`Synced ${googleEvents.length} Google Calendar events`);
        return;
      }

      if (data?.error) {
        console.error('API error:', data.error);
        toast.error(data.error);
        return;
      }

      const googleEvents = data?.events || [];
      console.log(`Fetched ${googleEvents.length} Google Calendar events`);

      // Transform Google Calendar events to match our CalendarEvent type
      const transformedEvents: CalendarEvent[] = googleEvents.map((event: any) => ({
        id: `google-${event.id}`,
        title: event.title,
        start: event.start,
        end: event.end || event.start,
        description: event.description || '',
        location: event.location || '',
        type: 'event' as const,
        allDay: event.allDay || false,
        source: 'google' as const,
        created_by: undefined
      }));

      onEventsSync(transformedEvents);
      setLastSyncTime(new Date());
      toast.success(`Synced ${googleEvents.length} Google Calendar events`);
    } catch (error) {
      console.error('Error syncing Google Calendar events:', error);
      toast.error('Failed to sync Google Calendar events');
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync on mount if connected
  useEffect(() => {
    if (isConnected) {
      syncGoogleCalendarEvents();
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        Connect Google Calendar to sync events
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={syncGoogleCalendarEvents}
        disabled={isSyncing}
        className="w-full"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Syncing...' : 'Sync Google Calendar'}
      </Button>
      
      {lastSyncTime && (
        <p className="text-xs text-muted-foreground text-center">
          Last synced: {lastSyncTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
