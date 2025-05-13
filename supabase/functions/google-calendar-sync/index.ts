
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Google API constants
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || "";
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || "";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Initialize Supabase client with admin privileges
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') as string,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
  );
  
  try {
    let requestData;
    
    try {
      requestData = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON in request body'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { action, superAdminToken } = requestData || {};
    
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader && !superAdminToken) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get auth user
    const token = superAdminToken || authHeader?.replace('Bearer ', '');
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
    
    // Check if user is a super admin or regular admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, is_super_admin')
      .eq('id', user.id)
      .single();
    
    const isAdmin = profile?.is_super_admin || 
                   profile?.role === 'admin' || 
                   profile?.role === 'administrator' ||
                   profile?.role === 'director';
    
    // Only admins can sync calendars
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin privileges required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (action === 'full_sync') {
      // For full sync, we'll update both ways
      // 1. Get Google Calendar events and update Supabase
      // 2. Get Supabase events not in Google and create them in Google
      const { data: googleTokenData, error: tokenError } = await supabaseAdmin
        .from('user_google_tokens')
        .select('access_token, refresh_token, expires_at')
        .eq('user_id', user.id)
        .single();
        
      if (tokenError || !googleTokenData) {
        return new Response(
          JSON.stringify({ error: 'Google Calendar not connected' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Check if token is expired and refresh if needed
      const expiresAt = new Date(googleTokenData.expires_at).getTime();
      const now = Date.now();
      let accessToken = googleTokenData.access_token;
      
      if (expiresAt <= now) {
        // Token has expired, refresh it
        if (!googleTokenData.refresh_token) {
          return new Response(
            JSON.stringify({ error: 'No refresh token available' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        try {
          const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              refresh_token: googleTokenData.refresh_token,
              client_id: GOOGLE_OAUTH_CLIENT_ID,
              client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
              grant_type: 'refresh_token',
            }).toString(),
          });
          
          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            throw new Error(`Failed to refresh token: ${errorText}`);
          }
          
          const tokens = await tokenResponse.json();
          accessToken = tokens.access_token;
          
          // Update token in database
          await supabaseAdmin
            .from('user_google_tokens')
            .update({
              access_token: tokens.access_token,
              expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        } catch (error) {
          return new Response(
            JSON.stringify({ error: `Token refresh failed: ${error.message}` }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }
      
      // Fetch events from Google Calendar
      const timeMin = new Date();
      timeMin.setDate(timeMin.getDate() - 30); // Get events from 30 days ago
      
      const timeMax = new Date();
      timeMax.setDate(timeMax.getDate() + 180); // Get events up to 180 days in the future
      
      const calendarId = 'primary';
      const eventsEndpoint = `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`;
      
      const params = new URLSearchParams({
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: 'true',
        maxResults: '2500'
      });
      
      try {
        // Get events from Google Calendar
        const eventsResponse = await fetch(`${eventsEndpoint}?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        if (!eventsResponse.ok) {
          const errorText = await eventsResponse.text();
          throw new Error(`Failed to fetch Google Calendar events: ${errorText}`);
        }
        
        const eventsData = await eventsResponse.json();
        const googleEvents = eventsData.items || [];
        
        // Create/update events in Supabase
        let eventsCreated = 0;
        let eventsUpdated = 0;
        
        for (const googleEvent of googleEvents) {
          // Check if event already exists in Supabase
          const { data: existingEvent } = await supabaseAdmin
            .from('calendar_events')
            .select('id')
            .eq('google_event_id', googleEvent.id)
            .maybeSingle();
          
          // Use start and end times, or fall back to date for all-day events
          const startDateTime = googleEvent.start.dateTime || googleEvent.start.date;
          const endDateTime = googleEvent.end.dateTime || googleEvent.end.date;
          
          // Determine event type based on Google Calendar event
          let eventType = 'special';
          const title = googleEvent.summary?.toLowerCase() || '';
          const description = googleEvent.description?.toLowerCase() || '';
          
          if (title.includes('rehearsal') || description.includes('rehearsal')) {
            eventType = 'rehearsal';
          } else if (title.includes('concert') || description.includes('concert')) {
            eventType = 'concert';
          } else if (title.includes('sectional') || description.includes('sectional')) {
            eventType = 'sectional';
          } else if (title.includes('tour') || description.includes('tour')) {
            eventType = 'tour';
          }
          
          // Parse the start date for the date field
          const startDate = new Date(startDateTime);
          const eventDate = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
          
          // Format the time (HH:MM) for the time field
          const hours = String(startDate.getHours()).padStart(2, '0');
          const minutes = String(startDate.getMinutes()).padStart(2, '0');
          const eventTime = `${hours}:${minutes}`;
          
          if (existingEvent) {
            // Update existing event
            await supabaseAdmin
              .from('calendar_events')
              .update({
                title: googleEvent.summary,
                description: googleEvent.description,
                location: googleEvent.location,
                date: eventDate,
                time: eventTime,
                type: eventType,
                updated_at: new Date().toISOString(),
                last_synced_at: new Date().toISOString(),
                allday: !googleEvent.start.dateTime
              })
              .eq('id', existingEvent.id);
              
            eventsUpdated++;
          } else {
            // Insert new event
            const eventData = {
              title: googleEvent.summary,
              description: googleEvent.description,
              location: googleEvent.location || '',
              date: eventDate,
              time: eventTime,
              user_id: user.id, // Set creator as the current admin
              google_event_id: googleEvent.id,
              type: eventType,
              allday: !googleEvent.start.dateTime
            };
            
            await supabaseAdmin
              .from('calendar_events')
              .insert(eventData);
              
            eventsCreated++;
          }
        }
        
        // Now sync events from Supabase to Google Calendar (for events without google_event_id)
        const { data: localEvents } = await supabaseAdmin
          .from('calendar_events')
          .select('*')
          .is('google_event_id', null)
          .gt('date', timeMin.toISOString().split('T')[0]);
        
        let localEventsCreated = 0;
        
        if (localEvents && localEvents.length > 0) {
          for (const localEvent of localEvents) {
            // Convert local event to Google Calendar format
            const startDate = new Date(`${localEvent.date}T${localEvent.time || '00:00'}:00`);
            
            // Default end time is 1 hour after start for non-all-day events
            let endDate;
            if (localEvent.allday) {
              // For all-day events, end date is the next day
              endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + 1);
            } else {
              // For timed events, end is 1 hour after start
              endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
            }
            
            const googleEvent = {
              summary: localEvent.title,
              description: localEvent.description,
              location: localEvent.location,
              start: localEvent.allday
                ? { date: startDate.toISOString().split('T')[0] }
                : { 
                    dateTime: startDate.toISOString(),
                    timeZone: 'America/New_York'
                  },
              end: localEvent.allday
                ? { date: endDate.toISOString().split('T')[0] }
                : { 
                    dateTime: endDate.toISOString(),
                    timeZone: 'America/New_York'
                  }
            };
            
            // Create event in Google Calendar
            const createResponse = await fetch(`${eventsEndpoint}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              },
              body: JSON.stringify(googleEvent)
            });
            
            if (!createResponse.ok) {
              console.error(`Failed to create event in Google Calendar: ${await createResponse.text()}`);
              continue;
            }
            
            const createdEvent = await createResponse.json();
            
            // Update local event with Google Calendar ID
            await supabaseAdmin
              .from('calendar_events')
              .update({
                google_event_id: createdEvent.id,
                last_synced_at: new Date().toISOString()
              })
              .eq('id', localEvent.id);
              
            localEventsCreated++;
          }
        }
        
        // Return success with stats
        return new Response(
          JSON.stringify({
            success: true,
            stats: {
              eventsFromGoogle: googleEvents.length,
              eventsCreatedLocally: eventsCreated,
              eventsUpdatedLocally: eventsUpdated,
              localEventsSyncedToGoogle: localEventsCreated
            }
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Error syncing with Google Calendar:', error);
        return new Response(
          JSON.stringify({ error: `Sync failed: ${error.message}` }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Unknown action' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
