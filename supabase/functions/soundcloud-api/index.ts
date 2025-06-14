
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
        
        // Resolve user by URL
        const userResponse = await fetch(
          `https://api.soundcloud.com/resolve?url=https://soundcloud.com/${username}&client_id=${SOUNDCLOUD_CLIENT_ID}`
        )
        
        if (!userResponse.ok) {
          console.error('Failed to resolve SoundCloud user:', userResponse.status, userResponse.statusText)
          throw new Error(`Failed to resolve SoundCloud user: ${userResponse.statusText}`)
        }

        const user = await userResponse.json()
        console.log('User resolved successfully:', user.username)

        // Get user's playlists
        const playlistsResponse = await fetch(
          `https://api.soundcloud.com/users/${user.id}/playlists?client_id=${SOUNDCLOUD_CLIENT_ID}&limit=50`
        )
        
        if (!playlistsResponse.ok) {
          console.error('Failed to fetch playlists:', playlistsResponse.status, playlistsResponse.statusText)
          throw new Error(`Failed to fetch playlists: ${playlistsResponse.statusText}`)
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
        
        // Resolve user first
        const userResponse = await fetch(
          `https://api.soundcloud.com/resolve?url=https://soundcloud.com/${username}&client_id=${SOUNDCLOUD_CLIENT_ID}`
        )
        
        if (!userResponse.ok) {
          console.error('Failed to resolve SoundCloud user:', userResponse.status, userResponse.statusText)
          throw new Error(`Failed to resolve SoundCloud user: ${userResponse.statusText}`)
        }

        const user = await userResponse.json()
        
        const tracksResponse = await fetch(
          `https://api.soundcloud.com/users/${user.id}/tracks?client_id=${SOUNDCLOUD_CLIENT_ID}&limit=50`
        )
        
        if (!tracksResponse.ok) {
          console.error('Failed to fetch tracks:', tracksResponse.status, tracksResponse.statusText)
          throw new Error(`Failed to fetch tracks: ${tracksResponse.statusText}`)
        }

        const tracks = await tracksResponse.json()
        console.log(`Found ${tracks.length} tracks for user ${username}`)
        
        const transformedTracks = tracks.map((track) => ({
          id: track.id.toString(),
          title: track.title,
          artist: track.user?.username || username,
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
