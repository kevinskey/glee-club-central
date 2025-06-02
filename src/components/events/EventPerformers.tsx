import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Music, Users } from 'lucide-react';

interface Performer {
  id: string;
  first_name: string;
  last_name: string;
  voice_part: string;
  avatar_url?: string;
}

interface EventPerformersProps {
  eventId: string;
  isPerformanceEvent: boolean;
}

export const EventPerformers: React.FC<EventPerformersProps> = ({
  eventId,
  isPerformanceEvent
}) => {
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPerformanceEvent && eventId) {
      fetchPerformers();
    }
  }, [eventId, isPerformanceEvent]);

  const fetchPerformers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('event_assignments')
        .select(`
          user_id,
          profiles!user_id (
            id,
            first_name,
            last_name,
            voice_part,
            avatar_url
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      const performersData = data
        ?.map(assignment => assignment.profiles)
        .filter(Boolean) || [];

      setPerformers(performersData);
    } catch (error) {
      console.error('Error fetching performers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVoicePartDisplay = (voicePart: string) => {
    const voicePartMap: Record<string, string> = {
      'soprano_1': 'Soprano 1',
      'soprano_2': 'Soprano 2',
      'alto_1': 'Alto 1',
      'alto_2': 'Alto 2',
      'tenor': 'Tenor',
      'bass': 'Bass',
      'director': 'Director'
    };
    
    return voicePartMap[voicePart] || voicePart;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Group performers by voice part
  const performersByVoicePart = performers.reduce((acc, performer) => {
    const voicePart = performer.voice_part || 'Other';
    if (!acc[voicePart]) {
      acc[voicePart] = [];
    }
    acc[voicePart].push(performer);
    return acc;
  }, {} as Record<string, Performer[]>);

  if (!isPerformanceEvent || performers.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading performers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Performers
          <Badge variant="secondary" className="ml-auto">
            {performers.length} members
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(performersByVoicePart).map(([voicePart, voicePartPerformers]) => (
          <div key={voicePart} className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              {getVoicePartDisplay(voicePart)} ({voicePartPerformers.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {voicePartPerformers.map(performer => (
                <div key={performer.id} className="flex items-center gap-2 p-2 rounded-lg border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={performer.avatar_url || ''} />
                    <AvatarFallback className="text-xs">
                      {getInitials(performer.first_name, performer.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {performer.first_name} {performer.last_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
