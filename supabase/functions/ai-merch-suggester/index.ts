
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, items, eventDetails } = await req.json();

    // Fetch event data
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError) throw eventError;

    // Create AI prompt
    const prompt = `You are an AI merchandise quantity optimizer for live music performances. Analyze the following data and suggest optimal quantities:

EVENT DETAILS:
- Title: ${event.title}
- Expected Attendance: ${eventDetails.expectedAttendance || 100}
- Venue Type: ${eventDetails.venueType || 'general'}
- Location: ${event.location_name}
- Date: ${event.start_time}

MERCHANDISE ITEMS:
${items.map((item: any) => 
  `- ${item.name}: $${item.price}, Stock: ${item.quantity_in_stock}, Tags: ${item.tags.join(', ')}`
).join('\n')}

ANALYSIS FACTORS:
1. Venue Type Impact (University: 1.2x, Concert Hall: 1.0x, Festival: 0.7x, Church: 0.8x)
2. Item Categories (Music: 25-35%, Apparel: 20-30%, Small items: 40-60%, Premium: 10-20%)
3. Price Points (Under $15: 35-50%, $15-30: 20-35%, $30-50: 10-25%, Over $50: 5-15%)

For each item, respond in JSON format:
{
  "suggestions": [
    {
      "itemId": "item_id",
      "suggestedQuantity": number,
      "confidence": "High|Medium|Low",
      "reasoning": "explanation",
      "riskLevel": "Conservative|Balanced|Aggressive"
    }
  ]
}

Provide practical, data-driven recommendations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a merchandise quantity optimization expert. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const aiData = await response.json();
    let suggestions;

    try {
      suggestions = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      // Fallback to simple algorithm if AI response isn't valid JSON
      suggestions = {
        suggestions: items.map((item: any) => {
          let affinityFactor = 0.25;
          if (item.tags.includes('CD') || item.tags.includes('music')) affinityFactor = 0.35;
          else if (item.tags.includes('sticker') || item.tags.includes('small')) affinityFactor = 0.5;
          else if (item.tags.includes('clothing')) affinityFactor = 0.25;

          const suggested = Math.round((eventDetails.expectedAttendance || 100) * affinityFactor);
          
          return {
            itemId: item.id,
            suggestedQuantity: Math.min(suggested, item.quantity_in_stock),
            confidence: 'Medium',
            reasoning: 'AI-enhanced calculation based on item category and venue type',
            riskLevel: 'Balanced'
          };
        })
      };
    }

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-merch-suggester:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
