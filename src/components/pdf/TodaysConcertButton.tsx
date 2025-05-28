
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';

interface TodaysConcertButtonProps {
  className?: string;
}

interface ConcertEvent {
  id: string;
  title: string;
  start_time: string;
  setlist_id?: string;
}

interface Setlist {
  id: string;
  name: string;
  concert_date: string;
  sheet_music_ids: string[];
}

export const TodaysConcertButton: React.FC<TodaysConcertButtonProps> = ({ 
  className = "" 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [todaysConcert, setTodaysConcert] = useState<ConcertEvent | null>(null);
  const [todaysSetlist, setTodaysSetlist] = useState<Setlist | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      findTodaysConcert();
    }
  }, [user]);

  const findTodaysConcert = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      // Look for events today
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, title, start_time')
        .gte('start_time', todayStart)
        .lte('start_time', todayEnd)
        .order('start_time')
        .limit(1);

      if (eventsError) throw eventsError;

      if (events && events.length > 0) {
        setTodaysConcert(events[0]);
        
        // Look for a setlist with today's date
        const { data: setlists, error: setlistsError } = await supabase
          .from('setlists')
          .select('*')
          .eq('concert_date', format(today, 'yyyy-MM-dd'));

        if (setlistsError) throw setlistsError;

        if (setlists && setlists.length > 0) {
          setTodaysSetlist(setlists[0]);
        }
      } else {
        // If no events today, check for setlists with today's date
        const { data: setlists, error: setlistsError } = await supabase
          .from('setlists')
          .select('*')
          .eq('concert_date', format(today, 'yyyy-MM-dd'));

        if (setlistsError) throw setlistsError;

        if (setlists && setlists.length > 0) {
          setTodaysSetlist(setlists[0]);
        }
      }
    } catch (error) {
      console.error('Error finding today\'s concert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (todaysSetlist) {
      // Navigate to setlist view
      navigate(`/dashboard/setlists/${todaysSetlist.id}`);
    } else if (todaysConcert) {
      // Navigate to event details
      navigate(`/dashboard/events/${todaysConcert.id}`);
    } else {
      // Navigate to sheet music library
      navigate('/dashboard/sheet-music');
      toast({
        title: "No concert today",
        description: "Browse the sheet music library instead."
      });
    }
  };

  const getButtonText = () => {
    if (todaysSetlist) {
      return `Today's Setlist: ${todaysSetlist.name}`;
    } else if (todaysConcert) {
      return `Today's Concert: ${todaysConcert.title}`;
    }
    return "Browse Sheet Music";
  };

  const getButtonIcon = () => {
    if (todaysSetlist || todaysConcert) {
      return <Calendar className="h-4 w-4 mr-2" />;
    }
    return <Music className="h-4 w-4 mr-2" />;
  };

  const hasContent = todaysSetlist || todaysConcert;

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={hasContent ? "default" : "outline"}
      className={`${className} ${hasContent ? 'bg-primary text-primary-foreground' : ''}`}
    >
      {getButtonIcon()}
      {getButtonText()}
    </Button>
  );
};
