
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Calendar, MapPin, Clock } from 'lucide-react';
import { format, isFuture } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface UpcomingPerformance {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location_name?: string;
  event_types: string[];
  short_description?: string;
}

export const UpcomingPerformances: React.FC = () => {
  const [performances, setPerformances] = useState<UpcomingPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUpcomingPerformances();
    }
  }, [user]);

  const fetchUpcomingPerformances = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('event_assignments')
        .select(`
          events!event_id (
            id,
            title,
            start_time,
            end_time,
            location_name,
            event_types,
            short_description
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Process the nested data structure
      const upcomingPerformances: UpcomingPerformance[] = [];
      
      if (data) {
        for (const assignment of data) {
          const event = assignment.events as any;
          if (event && 
              typeof event === 'object' && 
              'id' in event && 
              'start_time' in event && 
              typeof event.start_time === 'string' &&
              isFuture(new Date(event.start_time))) {
            
            upcomingPerformances.push({
              id: String(event.id),
              title: String(event.title || ''),
              start_time: String(event.start_time),
              end_time: String(event.end_time || ''),
              location_name: event.location_name ? String(event.location_name) : undefined,
              event_types: Array.isArray(event.event_types) ? event.event_types : [],
              short_description: event.short_description ? String(event.short_description) : undefined
            });
          }
        }
      }

      // Sort by start time
      upcomingPerformances.sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

      setPerformances(upcomingPerformances);
    } catch (error) {
      console.error('Error fetching upcoming performances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatEventDate = (startTime: string) => {
    const date = new Date(startTime);
    return format(date, 'MMM d, yyyy');
  };

  const formatEventTime = (startTime: string) => {
    const date = new Date(startTime);
    return format(date, 'h:mm a');
  };

  const getEventTypeColor = (eventTypes: string[]) => {
    if (eventTypes.includes('concert') || eventTypes.includes('performance')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            My Upcoming Performances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading performances...</div>
        </CardContent>
      </Card>
    );
  }

  if (performances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            My Upcoming Performances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No upcoming performances assigned</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          My Upcoming Performances
          <Badge variant="secondary" className="ml-auto">
            {performances.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile: Horizontal scroll */}
        <div className="block md:hidden">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {performances.slice(0, 5).map(performance => (
              <div 
                key={performance.id} 
                className="flex-shrink-0 w-72 p-3 rounded-lg border hover:bg-muted/50 transition-colors snap-start"
              >
                <div className="space-y-3">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {performance.title}
                  </h4>
                  
                  {performance.short_description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {performance.short_description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatEventDate(performance.start_time)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatEventTime(performance.start_time)}
                    </div>
                    {performance.location_name && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{performance.location_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {performance.event_types.map(type => (
                      <Badge 
                        key={type} 
                        variant="outline" 
                        className={`text-xs ${getEventTypeColor(performance.event_types)}`}
                      >
                        {type.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Vertical stack */}
        <div className="hidden md:block space-y-3">
          {performances.slice(0, 3).map(performance => (
            <div 
              key={performance.id} 
              className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {performance.title}
                  </h4>
                  
                  {performance.short_description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {performance.short_description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatEventDate(performance.start_time)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatEventTime(performance.start_time)}
                    </div>
                    {performance.location_name && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{performance.location_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {performance.event_types.map(type => (
                      <Badge 
                        key={type} 
                        variant="outline" 
                        className={`text-xs ${getEventTypeColor(performance.event_types)}`}
                      >
                        {type.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {performances.length > 3 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => navigate('/calendar')}
          >
            View All Performances ({performances.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
