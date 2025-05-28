
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/calendar';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserRole = async () => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no role exists, create one with default 'member'
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: 'member' });
        
        if (!insertError) {
          setUserRole('member');
        }
      } else {
        setUserRole(data.role);
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'public' | 'member' | 'admin') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role });

      if (error) throw error;
      
      if (userId === user?.id) {
        setUserRole(role);
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  return {
    userRole,
    loading,
    updateUserRole,
    isAdmin: userRole === 'admin',
    isMember: userRole === 'member' || userRole === 'admin',
    isPublic: userRole === 'public' || !userRole
  };
};
