
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, eventTypes, location, startTime, callTime, type } = await req.json();

    if (!title) {
      throw new Error('Event title is required');
    }

    if (!type || !['short', 'full'].includes(type)) {
      throw new Error('Description type must be either "short" or "full"');
    }

    console.log('Generating description for:', { title, type, eventTypes, location });

    // Create context for the AI
    const eventContext = [];
    if (eventTypes && eventTypes.length > 0) {
      eventContext.push(`Event types: ${eventTypes.join(', ')}`);
    }
    if (location) {
      eventContext.push(`Location: ${location}`);
    }
    if (startTime) {
      const date = new Date(startTime);
      eventContext.push(`Date: ${date.toLocaleDateString()}`);
    }
    if (callTime) {
      const date = new Date(callTime);
      eventContext.push(`Call time: ${date.toLocaleTimeString()}`);
    }

    const contextString = eventContext.length > 0 ? `\n\nAdditional context:\n${eventContext.join('\n')}` : '';

    const prompt = type === 'short' 
      ? `Write a brief, engaging 1-2 sentence description for a Spelman College Glee Club event titled "${title}". Keep it concise and inviting.${contextString}`
      : `Write a detailed, compelling description for a Spelman College Glee Club event titled "${title}". Include information about what attendees can expect, the significance of the event, and why they should attend. Make it engaging and informative, around 3-4 sentences.${contextString}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional event marketing writer for the prestigious Spelman College Glee Club. Write descriptions that are engaging, professional, and capture the excellence and tradition of this renowned choir.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedDescription = data.choices[0].message.content.trim();

    console.log('Generated description:', generatedDescription);

    return new Response(JSON.stringify({ description: generatedDescription }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-event-descriptions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
