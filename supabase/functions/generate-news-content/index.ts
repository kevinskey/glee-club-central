
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, newsType = 'general', customPrompt } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Predefined prompts for different news categories
    const newsPrompts = {
      hbcu: "Generate a compelling news headline and brief content about recent achievements, events, or positive developments in HBCU (Historically Black Colleges and Universities) community. Focus on academic excellence, cultural impact, and student success stories.",
      spelman: "Generate a compelling news headline and brief content about Spelman College - focus on academic achievements, notable alumni, campus events, or institutional accomplishments. Keep it professional and inspiring.",
      music: "Generate a compelling news headline and brief content about choral music, collegiate choir achievements, classical music performances, or music education developments. Focus on excellence and artistic achievement.",
      scholarship: "Generate a compelling news headline and brief content about new scholarship opportunities, educational funding, or financial aid programs specifically for music students or HBCU students.",
      general: "Generate a compelling news headline and brief content suitable for a college glee club website. Focus on positive, engaging content about music, education, or community achievements."
    }

    const systemPrompt = customPrompt || newsPrompts[newsType as keyof typeof newsPrompts] || newsPrompts.general

    const fullPrompt = `${systemPrompt}

Please return a JSON response with the following structure:
{
  "headline": "A compelling, engaging headline (max 100 characters)",
  "content": "A brief but informative content piece (2-3 sentences, max 300 characters)"
}

Make sure the content is appropriate for a college glee club website, positive in tone, and engaging for both current members and fans.`

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates news content for a college glee club website. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const data = await openaiResponse.json()
    let generatedContent

    try {
      generatedContent = JSON.parse(data.choices[0].message.content)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      const content = data.choices[0].message.content
      generatedContent = {
        headline: content.substring(0, 100),
        content: content.substring(0, 300)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: generatedContent,
        prompt: systemPrompt
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error generating news content:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
