
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') as string,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    );

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_super_admin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting user import from music reader...');

    // For now, we'll create a sample import process
    // In a real implementation, you would connect to the reader database
    // and fetch actual user data. This is a template structure:

    const sampleReaderUsers = [
      {
        email: 'reader.user1@example.com',
        first_name: 'Reader',
        last_name: 'User1',
        created_at: new Date().toISOString()
      },
      // Add more sample users or replace with actual reader database query
    ];

    const importResults = {
      total: 0,
      imported: 0,
      skipped: 0,
      errors: []
    };

    // TODO: Replace this with actual reader database connection
    // Example of what this would look like:
    /*
    const readerSupabase = createClient(
      'READER_SUPABASE_URL',
      'READER_SUPABASE_KEY'
    );
    
    const { data: readerUsers, error: readerError } = await readerSupabase
      .from('profiles')
      .select('*');
    */

    console.log('Processing reader users for import...');

    for (const readerUser of sampleReaderUsers) {
      importResults.total++;

      try {
        // Check if user already exists in main database
        const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(readerUser.email);

        if (existingUser?.user) {
          console.log(`User ${readerUser.email} already exists, skipping...`);
          importResults.skipped++;
          continue;
        }

        // Create user in auth system
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: readerUser.email,
          password: 'TempPassword123!', // Users will need to reset
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            first_name: readerUser.first_name,
            last_name: readerUser.last_name,
            imported_from_reader: true
          }
        });

        if (createError) {
          console.error(`Error creating user ${readerUser.email}:`, createError);
          importResults.errors.push(`${readerUser.email}: ${createError.message}`);
          continue;
        }

        // Create profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: newUser.user!.id,
            first_name: readerUser.first_name,
            last_name: readerUser.last_name,
            role: 'member',
            status: 'active',
            created_at: readerUser.created_at,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error(`Error creating profile for ${readerUser.email}:`, profileError);
          importResults.errors.push(`${readerUser.email}: Profile creation failed`);
          continue;
        }

        console.log(`Successfully imported user: ${readerUser.email}`);
        importResults.imported++;

      } catch (error) {
        console.error(`Unexpected error processing ${readerUser.email}:`, error);
        importResults.errors.push(`${readerUser.email}: Unexpected error`);
      }
    }

    console.log('Import completed:', importResults);

    return new Response(
      JSON.stringify({
        success: true,
        results: importResults,
        message: `Import completed. ${importResults.imported} users imported, ${importResults.skipped} skipped.`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Import function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
