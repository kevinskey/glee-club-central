
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserFormValues } from '@/components/members/form/userFormSchema';

export interface UnifiedUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  voice_part?: string;
  status?: string;
  role?: string;
  is_super_admin?: boolean;
  class_year?: string;
  dues_paid?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  voicePart: string;
  classYear: string;
  duesPaid: string;
  isAdmin: string;
}

interface UseUnifiedUserManagementResponse {
  users: UnifiedUser[];
  filteredUsers: UnifiedUser[];
  isLoading: boolean;
  error: string | null;
  filters: UserFilters;
  currentPage: number;
  totalPages: number;
  paginatedUsers: UnifiedUser[];
  setFilters: (filters: UserFilters) => void;
  setCurrentPage: (page: number) => void;
  refetch: () => Promise<void>;
  addUser: (userData: UserFormValues) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<UnifiedUser>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
}

const USERS_PER_PAGE = 6;

const initialFilters: UserFilters = {
  search: '',
  role: 'all',
  status: 'all',
  voicePart: 'all',
  classYear: 'all',
  duesPaid: 'all',
  isAdmin: 'all'
};

export const useUnifiedUserManagement = (): UseUnifiedUserManagementResponse => {
  const [users, setUsers] = useState<UnifiedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id, first_name, last_name, phone, voice_part, status, role,
          is_super_admin, class_year, dues_paid, notes, created_at,
          updated_at, avatar_url
        `)
        .order('last_name', { ascending: true });

      if (profilesError) {
        setError(profilesError.message);
        return;
      }

      const currentUserProfile = profiles?.find(p => p.id === currentUser.id);
      const isAdmin = currentUser.email === 'kevinskey@mac.com' || 
        currentUserProfile?.is_super_admin || 
        currentUserProfile?.role === 'admin';

      let usersWithEmails: UnifiedUser[];

      if (isAdmin) {
        try {
          const { data: authData } = await supabase.auth.admin.listUsers();
          const emailMap = new Map<string, string>();
          authData?.users?.forEach((user: any) => {
            emailMap.set(user.id, user.email || '');
          });
          
          usersWithEmails = profiles?.map(profile => ({
            ...profile,
            email: emailMap.get(profile.id) || 'No email found'
          })) || [];
        } catch {
          usersWithEmails = profiles?.map(profile => ({
            ...profile,
            email: profile.id === currentUser.id ? currentUser.email || '' : 'Email access limited'
          })) || [];
        }
      } else {
        usersWithEmails = profiles?.filter(profile => profile.id === currentUser.id)
          .map(profile => ({
            ...profile,
            email: currentUser.email || ''
          })) || [];
      }

      setUsers(usersWithEmails);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyFilters = useCallback((usersList: UnifiedUser[], filterCriteria: UserFilters) => {
    return usersList.filter(user => {
      if (filterCriteria.search) {
        const searchTerm = filterCriteria.search.toLowerCase();
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        const notes = (user.notes || '').toLowerCase();
        
        if (!fullName.includes(searchTerm) && !email.includes(searchTerm) && !notes.includes(searchTerm)) {
          return false;
        }
      }

      if (filterCriteria.role !== 'all' && user.role !== filterCriteria.role) return false;
      if (filterCriteria.status !== 'all' && user.status !== filterCriteria.status) return false;
      if (filterCriteria.voicePart !== 'all' && user.voice_part !== filterCriteria.voicePart) return false;
      if (filterCriteria.classYear !== 'all' && user.class_year !== filterCriteria.classYear) return false;
      
      if (filterCriteria.duesPaid !== 'all') {
        const isDuesPaid = user.dues_paid === true;
        const filterValue = filterCriteria.duesPaid === 'true';
        if (isDuesPaid !== filterValue) return false;
      }

      if (filterCriteria.isAdmin !== 'all') {
        const isUserAdmin = user.is_super_admin === true || user.role === 'admin';
        const filterValue = filterCriteria.isAdmin === 'true';
        if (isUserAdmin !== filterValue) return false;
      }

      return true;
    });
  }, []);

  const filteredUsers = applyFilters(users, filters);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = useCallback(async (userData: UserFormValues): Promise<boolean> => {
    try {
      if (!userData.email || !userData.password) {
        toast.error('Email and password are required');
        return false;
      }

      const isAdmin = userData.role === 'admin' || userData.is_admin;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: isAdmin ? 'admin' : 'member'
          }
        }
      });
      
      if (authError) {
        toast.error(authError.message || 'Failed to create user account');
        return false;
      }
      
      if (!authData.user) {
        toast.error('Failed to create user');
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updateData = {
        phone: userData.phone || null,
        voice_part: userData.voice_part,
        status: 'active',
        class_year: userData.class_year || null,
        notes: userData.notes || null,
        dues_paid: userData.dues_paid || false,
        join_date: userData.join_date || new Date().toISOString().split('T')[0],
        is_super_admin: isAdmin,
        role: isAdmin ? 'admin' : 'member',
        avatar_url: userData.avatar_url || null,
        updated_at: new Date().toISOString()
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', authData.user.id);
      
      if (profileError) {
        toast.error('User created but profile update failed. Please refresh and try editing the user.');
      } else {
        toast.success(`Added ${userData.first_name} ${userData.last_name}`);
      }
      
      await fetchUsers();
      return true;
    } catch (err) {
      toast.error('An unexpected error occurred while creating the user');
      return false;
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (userId: string, userData: Partial<UnifiedUser>): Promise<boolean> => {
    try {
      const filteredData: Record<string, any> = {};
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined) {
          filteredData[key] = value;
        }
      });
      
      const { error } = await supabase
        .from('profiles')
        .update(filteredData)
        .eq('id', userId);

      if (error) {
        toast.error(`Failed to update user: ${error.message}`);
        return false;
      }

      await fetchUsers();
      return true;
    } catch (err) {
      toast.error('An unexpected error occurred while updating the user');
      return false;
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        toast.error('Failed to delete user');
        return false;
      }

      await fetchUsers();
      return true;
    } catch (err) {
      toast.error('Failed to delete user');
      return false;
    }
  }, [fetchUsers]);

  return {
    users,
    filteredUsers,
    isLoading,
    error,
    filters,
    currentPage,
    totalPages,
    paginatedUsers,
    setFilters,
    setCurrentPage,
    refetch: fetchUsers,
    addUser,
    updateUser,
    deleteUser
  };
};
