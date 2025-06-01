
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

  // Test 3: Admin function check
  try {
    const { data, error } = await supabase.rpc('is_current_user_super_admin');
    results.push({
      test: 'Admin Function Check',
      status: error ? 'error' : 'success',
      message: error ? `Admin function failed: ${error.message}` : `Admin function works, result: ${data}`,
      details: { isAdmin: data, error }
    });
  } catch (err) {
    results.push({
      test: 'Admin Function Check',
      status: 'error',
      message: `Admin function error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      details: err
    });
  }

  // Test 4: Direct profile query (current user)
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, is_super_admin, first_name, last_name')
        .eq('id', user.id)
        .maybeSingle();
      
      results.push({
        test: 'Current User Profile Query',
        status: error ? 'error' : data ? 'success' : 'warning',
        message: error ? `Profile query failed: ${error.message}` : data ? 'Profile found' : 'No profile found',
        details: { profile: data, error }
      });
    } else {
      results.push({
        test: 'Current User Profile Query',
        status: 'warning',
        message: 'No authenticated user to test profile query',
        details: null
      });
    }
  } catch (err) {
    results.push({
      test: 'Current User Profile Query',
      status: 'error',
      message: `Profile query error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      details: err
    });
  }

  // Test 5: All profiles query (admin only)
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, is_super_admin, first_name, last_name')
      .limit(5);
    
    results.push({
      test: 'All Profiles Query (Admin)',
      status: error ? 'error' : 'success',
      message: error ? `All profiles query failed: ${error.message}` : `Found ${data?.length || 0} profiles`,
      details: { profileCount: data?.length, error, profiles: data }
    });
  } catch (err) {
    results.push({
      test: 'All Profiles Query (Admin)',
      status: 'error',
      message: `All profiles query error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      details: err
    });
  }

  // Test 6: RLS Policy Test
  try {
    // Try to access profiles table with different approaches
    const tests = [
      { name: 'Simple select', query: supabase.from('profiles').select('id').limit(1) },
      { name: 'Count query', query: supabase.from('profiles').select('*', { count: 'exact', head: true }) },
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
      test: 'RLS Policy Test',
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
