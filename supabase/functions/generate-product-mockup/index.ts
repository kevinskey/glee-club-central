
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
    console.log('Starting Amazon-style mockup generation...');

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

    const { 
      userImageUrl, 
      productType, 
      designName, 
      designDescription,
      brandInfo,
      amazonStyle = true,
      singleMockup = true 
    } = await req.json();

    console.log('Generating mockup for:', { 
      productType, 
      designName, 
      designDescription, 
      brandInfo,
      amazonStyle,
      singleMockup 
    });

    // Amazon-style product photography prompts
    const amazonStylePrompts = {
      't-shirt': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} t-shirt with "${designName}" design printed on the front center chest area. Pure white background, studio lighting with soft shadows. The t-shirt should be laid flat or displayed on an invisible mannequin in a front-facing view. Design should be clearly visible with realistic fabric printing texture showing screen-printing quality. Professional e-commerce photography style with even lighting, sharp focus, and high contrast. No wrinkles, perfect presentation suitable for Amazon product listing.`,
      
      'hoodie': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} pullover hoodie featuring "${designName}" design on the front chest area. Clean white studio background with professional lighting. Display the hoodie front-facing, showing the design clearly with realistic embroidered or screen-printed texture. Include hoodie details like drawstrings and kangaroo pocket. Studio photography with soft, even lighting and minimal shadows for e-commerce use.`,
      
      'tank-top': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} tank top with "${designName}" design on the front center. Pure white background, professional studio lighting. Front-facing view showing the design with realistic printing quality. Clean, minimalist e-commerce photography suitable for Amazon product listing with sharp details and professional presentation.`,
      
      'long-sleeve': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} long sleeve shirt featuring "${designName}" design on the front chest. Clean white studio background with professional lighting. Front-facing display showing design clarity with realistic screen-printing texture. E-commerce quality photography with even lighting and sharp focus.`
    };

    let enhancedPrompt = amazonStylePrompts[productType as keyof typeof amazonStylePrompts] || amazonStylePrompts['t-shirt'];
    
    // Add design context and color information
    if (designDescription) {
      enhancedPrompt += ` Design context: ${designDescription}.`;
    }
    
    if (brandInfo?.color) {
      enhancedPrompt += ` The garment color is ${brandInfo.color.name} (${brandInfo.color.hex}).`;
    }
    
    // Add Amazon-specific technical requirements
    enhancedPrompt += ` Amazon product photography requirements: 1024x1024 resolution, pure white background (RGB 255,255,255), professional studio lighting with soft shadows, high contrast and sharpness, product fills 85% of frame, no logo watermarks, clean and professional presentation. The image should meet Amazon's image guidelines for main product photos.`;

    console.log('Enhanced Amazon-style prompt:', enhancedPrompt);
    console.log('Sending request to OpenAI DALL-E 3...');

    // Generate single mockup using DALL-E 3 with Amazon specifications
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1, // Single mockup as requested
        size: '1024x1024',
        quality: 'hd',
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

    // Upload to Supabase storage with Amazon-style naming
    const timestamp = Date.now();
    const sanitizedName = designName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const colorName = brandInfo?.color?.name?.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'default';
    const fileName = `amazon-mockup-${productType}-${sanitizedName}-${colorName}-${timestamp}.png`;
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

    console.log('Amazon-style mockup generated successfully:', publicUrl);

    return new Response(JSON.stringify({ 
      mockupUrl: publicUrl,
      success: true,
      productType,
      designName,
      brandInfo,
      fileName,
      amazonStyle: true
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
