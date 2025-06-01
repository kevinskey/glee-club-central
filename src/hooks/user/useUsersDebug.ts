
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
      
      // Test 1: Basic connection using a simple query
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
        
      if (error) {
        addResult(`❌ Connection test failed: ${error.message}`);
      } else {
        addResult('✅ Basic connection successful');
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

      // Test own profile query
      const { data: ownProfile, error: ownError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .eq('id', user.id)
        .maybeSingle();

      if (ownError) {
        addResult(`❌ Own profile query failed: ${ownError.message}`);
      } else if (ownProfile) {
        addResult(`✅ Own profile found: ${ownProfile.first_name} ${ownProfile.last_name}`);
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
      
      // Test counting all profiles
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        addResult(`❌ Count query failed: ${countError.message}`);
      } else {
        addResult(`✅ Profiles count: ${count || 0}`);
      }

      // Test fetching all profiles
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .limit(5);

      if (allError) {
        addResult(`❌ All profiles query failed: ${allError.message}`);
      } else {
        addResult(`✅ Fetched ${allProfiles?.length || 0} profiles successfully`);
        if (allProfiles && allProfiles.length > 0) {
          addResult(`First profile: ${allProfiles[0].first_name} ${allProfiles[0].last_name}`);
        }
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
