
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string | null;
  email: string;
  name: string;
  role: string;
  status: 'going' | 'maybe' | 'not_going';
  created_at: string;
  updated_at: string;
}

export const useEventRSVPs = (eventId?: string) => {
  const [rsvps, setRSVPs] = useState<EventRSVP[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRSVP, setUserRSVP] = useState<EventRSVP | null>(null);
  const { user } = useAuth();

  const fetchRSVPs = async (targetEventId?: string) => {
    if (!targetEventId && !eventId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', targetEventId || eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRSVPs(data || []);

      // Find current user's RSVP
      if (user) {
        const currentUserRSVP = data?.find(rsvp => rsvp.user_id === user.id);
        setUserRSVP(currentUserRSVP || null);
      }
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      toast.error('Failed to load RSVPs');
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateRSVP = async (rsvpData: {
    event_id: string;
    email: string;
    name: string;
    role: string;
    status: 'going' | 'maybe' | 'not_going';
  }) => {
    try {
      const payload = {
        ...rsvpData,
        user_id: user?.id || null,
      };

      // Check if RSVP already exists
      let existingRSVP = null;
      if (user) {
        const { data } = await supabase
          .from('event_rsvps')
          .select('*')
          .eq('event_id', rsvpData.event_id)
          .eq('user_id', user.id)
          .maybeSingle();
        existingRSVP = data;
      } else {
        const { data } = await supabase
          .from('event_rsvps')
          .select('*')
          .eq('event_id', rsvpData.event_id)
          .eq('email', rsvpData.email)
          .is('user_id', null)
          .maybeSingle();
        existingRSVP = data;
      }

      let result;
      if (existingRSVP) {
        // Update existing RSVP
        const { data, error } = await supabase
          .from('event_rsvps')
          .update({
            status: rsvpData.status,
            name: rsvpData.name,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRSVP.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new RSVP
        const { data, error } = await supabase
          .from('event_rsvps')
          .insert([payload])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      setUserRSVP(result);
      await fetchRSVPs();
      toast.success(existingRSVP ? 'RSVP updated successfully' : 'RSVP submitted successfully');
      return result;
    } catch (error) {
      console.error('Error saving RSVP:', error);
      toast.error('Failed to save RSVP');
      throw error;
    }
  };

  const deleteRSVP = async (rsvpId: string) => {
    try {
      const { error } = await supabase
        .from('event_rsvps')
        .delete()
        .eq('id', rsvpId);

      if (error) throw error;

      setUserRSVP(null);
      await fetchRSVPs();
      toast.success('RSVP removed successfully');
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      toast.error('Failed to remove RSVP');
      throw error;
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchRSVPs();
    }
  }, [eventId, user]);

  const rsvpStats = {
    total: rsvps.length,
    going: rsvps.filter(r => r.status === 'going').length,
    maybe: rsvps.filter(r => r.status === 'maybe').length,
    notGoing: rsvps.filter(r => r.status === 'not_going').length,
  };

  return {
    rsvps,
    loading,
    userRSVP,
    rsvpStats,
    fetchRSVPs,
    createOrUpdateRSVP,
    deleteRSVP,
  };
};
