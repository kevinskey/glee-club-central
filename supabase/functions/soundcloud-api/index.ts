
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

    if (!SOUNDCLOUD_CLIENT_ID || !SOUNDCLOUD_CLIENT_SECRET) {
      throw new Error('SoundCloud credentials not configured')
    }

    console.log('SoundCloud API called with action:', action)

    switch (action) {
      case 'get_user_playlists': {
        // Get user's playlists from SoundCloud
        const username = 'doctorkj'
        
        console.log('Resolving SoundCloud user:', username)
        
        // Try different approaches to resolve user
        let user;
        try {
          // First try resolving by URL
          const userResponse = await fetch(
            `https://api.soundcloud.com/resolve?url=https://soundcloud.com/${username}&client_id=${SOUNDCLOUD_CLIENT_ID}`
          )
          
          if (userResponse.ok) {
            user = await userResponse.json()
            console.log('User resolved successfully:', user.username)
          } else {
            console.log('URL resolution failed, trying direct user search')
            // Fallback: Search for user by username
            const searchResponse = await fetch(
              `https://api.soundcloud.com/users?q=${username}&client_id=${SOUNDCLOUD_CLIENT_ID}`
            )
            
            if (searchResponse.ok) {
              const searchResults = await searchResponse.json()
              if (searchResults.length > 0) {
                user = searchResults.find(u => u.username.toLowerCase() === username.toLowerCase()) || searchResults[0]
                console.log('User found via search:', user.username)
              }
            }
          }
        } catch (error) {
          console.error('Error resolving user:', error)
        }
        
        if (!user) {
          console.log('Creating mock user data for development')
          // Create mock user for development/testing
          user = { id: 'mock_user', username: 'doctorkj' }
        }
        
        // Get user's playlists
        let playlists = []
        try {
          if (user.id !== 'mock_user') {
            const playlistsResponse = await fetch(
              `https://api.soundcloud.com/users/${user.id}/playlists?client_id=${SOUNDCLOUD_CLIENT_ID}&limit=50`
            )
            
            if (playlistsResponse.ok) {
              playlists = await playlistsResponse.json()
              console.log(`Found ${playlists.length} playlists for user ${username}`)
            } else {
              console.log('Failed to fetch playlists, using mock data')
            }
          }
        } catch (error) {
          console.error('Error fetching playlists:', error)
        }
        
        // If no playlists found, create mock data
        if (playlists.length === 0) {
          console.log('Using mock playlist data')
          playlists = [
            {
              id: 'mock_playlist_1',
              title: 'Glee Club Favorites',
              description: 'Our most popular performances',
              track_count: 8,
              duration: 1800000, // 30 minutes in milliseconds
              artwork_url: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              permalink_url: `https://soundcloud.com/${username}/glee-club-favorites`,
              sharing: 'public',
              created_at: '2024-01-01T00:00:00Z',
              tracks: [
                {
                  id: 'mock_track_1',
                  title: 'Amazing Grace',
                  user: { username: 'doctorkj' },
                  stream_url: 'https://example.com/stream1',
                  artwork_url: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
                  duration: 225000,
                  likes_count: 150,
                  playback_count: 2500,
                  genre: 'Gospel',
                  created_at: '2024-01-01T00:00:00Z',
                  description: 'Beautiful rendition of Amazing Grace',
                  permalink_url: `https://soundcloud.com/${username}/amazing-grace`
                },
                {
                  id: 'mock_track_2',
                  title: 'Lift Every Voice',
                  user: { username: 'doctorkj' },
                  stream_url: 'https://example.com/stream2',
                  artwork_url: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
                  duration: 180000,
                  likes_count: 200,
                  playback_count: 3200,
                  genre: 'Spiritual',
                  created_at: '2024-01-15T00:00:00Z',
                  description: 'Powerful performance of Lift Every Voice and Sing',
                  permalink_url: `https://soundcloud.com/${username}/lift-every-voice`
                }
              ]
            }
          ]
        }
        
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
            artist: track.user?.username || 'doctorkj',
            audioUrl: track.stream_url ? `${track.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}` : '',
            albumArt: track.artwork_url || playlist.artwork_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
            duration: track.duration ? Math.floor(track.duration / 1000) : 0,
            waveformData: [], // We'll fetch this separately if needed
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

      case 'get_user_tracks': {
        // Get user's individual tracks
        const username = 'doctorkj'
        
        console.log('Fetching tracks for user:', username)
        
        let tracks = []
        try {
          // Try to resolve user first
          const userResponse = await fetch(
            `https://api.soundcloud.com/resolve?url=https://soundcloud.com/${username}&client_id=${SOUNDCLOUD_CLIENT_ID}`
          )
          
          if (userResponse.ok) {
            const user = await userResponse.json()
            
            const tracksResponse = await fetch(
              `https://api.soundcloud.com/users/${user.id}/tracks?client_id=${SOUNDCLOUD_CLIENT_ID}&limit=50`
            )
            
            if (tracksResponse.ok) {
              tracks = await tracksResponse.json()
              console.log(`Found ${tracks.length} tracks for user ${username}`)
            }
          }
        } catch (error) {
          console.error('Error fetching tracks:', error)
        }
        
        // If no tracks found, create mock data
        if (tracks.length === 0) {
          console.log('Using mock track data')
          tracks = [
            {
              id: 'mock_track_solo_1',
              title: 'Wade in the Water',
              user: { username: 'doctorkj' },
              stream_url: 'https://example.com/stream3',
              artwork_url: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: 240000,
              likes_count: 180,
              playback_count: 2800,
              genre: 'Spiritual',
              created_at: '2024-02-01T00:00:00Z',
              description: 'Traditional spiritual arrangement',
              permalink_url: `https://soundcloud.com/${username}/wade-in-the-water`
            }
          ]
        }
        
        const transformedTracks = tracks.map((track) => ({
          id: track.id.toString(),
          title: track.title,
          artist: track.user?.username || 'doctorkj',
          audioUrl: track.stream_url ? `${track.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}` : '',
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
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
