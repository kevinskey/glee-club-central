
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

    console.log('Generating mockup for:', { productType, designName, designDescription });

    // Enhanced product-specific prompts with better detail and context
    const productPrompts = {
      't-shirt': `Professional product photography of a ${designName} design printed on a premium cotton t-shirt. The shirt should be displayed on a clean white studio background with soft, even lighting. Show the t-shirt from a slight front angle to showcase the design clearly. The design should be prominently placed on the chest area with realistic fabric printing texture. Use professional e-commerce photography style with subtle shadows and highlights that emphasize the quality of both the garment and the printed design.`,
      
      'hoodie': `High-quality product mockup of a ${designName} design on a premium pullover hoodie. Professional studio photography on a clean white background. The hoodie should be displayed flat or on a hanger, front-facing view. The design should be centered on the chest area with realistic screen-printing or embroidered appearance. Show the hoodie's texture, drawstrings, and kangaroo pocket. Use soft, diffused lighting with minimal shadows for an e-commerce ready appearance.`,
      
      'mug': `Clean, professional product photography of a white ceramic coffee mug featuring the ${designName} design. Place the mug at a 3/4 angle on a pure white background. The design should wrap around the visible side of the mug with realistic printing quality - crisp edges and vibrant colors that look professionally applied. Use studio lighting with soft shadows to create depth. The mug should appear premium quality with a smooth, glossy finish.`,
      
      'tote-bag': `Professional product mockup of a natural canvas tote bag featuring the ${designName} design. Show the bag from a slight front angle on a clean white background. The design should be prominently displayed on the front center of the bag with realistic screen-printing texture. Include the bag's handles and show its natural canvas texture. Use soft, even lighting typical of e-commerce product photography.`,
      
      'phone-case': `Clean product photography of a modern smartphone case featuring the ${designName} design on the back. Show the case at a slight angle on a white background to display the design clearly. The case should appear to be made of quality materials (plastic, silicone, or clear) with the design printed or embedded professionally. Use studio lighting with minimal shadows to highlight both the case design and the printed artwork.`,
      
      'sticker': `Professional product photography showing multiple ${designName} vinyl stickers arranged attractively on a white background. Display 3-5 stickers of the same design in a scattered but organized layout. The stickers should have a glossy, high-quality vinyl finish with vibrant colors and sharp edges. Show realistic printing quality with slight reflections from studio lighting to emphasize the premium vinyl material.`
    };

    let enhancedPrompt = productPrompts[productType as keyof typeof productPrompts] || productPrompts['t-shirt'];
    
    // Add design description context if provided
    if (designDescription) {
      enhancedPrompt += ` Design context: ${designDescription}.`;
    }
    
    // Add specific styling and quality instructions
    enhancedPrompt += ` Technical requirements: 1024x1024 resolution, photorealistic rendering, professional commercial photography quality, accurate color reproduction, sharp details, clean composition suitable for online retail. The final image should look like a professional product photo ready for an e-commerce website.`;

    console.log('Enhanced prompt:', enhancedPrompt);
    console.log('Sending request to OpenAI...');

    // Generate the mockup using DALL-E with enhanced parameters
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd', // Use HD quality for better results
        style: 'natural', // Natural style for product photography
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

    // Upload to Supabase storage with better naming
    const timestamp = Date.now();
    const sanitizedName = designName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const fileName = `mockup-${productType}-${sanitizedName}-${timestamp}.png`;
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
      success: true,
      productType,
      designName,
      fileName
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
