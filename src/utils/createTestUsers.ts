
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TestUser {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
}

export const createTestUsers = async () => {
  const testUsers: TestUser[] = [
    {
      email: 'julia.jones@fan.com',
      password: 'Spelman2025!',
      first_name: 'Julia',
      last_name: 'Jones',
      role: 'fan'
    },
    {
      email: 'sarah.johnson@spelman.edu',
      password: 'Spelman2025!',
      first_name: 'Sarah',
      last_name: 'Johnson',
      role: 'member'
    },
    {
      email: 'dr.johnson@spelman.edu',
      password: 'Spelman2025!',
      first_name: 'Dr.',
      last_name: 'Johnson',
      role: 'admin'
    }
  ];

  console.log('🚀 Starting to create test users...');
  
  const results = {
    success: 0,
    errors: [] as Array<{ email: string; error: string }>
  };

  for (const userData of testUsers) {
    try {
      console.log(`Creating user: ${userData.email}`);
      
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name
          }
        }
      });

      if (authError) {
        console.error(`Auth error for ${userData.email}:`, authError);
        results.errors.push({
          email: userData.email,
          error: authError.message
        });
        continue;
      }

      if (!authData.user?.id) {
        console.error(`No user ID returned for ${userData.email}`);
        results.errors.push({
          email: userData.email,
          error: 'No user ID returned from auth'
        });
        continue;
      }

      console.log(`Auth user created for ${userData.email}, updating profile...`);

      // Wait a moment for the profile trigger to fire
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the profile with additional data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: userData.role,
          is_super_admin: userData.role === 'admin',
          status: 'active',
          join_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error(`Profile error for ${userData.email}:`, profileError);
        results.errors.push({
          email: userData.email,
          error: `Profile update failed: ${profileError.message}`
        });
        continue;
      }

      console.log(`✅ Successfully created ${userData.first_name} ${userData.last_name} (${userData.role})`);
      results.success++;
      
    } catch (error: any) {
      console.error(`Unexpected error for ${userData.email}:`, error);
      results.errors.push({
        email: userData.email,
        error: error.message || 'Unknown error occurred'
      });
    }
  }

  console.log('📊 Test user creation completed:', results);
  
  if (results.success > 0) {
    toast.success(`Successfully created ${results.success} test users`);
  }
  
  if (results.errors.length > 0) {
    toast.error(`Failed to create ${results.errors.length} users`);
    console.error('Creation errors:', results.errors);
  }

  return results;
};
