
import { SupabaseClient, User } from "https://esm.sh/@supabase/supabase-js@2";
import { GOOGLE_OAUTH_ENDPOINT, GOOGLE_OAUTH_CLIENT_ID, REDIRECT_URI, GOOGLE_SCOPE, corsHeaders } from "./config.ts";
import { GoogleCalendarEvent, CalendarListItem } from "./types.ts";

export async function generateOAuthUrl(user: User): Promise<Response> {
  console.log("Generating auth URL for user:", user.id);
  
  try {
    const authUrlParams = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      scope: GOOGLE_SCOPE,
      state: user.id,
    });
    
    const authUrl = `${GOOGLE_OAUTH_ENDPOINT}?${authUrlParams.toString()}`;
    
    console.log("Generated OAuth URL successfully");
    
    return new Response(
      JSON.stringify({ 
        authUrl,
        redirectUri: REDIRECT_URI,
        scope: GOOGLE_SCOPE
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error generating OAuth URL:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate OAuth URL',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function checkConnection(user: User, supabaseAdmin: SupabaseClient): Promise<Response> {
  try {
    const tokenData = await getUserToken(user.id, supabaseAdmin);
    console.log("Connection check: CONNECTED");
    return new Response(
      JSON.stringify({ 
        connected: true,
        expires_at: tokenData.expires_at
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.log("Connection check: NOT CONNECTED -", error.message);
    return new Response(
      JSON.stringify({ 
        connected: false,
        error: error.message
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function listCalendars(user: User, supabaseAdmin: SupabaseClient): Promise<Response> {
  console.log("Fetching calendars for user:", user.id);
  
  try {
    const tokenData = await getUserToken(user.id, supabaseAdmin);
    
    const calendarsResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );
    
    if (!calendarsResponse.ok) {
      const errorText = await calendarsResponse.text();
      console.error("Failed to fetch calendars:", errorText);
      throw new Error('Failed to fetch calendars from Google');
    }
    
    const calendarsData = await calendarsResponse.json();
    const calendars: CalendarListItem[] = calendarsData.items?.map((cal: any) => ({
      id: cal.id,
      name: cal.summary,
      primary: cal.primary || false
    })) || [];
    
    console.log(`Fetched ${calendars.length} calendars`);
    
    return new Response(
      JSON.stringify({ calendars }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in list_calendars:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        calendars: []
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function fetchEvents(user: User, supabaseAdmin: SupabaseClient, calendarId: string = 'primary'): Promise<Response> {
  console.log("Fetching events for user:", user.id);
  
  try {
    const tokenData = await getUserToken(user.id, supabaseAdmin);
    
    const timeMin = new Date().toISOString();
    
    console.log(`Fetching events from calendar: ${calendarId}`);
    
    const eventsResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` + 
      new URLSearchParams({
        timeMin,
        maxResults: '5',
        singleEvents: 'true',
        orderBy: 'startTime'
      }).toString(),
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );
    
    if (!eventsResponse.ok) {
      const errorText = await eventsResponse.text();
      console.error("Failed to fetch events:", errorText);
      throw new Error('Failed to fetch events from Google');
    }
    
    const eventsData = await eventsResponse.json();
    console.log(`Successfully fetched ${eventsData.items?.length || 0} events`);
    
    const events = eventsData.items?.map((event: GoogleCalendarEvent) => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location || '',
      description: event.description || '',
      allDay: !event.start?.dateTime,
      source: 'google'
    })) || [];
    
    return new Response(
      JSON.stringify({ events }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in fetch_events:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        events: []
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function disconnect(user: User, supabaseAdmin: SupabaseClient): Promise<Response> {
  console.log("Disconnecting Google Calendar for user:", user.id);
  
  try {
    const { error } = await supabaseAdmin
      .from('user_google_tokens')
      .delete()
      .eq('user_id', user.id);
      
    if (error) {
      console.error("Error disconnecting:", error);
      throw error;
    }
    
    console.log("Successfully disconnected user:", user.id);
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in disconnect:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function getUserToken(userId: string, supabaseAdmin: SupabaseClient) {
  const { data: tokenData, error } = await supabaseAdmin
    .from('user_google_tokens')
    .select('access_token, expires_at, refresh_token')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching token:", error);
    throw new Error('Failed to fetch token');
  }
    
  if (!tokenData) {
    throw new Error('Google Calendar not connected');
  }
  
  // Check if token is expired
  const expiresAt = new Date(tokenData.expires_at);
  const now = new Date();
  
  if (expiresAt <= now) {
    console.log("Token expired, needs refresh");
    throw new Error('Google Calendar token expired. Please reconnect.');
  }
  
  return tokenData;
}
