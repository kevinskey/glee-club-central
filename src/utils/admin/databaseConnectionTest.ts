
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

  // Test 3: Check current RLS policies (using information_schema)
  try {
    const { data, error } = await supabase
      .from('information_schema')
      .select('*')
      .eq('table_name', 'profiles')
      .limit(1);
    
    results.push({
      test: 'RLS Policy Check',
      status: error ? 'warning' : 'success',
      message: error ? `Could not check policies: ${error.message}` : 'Policy check accessible',
      details: { error, hasAccess: !error }
    });
  } catch (err) {
    results.push({
      test: 'RLS Policy Check',
      status: 'warning',
      message: 'Could not access schema information (normal for RLS)',
      details: err
    });
  }

  // Test 4: Direct admin check via auth.users
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const isKnownAdmin = user.email === 'kevinskey@mac.com';
      results.push({
        test: 'Direct Admin Check',
        status: 'success',
        message: `User admin status: ${isKnownAdmin ? 'Admin' : 'Regular user'}`,
        details: { email: user.email, isAdmin: isKnownAdmin }
      });
    } else {
      results.push({
        test: 'Direct Admin Check',
        status: 'warning',
        message: 'No authenticated user for admin check',
        details: null
      });
    }
  } catch (err) {
    results.push({
      test: 'Direct Admin Check',
      status: 'error',
      message: `Admin check failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      details: err
    });
  }

  // Test 5: Safe profile query with error handling
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('🔍 Testing own profile query for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, is_super_admin')
        .eq('id', user.id)
        .maybeSingle();
      
      results.push({
        test: 'Own Profile Query Test',
        status: error ? 'error' : data ? 'success' : 'warning',
        message: error 
          ? `Profile query failed: ${error.message}` 
          : data 
          ? `Profile found: ${data.first_name} ${data.last_name} (${data.role})` 
          : 'No profile found for user',
        details: { profile: data, error, userId: user.id }
      });
    } else {
      results.push({
        test: 'Own Profile Query Test',
        status: 'warning',
        message: 'No authenticated user to test profile query',
        details: null
      });
    }
  } catch (err) {
    results.push({
      test: 'Own Profile Query Test',
      status: 'error',
      message: `Profile query error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      details: err
    });
  }

  // Test 6: Careful admin-level query
  try {
    console.log('🔍 Testing admin-level profiles query...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role, is_super_admin')
      .limit(10);
    
    results.push({
      test: 'Admin Level Query Test',
      status: error ? 'error' : 'success',
      message: error 
        ? `Admin query failed: ${error.message}` 
        : `Successfully fetched ${data?.length || 0} profiles${data && data.length > 1 ? ' (Admin access confirmed)' : ''}`,
      details: { 
        profileCount: data?.length, 
        error, 
        hasMultipleProfiles: data && data.length > 1,
        firstProfile: data?.[0]
      }
    });
  } catch (err) {
    results.push({
      test: 'Admin Level Query Test',
      status: 'error',
      message: `Admin query error: ${err instanceof Error ? err.message : 'Unknown error'}`,
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
