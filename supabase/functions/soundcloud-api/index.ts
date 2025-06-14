
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

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    const SOUNDCLOUD_CLIENT_ID = Deno.env.get('SOUNDCLOUD_CLIENT_ID')
    const SOUNDCLOUD_CLIENT_SECRET = Deno.env.get('SOUNDCLOUD_CLIENT_SECRET')

    if (!SOUNDCLOUD_CLIENT_ID || !SOUNDCLOUD_CLIENT_SECRET) {
      throw new Error('SoundCloud credentials not configured')
    }

    switch (action) {
      case 'get_user_playlists': {
        // Get user's playlists from SoundCloud
        const username = 'doctorkj'
        
        // First, resolve user by username
        const userResponse = await fetch(
          `https://api.soundcloud.com/resolve?url=https://soundcloud.com/${username}&client_id=${SOUNDCLOUD_CLIENT_ID}`
        )
        
        if (!userResponse.ok) {
          throw new Error('Failed to resolve SoundCloud user')
        }
        
        const user = await userResponse.json()
        console.log('SoundCloud user resolved:', user.username)
        
        // Get user's playlists
        const playlistsResponse = await fetch(
          `https://api.soundcloud.com/users/${user.id}/playlists?client_id=${SOUNDCLOUD_CLIENT_ID}&limit=50`
        )
        
        if (!playlistsResponse.ok) {
          throw new Error('Failed to fetch SoundCloud playlists')
        }
        
        const playlists = await playlistsResponse.json()
        console.log(`Found ${playlists.length} playlists for user ${username}`)
        
        // Transform to our format
        const transformedPlaylists = playlists.map((playlist: any) => ({
          id: playlist.id.toString(),
          name: playlist.title,
          description: playlist.description || '',
          track_count: playlist.track_count,
          duration: playlist.duration,
          artwork_url: playlist.artwork_url,
          permalink_url: playlist.permalink_url,
          is_public: playlist.sharing === 'public',
          created_at: playlist.created_at,
          tracks: playlist.tracks?.map((track: any) => ({
            id: track.id.toString(),
            title: track.title,
            artist: track.user?.username || 'Unknown Artist',
            audioUrl: track.stream_url ? `${track.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}` : '',
            albumArt: track.artwork_url || playlist.artwork_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
            duration: track.duration ? Math.floor(track.duration / 1000) : 0,
            waveformData: track.waveform_url ? [] : [], // We'll fetch this separately if needed
            likes: track.likes_count || 0,
            plays: track.playback_count || 0,
            isLiked: false,
            genre: track.genre || '',
            uploadDate: track.created_at,
            description: track.description || '',
            permalink_url: track.permalink_url
          })) || []
        }))
        
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
        
        const userResponse = await fetch(
          `https://api.soundcloud.com/resolve?url=https://soundcloud.com/${username}&client_id=${SOUNDCLOUD_CLIENT_ID}`
        )
        
        if (!userResponse.ok) {
          throw new Error('Failed to resolve SoundCloud user')
        }
        
        const user = await userResponse.json()
        
        const tracksResponse = await fetch(
          `https://api.soundcloud.com/users/${user.id}/tracks?client_id=${SOUNDCLOUD_CLIENT_ID}&limit=50`
        )
        
        if (!tracksResponse.ok) {
          throw new Error('Failed to fetch SoundCloud tracks')
        }
        
        const tracks = await tracksResponse.json()
        console.log(`Found ${tracks.length} tracks for user ${username}`)
        
        const transformedTracks = tracks.map((track: any) => ({
          id: track.id.toString(),
          title: track.title,
          artist: track.user?.username || 'doctorkj',
          audioUrl: track.stream_url ? `${track.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}` : '',
          albumArt: track.artwork_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          duration: track.duration ? Math.floor(track.duration / 1000) : 0,
          waveformData: track.waveform_url ? [] : [],
          likes: track.likes_count || 0,
          plays: track.playback_count || 0,
          isLiked: false,
          genre: track.genre || '',
          uploadDate: track.created_at,
          description: track.description || '',
          permalink_url: track.permalink_url
        }))
        
        return new Response(
          JSON.stringify({ tracks: transformedTracks }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }

      default:
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
