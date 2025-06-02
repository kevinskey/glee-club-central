
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
    console.log('Starting mockup generation...');

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userImageUrl, productType, designName, designDescription } = await req.json();

    console.log('Generating mockup for:', { productType, designName });

    // Create a detailed prompt for DALL-E based on the product type
    const productPrompts = {
      't-shirt': 'a high-quality product mockup of a custom t-shirt on a clean white background, front view, realistic fabric texture, professional photography style',
      'hoodie': 'a professional product mockup of a custom hoodie on a clean white background, front view, realistic cotton blend texture, studio lighting',
      'mug': 'a clean product mockup of a custom coffee mug on a white background, slight angle view, ceramic finish, professional product photography',
      'tote-bag': 'a professional mockup of a custom canvas tote bag on a white background, slight angle view, natural canvas texture, clean composition',
      'phone-case': 'a sleek product mockup of a custom phone case on a white background, slight angle view, modern design, professional photography',
      'sticker': 'a clean mockup of custom stickers on a white background, arranged attractively, high-quality vinyl finish, professional presentation'
    };

    const basePrompt = productPrompts[productType as keyof typeof productPrompts] || productPrompts['t-shirt'];
    
    const prompt = `Create ${basePrompt}. The design should incorporate elements that would work well with custom graphics. Style: professional product photography, clean composition, soft shadows, e-commerce ready. High resolution, photorealistic.`;

    console.log('Sending request to OpenAI...');

    // Generate the mockup using DALL-E
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const aiData = await response.json();
    const generatedImageUrl = aiData.data[0].url;

    console.log('AI image generated, downloading...');

    // Download the generated image
    const imageResponse = await fetch(generatedImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download generated image: ${imageResponse.status}`);
    }
    
    const imageBlob = await imageResponse.blob();

    console.log('Uploading to Supabase storage...');

    // Upload to Supabase storage
    const fileName = `mockup-${productType}-${Date.now()}.png`;
    const filePath = `generated-mockups/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media-library')
      .upload(filePath, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media-library')
      .getPublicUrl(filePath);

    console.log('Mockup generated successfully:', publicUrl);

    return new Response(JSON.stringify({ 
      mockupUrl: publicUrl,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-product-mockup:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
