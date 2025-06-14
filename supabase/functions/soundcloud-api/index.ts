

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
    console.log('Processing SoundCloud API request')
    
    // Return empty data instead of mock data
    const emptyData = {
      playlists: [],
      tracks: [],
      status: 'success',
      message: 'No SoundCloud content available at the moment'
    }

    console.log('Returning empty data')
    
    const response = new Response(
      JSON.stringify(emptyData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )
    
    console.log('Response created successfully')
    return response

  } catch (error) {
    console.error('SoundCloud API Error:', error)
    
    const errorResponse = {
      playlists: [],
      tracks: [],
      status: 'error',
      message: error?.message || 'Failed to load SoundCloud content',
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

