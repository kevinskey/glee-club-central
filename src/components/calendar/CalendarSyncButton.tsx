
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw } from 'lucide-react';
import { getPerformanceEvents } from '@/utils/performanceSync';
import { useToast } from '@/hooks/use-toast';
import { useCalendarStore } from '@/hooks/useCalendarStore';

interface CalendarSyncButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
}

export const CalendarSyncButton = ({ 
  variant = 'outline',
  className = ''
}: CalendarSyncButtonProps) => {
  const { toast } = useToast();
  const { addEvents } = useCalendarStore();
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Get performance events
      const performanceEvents = await getPerformanceEvents();
      
      // Add them to calendar
      if (addEvents) {
        addEvents(performanceEvents);
        
        toast({
          title: 'Calendar synced',
          description: `Successfully imported ${performanceEvents.length} performances`,
        });
      } else {
        console.error("addEvents function not available in calendar store");
        toast({
          title: 'Sync failed',
          description: 'Could not import performances due to a technical issue.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Error syncing performances:", error);
      toast({
        title: 'Sync failed',
        description: 'Could not import performances. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size="sm" 
      onClick={handleSync} 
      disabled={syncing}
      className={`gap-2 ${className}`}
    >
      {syncing ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <Calendar className="h-4 w-4" />
      )}
      {syncing ? 'Syncing...' : 'Sync Performances'}
    </Button>
  );
};
