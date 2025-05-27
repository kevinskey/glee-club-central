
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') as string,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
  );
  
  try {
    const requestData = await req.json();
    const { action, calendar_id = 'primary' } = requestData;
    
    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (action === 'full_sync') {
      // Get user's Google Calendar token
      const { data: tokenData } = await supabaseAdmin
        .from('user_google_tokens')
        .select('access_token, expires_at')
        .eq('user_id', user.id)
        .single();
        
      if (!tokenData) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Google Calendar not connected' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Check if token is expired
      const expiresAt = new Date(tokenData.expires_at);
      const now = new Date();
      
      if (expiresAt <= now) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Google Calendar token expired. Please reconnect.' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Fetch events from Google Calendar
      const googleResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?timeMin=${new Date().toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        }
      );
      
      if (!googleResponse.ok) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to fetch events from Google Calendar' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      const googleEvents = await googleResponse.json();
      
      // Sync events to our database
      let syncedCount = 0;
      
      for (const googleEvent of googleEvents.items || []) {
        const startTime = googleEvent.start?.dateTime || googleEvent.start?.date;
        const endTime = googleEvent.end?.dateTime || googleEvent.end?.date;
        
        if (!startTime) continue;
        
        // Check if event already exists
        const { data: existingEvent } = await supabaseAdmin
          .from('calendar_events')
          .select('id')
          .eq('google_event_id', googleEvent.id)
          .eq('user_id', user.id)
          .single();
          
        const eventData = {
          title: googleEvent.summary || 'Untitled Event',
          description: googleEvent.description || '',
          location: googleEvent.location || '',
          date: startTime.split('T')[0],
          time: googleEvent.start?.dateTime ? 
            new Date(googleEvent.start.dateTime).toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : '00:00',
          type: 'event',
          allday: !googleEvent.start?.dateTime,
          google_event_id: googleEvent.id,
          user_id: user.id,
          last_synced_at: new Date().toISOString()
        };
        
        if (existingEvent) {
          // Update existing event
          await supabaseAdmin
            .from('calendar_events')
            .update(eventData)
            .eq('id', existingEvent.id);
        } else {
          // Insert new event
          await supabaseAdmin
            .from('calendar_events')
            .insert(eventData);
        }
        
        syncedCount++;
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Synced ${syncedCount} events from Google Calendar` 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error in calendar sync:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
