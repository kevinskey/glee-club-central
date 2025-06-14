
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action } = await req.json()
    
    const SOUNDCLOUD_CLIENT_ID = Deno.env.get('SOUNDCLOUD_CLIENT_ID')
    const SOUNDCLOUD_CLIENT_SECRET = Deno.env.get('SOUNDCLOUD_CLIENT_SECRET')

    console.log('SoundCloud API called with action:', action)
    console.log('Client ID exists:', !!SOUNDCLOUD_CLIENT_ID)
    console.log('Client Secret exists:', !!SOUNDCLOUD_CLIENT_SECRET)

    if (!SOUNDCLOUD_CLIENT_ID || !SOUNDCLOUD_CLIENT_SECRET) {
      throw new Error('SoundCloud API credentials are not configured')
    }

    // Get OAuth token first
    const tokenResponse = await fetch('https://api.soundcloud.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': SOUNDCLOUD_CLIENT_ID,
        'client_secret': SOUNDCLOUD_CLIENT_SECRET
      })
    });

    if (!tokenResponse.ok) {
      console.error('Failed to get OAuth token:', tokenResponse.status, tokenResponse.statusText);
      const errorText = await tokenResponse.text();
      console.error('Token error response:', errorText);
      
      // Return mock data as fallback
      return new Response(
        JSON.stringify({ 
          playlists: [{
            id: 'mock-playlist-1',
            name: 'Featured Tracks',
            description: 'A collection of our best performances',
            track_count: 5,
            duration: 900000, // 15 minutes in milliseconds
            artwork_url: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
            permalink_url: '#',
            is_public: true,
            created_at: new Date().toISOString(),
            tracks: [
              {
                id: 'mock-track-1',
                title: 'Amazing Grace',
                artist: 'Spelman Glee Club',
                audioUrl: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png', // This would be an audio file
                albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
                duration: 180,
                waveformData: [],
                likes: 245,
                plays: 1500,
                isLiked: false,
                genre: 'Gospel',
                uploadDate: new Date().toISOString(),
                description: 'Traditional hymn performed by the Spelman College Glee Club',
                permalink_url: '#'
              }
            ]
          }],
          tracks: [],
          note: 'Using mock data - SoundCloud OAuth authentication failed'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('Failed to obtain access token from SoundCloud');
    }

    console.log('Successfully obtained OAuth token');

    switch (action) {
      case 'get_user_playlists': {
        const username = 'doctorkj'
        
        console.log('Resolving SoundCloud user:', username)
        
        // Try to resolve user by URL with OAuth token
        const userResponse = await fetch(
          `https://api.soundcloud.com/resolve?url=https://soundcloud.com/${username}`,
          {
            headers: {
              'Authorization': `OAuth ${accessToken}`
            }
          }
        );
        
        console.log('User resolve response status:', userResponse.status)
        
        if (!userResponse.ok) {
          console.log('URL resolution failed, trying direct user search')
          const searchResponse = await fetch(
            `https://api.soundcloud.com/users?q=${username}`,
            {
              headers: {
                'Authorization': `OAuth ${accessToken}`
              }
            }
          );
          
          if (!searchResponse.ok) {
            console.error('Both user resolution methods failed')
            throw new Error(`Failed to find SoundCloud user: ${searchResponse.status}`)
          }
          
          const users = await searchResponse.json()
          if (!users || users.length === 0) {
            throw new Error(`No SoundCloud user found with username: ${username}`)
          }
          
          const user = users[0]
          console.log('Found user via search:', user.username)
        } else {
          const user = await userResponse.json()
          console.log('User resolved successfully:', user.username)
          
          // Get user's playlists
          const playlistsResponse = await fetch(
            `https://api.soundcloud.com/users/${user.id}/playlists?limit=50`,
            {
              headers: {
                'Authorization': `OAuth ${accessToken}`
              }
            }
          );
          
          console.log('Playlists response status:', playlistsResponse.status)
          
          if (!playlistsResponse.ok) {
            console.error('Failed to fetch playlists:', playlistsResponse.status)
            throw new Error(`Failed to fetch playlists: ${playlistsResponse.status}`)
          }

          const playlists = await playlistsResponse.json()
          console.log(`Found ${playlists.length} playlists for user ${username}`)
          
          // Transform to our format
          const transformedPlaylists = playlists.map((playlist) => ({
            id: playlist.id.toString(),
            name: playlist.title,
            description: playlist.description || '',
            track_count: playlist.track_count || 0,
            duration: playlist.duration || 0,
            artwork_url: playlist.artwork_url,
            permalink_url: playlist.permalink_url,
            is_public: playlist.sharing === 'public',
            created_at: playlist.created_at,
            tracks: (playlist.tracks || []).map((track) => ({
              id: track.id.toString(),
              title: track.title,
              artist: track.user?.username || username,
              audioUrl: track.stream_url ? `${track.stream_url}?oauth_token=${accessToken}` : '',
              albumArt: track.artwork_url || playlist.artwork_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: track.duration ? Math.floor(track.duration / 1000) : 0,
              waveformData: [],
              likes: track.likes_count || 0,
              plays: track.playback_count || 0,
              isLiked: false,
              genre: track.genre || '',
              uploadDate: track.created_at,
              description: track.description || '',
              permalink_url: track.permalink_url
            }))
          }))
          
          console.log('Returning transformed playlists:', transformedPlaylists.length)
          
          return new Response(
            JSON.stringify({ playlists: transformedPlaylists }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          )
        }
      }

      case 'get_user_tracks': {
        const username = 'doctorkj'
        
        console.log('Fetching tracks for user:', username)
        
        // Resolve user first
        const userResponse = await fetch(
          `https://api.soundcloud.com/resolve?url=https://soundcloud.com/${username}`,
          {
            headers: {
              'Authorization': `OAuth ${accessToken}`
            }
          }
        );
        
        console.log('User resolve response status:', userResponse.status)
        
        if (!userResponse.ok) {
          console.error('Failed to resolve SoundCloud user:', userResponse.status)
          throw new Error(`Failed to resolve SoundCloud user: ${userResponse.status}`)
        }

        const user = await userResponse.json()
        
        const tracksResponse = await fetch(
          `https://api.soundcloud.com/users/${user.id}/tracks?limit=50`,
          {
            headers: {
              'Authorization': `OAuth ${accessToken}`
            }
          }
        );
        
        console.log('Tracks response status:', tracksResponse.status)
        
        if (!tracksResponse.ok) {
          console.error('Failed to fetch tracks:', tracksResponse.status)
          throw new Error(`Failed to fetch tracks: ${tracksResponse.status}`)
        }

        const tracks = await tracksResponse.json()
        console.log(`Found ${tracks.length} tracks for user ${username}`)
        
        const transformedTracks = tracks.map((track) => ({
          id: track.id.toString(),
          title: track.title,
          artist: track.user?.username || username,
          audioUrl: track.stream_url ? `${track.stream_url}?oauth_token=${accessToken}` : '',
          albumArt: track.artwork_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          duration: track.duration ? Math.floor(track.duration / 1000) : 0,
          waveformData: [],
          likes: track.likes_count || 0,
          plays: track.playback_count || 0,
          isLiked: false,
          genre: track.genre || '',
          uploadDate: track.created_at,
          description: track.description || '',
          permalink_url: track.permalink_url
        }))
        
        console.log('Returning transformed tracks:', transformedTracks.length)
        
        return new Response(
          JSON.stringify({ tracks: transformedTracks }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }

      default:
        console.log('Invalid action received:', action)
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
    }
  } catch (error) {
    console.error('SoundCloud API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the edge function logs for more information'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
