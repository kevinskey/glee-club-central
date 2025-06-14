
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('SoundCloud API function invoked - returning empty data', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Returning empty SoundCloud data (reset)')
    
    // Return completely empty data structure
    const emptyData = {
      playlists: [],
      tracks: [],
      status: 'success',
      message: 'SoundCloud data has been reset - no content available'
    }

    console.log('SoundCloud data reset successfully')
    
    return new Response(
      JSON.stringify(emptyData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SoundCloud API Reset Error:', error)
    
    const errorResponse = {
      playlists: [],
      tracks: [],
      status: 'error',
      message: 'Failed to reset SoundCloud data',
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
