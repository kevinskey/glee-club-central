
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Music } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  voice_part: string;
  role: string;
  avatar_url?: string;
}

interface PerformerSelectorProps {
  selectedPerformers: string[];
  onPerformersChange: (performerIds: string[]) => void;
  isPerformanceEvent: boolean;
}

export const PerformerSelector: React.FC<PerformerSelectorProps> = ({
  selectedPerformers,
  onPerformersChange,
  isPerformanceEvent
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, voice_part, role, avatar_url')
        .eq('status', 'active')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePerformerToggle = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      onPerformersChange([...selectedPerformers, userId]);
    } else {
      onPerformersChange(selectedPerformers.filter(id => id !== userId));
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || user.voice_part?.toLowerCase().includes(query);
  });

  const getVoicePartDisplay = (voicePart: string | null) => {
    if (!voicePart) return 'No voice part';
    
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

  if (!isPerformanceEvent) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Select Performers
          <Badge variant="secondary" className="ml-auto">
            {selectedPerformers.length} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search performers by name or voice part..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Select which members will perform at this event. They will be notified and the event will appear on their dashboard.
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">Loading performers...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No performers found</p>
            </div>
          ) : (
            filteredUsers.map(user => {
              const isSelected = selectedPerformers.includes(user.id);
              
              return (
                <div 
                  key={user.id} 
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      handlePerformerToggle(user.id, checked as boolean)
                    }
                  />
                  
                  <div className="flex-1">
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="flex gap-2 mt-1">
                      {user.voice_part && (
                        <Badge variant="outline" className="text-xs">
                          {getVoicePartDisplay(user.voice_part)}
                        </Badge>
                      )}
                      {user.role && (
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selectedPerformers.length > 0 && (
          <div className="pt-3 border-t">
            <div className="text-sm font-medium mb-2">
              Selected Performers ({selectedPerformers.length}):
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedPerformers.map(performerId => {
                const user = users.find(u => u.id === performerId);
                if (!user) return null;
                
                return (
                  <Badge key={performerId} variant="secondary" className="text-xs">
                    {user.first_name} {user.last_name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
