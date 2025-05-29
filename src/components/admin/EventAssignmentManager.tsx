
import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, Music, UserPlus, UserMinus } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  voice_part: string;
  role: string;
}

interface Assignment {
  id: string;
  user_id: string;
  notes?: string;
}

interface EventAssignmentManagerProps {
  event: CalendarEvent;
  onAssignmentsChange?: () => void;
}

export const EventAssignmentManager: React.FC<EventAssignmentManagerProps> = ({
  event,
  onAssignmentsChange
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if this is a performance event
  const isPerformanceEvent = event.event_types?.some(type => 
    ['performance', 'concert', 'tour_concert'].includes(type)
  ) || event.event_type === 'performance' || event.event_type === 'concert';

  useEffect(() => {
    if (isPerformanceEvent) {
      fetchData();
    }
  }, [event.id, isPerformanceEvent]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, voice_part, role')
        .order('last_name', { ascending: true });

      if (usersError) throw usersError;

      // Fetch current assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('event_assignments')
        .select('id, user_id, notes')
        .eq('event_id', event.id);

      if (assignmentsError) throw assignmentsError;

      setUsers(usersData || []);
      setAssignments(assignmentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load assignment data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignmentToggle = async (userId: string, isAssigned: boolean) => {
    setIsUpdating(true);
    try {
      if (isAssigned) {
        // Add assignment
        const { error } = await supabase
          .from('event_assignments')
          .insert({
            event_id: event.id,
            user_id: userId
          });

        if (error) throw error;
        toast.success('User assigned to event');
      } else {
        // Remove assignment
        const { error } = await supabase
          .from('event_assignments')
          .delete()
          .eq('event_id', event.id)
          .eq('user_id', userId);

        if (error) throw error;
        toast.success('User removed from event');
      }

      await fetchData();
      onAssignmentsChange?.();
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update assignment');
    } finally {
      setIsUpdating(false);
    }
  };

  const isUserAssigned = (userId: string) => {
    return assignments.some(assignment => assignment.user_id === userId);
  };

  const assignedCount = assignments.length;
  const totalUsers = users.length;

  if (!isPerformanceEvent) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Performance Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading assignments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Performance Assignments
          <Badge variant="secondary" className="ml-auto">
            {assignedCount} of {totalUsers} assigned
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Select which members will perform at this event. Assigned members will be notified automatically.
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {users.map(user => {
            const assigned = isUserAssigned(user.id);
            
            return (
              <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <Checkbox
                  checked={assigned}
                  onCheckedChange={(checked) => 
                    handleAssignmentToggle(user.id, checked as boolean)
                  }
                  disabled={isUpdating}
                />
                
                <div className="flex-1">
                  <div className="font-medium">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground flex gap-2">
                    {user.voice_part && (
                      <Badge variant="outline" className="text-xs">
                        {user.voice_part.replace('_', ' ')}
                      </Badge>
                    )}
                    {user.role && (
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>

                {assigned ? (
                  <UserMinus className="h-4 w-4 text-red-500" />
                ) : (
                  <UserPlus className="h-4 w-4 text-green-500" />
                )}
              </div>
            );
          })}
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No users found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
