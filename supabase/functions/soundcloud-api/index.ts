
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('SoundCloud API function invoked', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const clientId = Deno.env.get('SOUNDCLOUD_CLIENT_ID')
    const clientSecret = Deno.env.get('SOUNDCLOUD_CLIENT_SECRET')
    
    if (!clientId) {
      throw new Error('SoundCloud Client ID not configured')
    }

    console.log('Fetching SoundCloud data from API')
    
    // SoundCloud user ID for doctorkj (this would need to be obtained from SoundCloud)
    // For now, we'll use a placeholder approach
    const soundcloudUsername = 'doctorkj'
    
    // Fetch user info first to get user ID
    const userResponse = await fetch(
      `https://api.soundcloud.com/users/${soundcloudUsername}?client_id=${clientId}`
    )
    
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user info: ${userResponse.status}`)
    }
    
    const userInfo = await userResponse.json()
    console.log('User info fetched:', userInfo.username)
    
    // Fetch user's tracks
    const tracksResponse = await fetch(
      `https://api.soundcloud.com/users/${userInfo.id}/tracks?client_id=${clientId}&limit=50`
    )
    
    if (!tracksResponse.ok) {
      throw new Error(`Failed to fetch tracks: ${tracksResponse.status}`)
    }
    
    const tracks = await tracksResponse.json()
    console.log(`Fetched ${tracks.length} tracks`)
    
    // Fetch user's playlists
    const playlistsResponse = await fetch(
      `https://api.soundcloud.com/users/${userInfo.id}/playlists?client_id=${clientId}&limit=50`
    )
    
    if (!playlistsResponse.ok) {
      throw new Error(`Failed to fetch playlists: ${playlistsResponse.status}`)
    }
    
    const playlists = await playlistsResponse.json()
    console.log(`Fetched ${playlists.length} playlists`)
    
    // Transform tracks data to match our interface
    const transformedTracks = tracks.map((track: any) => ({
      id: track.id.toString(),
      title: track.title,
      artist: track.user?.username || 'Unknown Artist',
      audioUrl: track.stream_url ? `${track.stream_url}?client_id=${clientId}` : '',
      albumArt: track.artwork_url || track.user?.avatar_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
      duration: Math.floor((track.duration || 0) / 1000), // Convert to seconds
      waveformData: track.waveform_url ? [] : Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
      likes: track.likes_count || 0,
      plays: track.playback_count || 0,
      isLiked: track.user_favorite || false,
      genre: track.genre || 'Unknown',
      uploadDate: track.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      description: track.description || '',
      permalink_url: track.permalink_url || ''
    }))
    
    // Transform playlists data
    const transformedPlaylists = playlists.map((playlist: any) => ({
      id: playlist.id.toString(),
      name: playlist.title,
      description: playlist.description || '',
      track_count: playlist.track_count || 0,
      duration: playlist.duration || 0,
      artwork_url: playlist.artwork_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
      permalink_url: playlist.permalink_url || '',
      is_public: playlist.sharing === 'public',
      created_at: playlist.created_at || new Date().toISOString(),
      tracks: playlist.tracks ? playlist.tracks.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.user?.username || 'Unknown Artist',
        audioUrl: track.stream_url ? `${track.stream_url}?client_id=${clientId}` : '',
        albumArt: track.artwork_url || track.user?.avatar_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
        duration: Math.floor((track.duration || 0) / 1000),
        waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
        likes: track.likes_count || 0,
        plays: track.playback_count || 0,
        isLiked: track.user_favorite || false,
        genre: track.genre || 'Unknown',
        uploadDate: track.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        description: track.description || '',
        permalink_url: track.permalink_url || ''
      })) : []
    }))

    const responseData = {
      playlists: transformedPlaylists,
      tracks: transformedTracks,
      status: 'success',
      message: `Successfully fetched ${transformedTracks.length} tracks and ${transformedPlaylists.length} playlists from SoundCloud`
    }

    console.log('SoundCloud data processed successfully')
    
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SoundCloud API Error:', error)
    
    const errorResponse = {
      playlists: [],
      tracks: [],
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to load SoundCloud content',
      error: true
    }
    
    return new Response(
      JSON.stringify(errorResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    )
  }
})
