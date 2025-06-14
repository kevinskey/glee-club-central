
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
    
    if (!clientId) {
      console.error('SoundCloud Client ID not configured')
      throw new Error('SoundCloud Client ID not configured. Please add SOUNDCLOUD_CLIENT_ID to your edge function secrets.')
    }

    console.log('Using SoundCloud Client ID:', clientId.substring(0, 8) + '...')
    
    // SoundCloud username to fetch data from
    const soundcloudUsername = 'doctorkj'
    
    try {
      // Fetch user info first to get user ID
      console.log('Fetching user info for:', soundcloudUsername)
      const userResponse = await fetch(
        `https://api.soundcloud.com/users/${soundcloudUsername}?client_id=${clientId}`,
        {
          headers: {
            'User-Agent': 'Glee World App/1.0'
          }
        }
      )
      
      if (!userResponse.ok) {
        const errorText = await userResponse.text()
        console.error(`Failed to fetch user info: ${userResponse.status} - ${errorText}`)
        
        if (userResponse.status === 401) {
          throw new Error('Invalid SoundCloud Client ID. Please check your credentials.')
        } else if (userResponse.status === 404) {
          throw new Error(`SoundCloud user '${soundcloudUsername}' not found.`)
        } else {
          throw new Error(`SoundCloud API error: ${userResponse.status} - ${errorText}`)
        }
      }
      
      const userInfo = await userResponse.json()
      console.log('User info fetched successfully:', userInfo.username, 'ID:', userInfo.id)
      
      // Fetch user's tracks
      console.log('Fetching tracks for user ID:', userInfo.id)
      const tracksResponse = await fetch(
        `https://api.soundcloud.com/users/${userInfo.id}/tracks?client_id=${clientId}&limit=50`,
        {
          headers: {
            'User-Agent': 'Glee World App/1.0'
          }
        }
      )
      
      let tracks = []
      if (tracksResponse.ok) {
        tracks = await tracksResponse.json()
        console.log(`Successfully fetched ${tracks.length} tracks`)
      } else {
        console.warn(`Failed to fetch tracks: ${tracksResponse.status}`)
      }
      
      // Fetch user's playlists
      console.log('Fetching playlists for user ID:', userInfo.id)
      const playlistsResponse = await fetch(
        `https://api.soundcloud.com/users/${userInfo.id}/playlists?client_id=${clientId}&limit=50`,
        {
          headers: {
            'User-Agent': 'Glee World App/1.0'
          }
        }
      )
      
      let playlists = []
      if (playlistsResponse.ok) {
        playlists = await playlistsResponse.json()
        console.log(`Successfully fetched ${playlists.length} playlists`)
      } else {
        console.warn(`Failed to fetch playlists: ${playlistsResponse.status}`)
      }
      
      // Transform tracks data to match our interface
      const transformedTracks = tracks.map((track: any) => ({
        id: track.id.toString(),
        title: track.title || 'Untitled',
        artist: track.user?.username || userInfo.username || 'Unknown Artist',
        audioUrl: track.stream_url ? `${track.stream_url}?client_id=${clientId}` : '',
        albumArt: track.artwork_url || track.user?.avatar_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
        duration: Math.floor((track.duration || 0) / 1000), // Convert to seconds
        waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
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
        name: playlist.title || 'Untitled Playlist',
        description: playlist.description || '',
        track_count: playlist.track_count || 0,
        duration: playlist.duration || 0,
        artwork_url: playlist.artwork_url || '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
        permalink_url: playlist.permalink_url || '',
        is_public: playlist.sharing === 'public',
        created_at: playlist.created_at || new Date().toISOString(),
        tracks: (playlist.tracks || []).map((track: any) => ({
          id: track.id.toString(),
          title: track.title || 'Untitled',
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
        }))
      }))

      const responseData = {
        playlists: transformedPlaylists,
        tracks: transformedTracks,
        status: 'success',
        message: `Successfully fetched ${transformedTracks.length} tracks and ${transformedPlaylists.length} playlists from SoundCloud user '${userInfo.username}'`
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

    } catch (fetchError) {
      console.error('Error during SoundCloud API calls:', fetchError)
      throw fetchError
    }

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
