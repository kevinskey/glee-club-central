
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseUsersDebugResponse {
  testConnection: () => Promise<void>;
  testAuth: () => Promise<void>;
  testBasicQuery: () => Promise<void>;
  testAdminQuery: () => Promise<void>;
  isLoading: boolean;
  results: string[];
}

export const useUsersDebug = (): UseUsersDebugResponse => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    console.log('🐛 Debug:', message);
    setResults(prev => [...prev, message]);
  };

  const testConnection = useCallback(async () => {
    setIsLoading(true);
    setResults([]);
    
    try {
      addResult('Testing basic Supabase connection...');
      
      // Test 1: Basic connection with a simple count query on a different table
      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        addResult(`❌ Connection test failed: ${error.message}`);
      } else {
        addResult(`✅ Basic connection successful - found ${count || 0} events`);
      }

      // Test 2: Try profiles count
      const { count: profileCount, error: profileError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (profileError) {
        addResult(`❌ Profiles count failed: ${profileError.message}`);
      } else {
        addResult(`✅ Profiles count successful - found ${profileCount || 0} profiles`);
      }
    } catch (err) {
      addResult(`💥 Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testAuth = useCallback(async () => {
    setIsLoading(true);
    
    try {
      addResult('Testing authentication...');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        addResult(`❌ Auth error: ${error.message}`);
      } else if (user) {
        addResult(`✅ User authenticated: ${user.email}`);
        addResult(`User ID: ${user.id}`);
        addResult(`Is admin email: ${user.email === 'kevinskey@mac.com' ? 'Yes' : 'No'}`);
      } else {
        addResult('⚠️ No authenticated user');
      }
    } catch (err) {
      addResult(`💥 Auth test error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testBasicQuery = useCallback(async () => {
    setIsLoading(true);
    
    try {
      addResult('Testing basic profiles query...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        addResult('❌ No authenticated user for query test');
        setIsLoading(false);
        return;
      }

      // Test own profile query with the fixed RLS
      const { data: ownProfile, error: ownError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, is_super_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (ownError) {
        addResult(`❌ Own profile query failed: ${ownError.message}`);
        addResult(`Error code: ${ownError.code}`);
      } else if (ownProfile) {
        addResult(`✅ Own profile found: ${ownProfile.first_name} ${ownProfile.last_name}`);
        addResult(`Profile role: ${ownProfile.role}`);
        addResult(`Is super admin: ${ownProfile.is_super_admin ? 'Yes' : 'No'}`);
      } else {
        addResult('⚠️ No profile found for current user');
      }
    } catch (err) {
      addResult(`💥 Basic query error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testAdminQuery = useCallback(async () => {
    setIsLoading(true);
    
    try {
      addResult('Testing admin-level profiles query...');
      
      // Test fetching all profiles (should work for admin, limited for others due to RLS)
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, is_super_admin')
        .limit(10);

      if (allError) {
        addResult(`❌ All profiles query failed: ${allError.message}`);
        addResult(`Error code: ${allError.code}`);
      } else {
        addResult(`✅ Fetched ${allProfiles?.length || 0} profiles successfully`);
        if (allProfiles && allProfiles.length > 0) {
          addResult(`First profile: ${allProfiles[0].first_name} ${allProfiles[0].last_name}`);
          
          // Check if we can see multiple profiles (admin) or just our own (non-admin)
          const { data: { user } } = await supabase.auth.getUser();
          const uniqueIds = new Set(allProfiles.map(p => p.id));
          
          if (uniqueIds.size > 1) {
            addResult('✅ Can see multiple profiles - admin access confirmed');
          } else if (uniqueIds.size === 1 && user && uniqueIds.has(user.id)) {
            addResult('ℹ️ Can only see own profile - limited user access (normal for non-admin)');
          } else {
            addResult('⚠️ Unexpected profile access pattern');
          }
        }
      }

      // Test counting all profiles
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        addResult(`❌ Count query failed: ${countError.message}`);
      } else {
        addResult(`✅ Profiles count: ${count || 0}`);
      }
    } catch (err) {
      addResult(`💥 Admin query error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    testConnection,
    testAuth,
    testBasicQuery,
    testAdminQuery,
    isLoading,
    results
  };
};
