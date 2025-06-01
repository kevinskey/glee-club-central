
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseTestResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const runDatabaseConnectionTests = async (): Promise<DatabaseTestResult[]> => {
  const results: DatabaseTestResult[] = [];

  // Test 1: Basic connection
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    results.push({
      test: 'Basic Database Connection',
      status: error ? 'error' : 'success',
      message: error ? `Connection failed: ${error.message}` : 'Connection successful',
      details: error
    });
  } catch (err) {
    results.push({
      test: 'Basic Database Connection',
      status: 'error',
      message: `Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      details: err
    });
  }

  // Test 2: Auth user check
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    results.push({
      test: 'Authentication Status',
      status: error ? 'error' : user ? 'success' : 'warning',
      message: error ? `Auth error: ${error.message}` : user ? `Authenticated as: ${user.email}` : 'No user authenticated',
      details: { userId: user?.id, email: user?.email }
    });
  } catch (err) {
    results.push({
      test: 'Authentication Status',
      status: 'error',
      message: `Auth check failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      details: err
    });
  }

  // Test 3: RLS Policy Test - Own Profile Query (select * from profiles where id = auth.uid())
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);
      
      results.push({
        test: 'Own Profile Query (RLS Test)',
        status: error ? 'error' : data && data.length > 0 ? 'success' : 'warning',
        message: error ? `Own profile query failed: ${error.message}` : 
                data && data.length > 0 ? `Successfully retrieved own profile` : 'No profile found for current user',
        details: { profileCount: data?.length, error, profile: data?.[0] }
      });
    } else {
      results.push({
        test: 'Own Profile Query (RLS Test)',
        status: 'warning',
        message: 'No authenticated user to test own profile query',
        details: null
      });
    }
  } catch (err) {
    results.push({
      test: 'Own Profile Query (RLS Test)',
      status: 'error',
      message: `Own profile query error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      details: err
    });
  }

  // Test 4: RLS Policy Test - All Profiles Query (select * from profiles)
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('last_name', { ascending: true });
    
    results.push({
      test: 'All Profiles Query (Admin RLS Test)',
      status: error ? 'error' : 'success',
      message: error ? `All profiles query failed: ${error.message}` : 
              `Successfully fetched ${data?.length || 0} profiles ${data && data.length > 1 ? '(Admin access confirmed)' : '(Own profile only)'}`,
      details: { profileCount: data?.length, error, hasMultipleProfiles: data && data.length > 1 }
    });
  } catch (err) {
    results.push({
      test: 'All Profiles Query (Admin RLS Test)',
      status: 'error',
      message: `All profiles query error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      details: err
    });
  }

  // Test 5: Additional RLS Policy Tests
  try {
    const tests = [
      { name: 'Count query', query: supabase.from('profiles').select('*', { count: 'exact', head: true }) },
      { name: 'Limited select', query: supabase.from('profiles').select('id, role, first_name, last_name').limit(5) },
    ];

    for (const test of tests) {
      try {
        const { data, error, count } = await test.query;
        results.push({
          test: `RLS Policy Test: ${test.name}`,
          status: error ? 'error' : 'success',
          message: error ? `${test.name} failed: ${error.message}` : `${test.name} successful`,
          details: { error, dataLength: data?.length, count }
        });
      } catch (err) {
        results.push({
          test: `RLS Policy Test: ${test.name}`,
          status: 'error',
          message: `${test.name} error: ${err instanceof Error ? err.message : 'Unknown error'}`,
          details: err
        });
      }
    }
  } catch (err) {
    results.push({
      test: 'Additional RLS Policy Tests',
      status: 'error',
      message: `RLS test error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      details: err
    });
  }

  return results;
};

export const formatTestResults = (results: DatabaseTestResult[]): string => {
  let report = 'Database Connection Test Results:\n\n';
  
  results.forEach((result, index) => {
    const status = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    report += `${index + 1}. ${status} ${result.test}\n`;
    report += `   ${result.message}\n`;
    if (result.details && Object.keys(result.details).length > 0) {
      report += `   Details: ${JSON.stringify(result.details, null, 2)}\n`;
    }
    report += '\n';
  });
  
  return report;
};
