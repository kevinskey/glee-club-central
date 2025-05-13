
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseClient } from "../shared/supabase-client.ts";

// Google API constants
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || "";
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || "";

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { action, event, eventId, googleEventId } = requestData || {};
    
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get authenticated user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get user Google Calendar token
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('user_google_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', user.id)
      .single();
    
    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ error: 'Google Calendar not connected' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if token has expired and refresh if needed
    let accessToken = tokenData.access_token;
    const expiresAt = new Date(tokenData.expires_at).getTime();
    const now = Date.now();
    
    if (expiresAt <= now) {
      // Refresh the token
      try {
        const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            refresh_token: tokenData.refresh_token,
            client_id: GOOGLE_OAUTH_CLIENT_ID,
            client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
            grant_type: 'refresh_token',
          }).toString(),
        });
        
        if (!tokenResponse.ok) {
          throw new Error('Failed to refresh token');
        }
        
        const newTokens = await tokenResponse.json();
        accessToken = newTokens.access_token;
        
        // Update the token in the database
        await supabaseClient
          .from('user_google_tokens')
          .update({
            access_token: newTokens.access_token,
            expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return new Response(
          JSON.stringify({ error: 'Failed to refresh Google Calendar token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Process the requested action
    switch (action) {
      case 'sync_events':
        return await syncEvents(accessToken, user.id);
      
      case 'create_event':
        return await createEvent(accessToken, event, user.id);
      
      case 'update_event':
        return await updateEvent(accessToken, event, user.id);
      
      case 'delete_event':
        return await deleteEvent(accessToken, eventId, googleEventId, user.id);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to sync events between Supabase and Google Calendar
async function syncEvents(accessToken: string, userId: string) {
  try {
    // Step 1: Fetch all events from Google Calendar
    const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events?maxResults=100`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Calendar events: ${response.statusText}`);
    }
    
    const googleData = await response.json();
    const googleEvents = googleData.items || [];
    
    // Step 2: Fetch all events from Supabase
    const { data: localEvents, error: fetchError } = await supabaseClient
      .from('calendar_events')
      .select('*')
      .order('date', { ascending: true });
    
    if (fetchError) {
      throw new Error(`Failed to fetch local events: ${fetchError.message}`);
    }
    
    // Step 3: Process the sync
    let addedCount = 0;
    let updatedCount = 0;
    
    // Map of local events by Google Event ID for quick lookup
    const localEventsByGoogleId = new Map();
    localEvents.forEach(event => {
      if (event.google_event_id) {
        localEventsByGoogleId.set(event.google_event_id, event);
      }
    });
    
    // Process each Google event
    for (const googleEvent of googleEvents) {
      // Skip cancelled events
      if (googleEvent.status === 'cancelled') continue;
      
      // Skip events without valid date information
      if (!googleEvent.start || (!googleEvent.start.dateTime && !googleEvent.start.date)) continue;
      
      // Check if we already have this event locally
      const localEvent = localEventsByGoogleId.get(googleEvent.id);
      
      if (!localEvent) {
        // This is a new event, add it to our database
        try {
          // Determine if it's an all-day event
          const isAllDay = !!googleEvent.start.date;
          
          // Process the dates
          let eventDate, eventTime;
          if (isAllDay) {
            eventDate = googleEvent.start.date;
            eventTime = '00:00:00';
          } else {
            const startDate = new Date(googleEvent.start.dateTime);
            eventDate = startDate.toISOString().split('T')[0];
            eventTime = startDate.toISOString().split('T')[1].substring(0, 8);
          }
          
          // Determine event type based on colorId
          let eventType = 'other';
          if (googleEvent.colorId) {
            switch (googleEvent.colorId) {
              case '4': // Purple
                eventType = 'concert';
                break;
              case '9': // Green
                eventType = 'rehearsal';
                break;
              case '2': // Light green
                eventType = 'sectional';
                break;
              case '6': // Orange
                eventType = 'meeting';
                break;
              case '11': // Red
                eventType = 'tour';
                break;
              case '7': // Light orange
                eventType = 'special';
                break;
            }
          }
          
          // Create the new event
          const newEvent = {
            title: googleEvent.summary || 'Untitled Event',
            description: googleEvent.description || '',
            date: eventDate,
            time: eventTime,
            location: googleEvent.location || '',
            type: eventType,
            allday: isAllDay,
            google_event_id: googleEvent.id,
            user_id: userId,
            last_synced_at: new Date().toISOString()
          };
          
          const { error: insertError } = await supabaseClient
            .from('calendar_events')
            .insert(newEvent);
          
          if (insertError) {
            console.error(`Failed to insert event ${googleEvent.id}:`, insertError);
            continue;
          }
          
          addedCount++;
        } catch (error) {
          console.error(`Error processing new event ${googleEvent.id}:`, error);
          continue;
        }
      } else {
        // This is an existing event, check if it needs updates
        try {
          // Determine if it's an all-day event
          const isAllDay = !!googleEvent.start.date;
          
          // Process the dates
          let eventDate, eventTime;
          if (isAllDay) {
            eventDate = googleEvent.start.date;
            eventTime = '00:00:00';
          } else {
            const startDate = new Date(googleEvent.start.dateTime);
            eventDate = startDate.toISOString().split('T')[0];
            eventTime = startDate.toISOString().split('T')[1].substring(0, 8);
          }
          
          // Check if the event needs updating
          const needsUpdate = (
            localEvent.title !== googleEvent.summary ||
            localEvent.description !== googleEvent.description ||
            localEvent.location !== googleEvent.location ||
            localEvent.date !== eventDate ||
            localEvent.time !== eventTime ||
            localEvent.allday !== isAllDay
          );
          
          if (needsUpdate) {
            const updateData = {
              title: googleEvent.summary || 'Untitled Event',
              description: googleEvent.description || '',
              date: eventDate,
              time: eventTime,
              location: googleEvent.location || '',
              allday: isAllDay,
              last_synced_at: new Date().toISOString()
            };
            
            const { error: updateError } = await supabaseClient
              .from('calendar_events')
              .update(updateData)
              .eq('id', localEvent.id);
            
            if (updateError) {
              console.error(`Failed to update event ${googleEvent.id}:`, updateError);
              continue;
            }
            
            updatedCount++;
          }
        } catch (error) {
          console.error(`Error processing existing event ${googleEvent.id}:`, error);
          continue;
        }
      }
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Calendar synced successfully. Added ${addedCount} events, updated ${updatedCount} events.`,
        stats: {
          added: addedCount,
          updated: updatedCount
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing events:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to sync events' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Function to create an event in Google Calendar
async function createEvent(accessToken: string, event: any, userId: string) {
  try {
    // Prepare the event data for Google Calendar
    const googleEvent = prepareGoogleEvent(event);
    
    // Create the event in Google Calendar
    const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(googleEvent)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create Google Calendar event: ${errorText}`);
    }
    
    const createdEvent = await response.json();
    
    // Return the Google Event ID
    return new Response(
      JSON.stringify({
        success: true,
        googleEventId: createdEvent.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create event' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Function to update an event in Google Calendar
async function updateEvent(accessToken: string, event: any, userId: string) {
  try {
    // Check if the event has a Google Event ID
    if (!event.google_event_id) {
      throw new Error('Event does not have a Google Event ID');
    }
    
    // Prepare the event data for Google Calendar
    const googleEvent = prepareGoogleEvent(event);
    
    // Update the event in Google Calendar
    const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events/${event.google_event_id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(googleEvent)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update Google Calendar event: ${errorText}`);
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating event:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to update event' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Function to delete an event from Google Calendar
async function deleteEvent(accessToken: string, eventId: string, googleEventId: string, userId: string) {
  try {
    // Check if the event has a Google Event ID
    if (!googleEventId) {
      throw new Error('Event does not have a Google Event ID');
    }
    
    // Delete the event from Google Calendar
    const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events/${googleEventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok && response.status !== 410) { // 410 Gone means the event was already deleted
      const errorText = await response.text();
      throw new Error(`Failed to delete Google Calendar event: ${errorText}`);
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting event:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to delete event' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Helper function to prepare event data for Google Calendar
function prepareGoogleEvent(event: any) {
  // Process the start and end times
  const start: { dateTime?: string; date?: string } = {};
  const end: { dateTime?: string; date?: string } = {};
  
  if (event.allDay) {
    // All-day events use the date field
    start.date = new Date(event.start).toISOString().split('T')[0];
    end.date = event.end 
      ? new Date(event.end).toISOString().split('T')[0]
      : start.date; // Default to same day if no end date
  } else {
    // Timed events use the dateTime field
    start.dateTime = new Date(event.start).toISOString();
    end.dateTime = event.end 
      ? new Date(event.end).toISOString()
      : new Date(new Date(event.start).getTime() + 3600000).toISOString(); // Add 1 hour by default
  }
  
  // Create event colorId based on event type
  let colorId = '1'; // Default blue
  
  switch (event.type) {
    case "concert":
    case "performance":
      colorId = '4'; // Purple
      break;
    case "rehearsal":
      colorId = '9'; // Green
      break;
    case "sectional":
      colorId = '2'; // Light green
      break;
    case "meeting":
      colorId = '6'; // Orange
      break;
    case "tour":
      colorId = '11'; // Red
      break;
    case "special":
      colorId = '7'; // Light orange
      break;
    default:
      colorId = '1'; // Blue
  }
  
  return {
    summary: event.title,
    location: event.location,
    description: event.description,
    start,
    end,
    colorId
  };
}
