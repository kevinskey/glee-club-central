
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
      designText,
      productType, 
      designName, 
      designDescription,
      brandInfo,
      designColor,
      placement = 'full-front',
      amazonStyle = true,
      singleMockup = true 
    } = await req.json();

    console.log('Generating mockup for:', { 
      productType, 
      designName, 
      designDescription, 
      brandInfo,
      designColor,
      placement,
      hasImage: !!userImageUrl,
      hasText: !!designText,
      amazonStyle,
      singleMockup 
    });

    // Enhanced placement descriptions for better AI understanding
    const placementDescriptions = {
      'full-front': 'large design covering most of the front chest area',
      'full-back': 'large design covering most of the back area',
      'left-chest': 'small logo-sized design on the left chest area (3-4 inches)',
      'pocket': 'small design in the pocket area or where a pocket would be',
      'sleeve': 'design placed on the sleeve or arm area'
    };

    const placementDesc = placementDescriptions[placement as keyof typeof placementDescriptions] || placementDescriptions['full-front'];

    // Amazon-style product photography prompts for text-based designs
    const textDesignPrompts = {
      't-shirt': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} t-shirt with the text "${designText}" printed as a ${placementDesc}. The text should be in ${designColor?.name || 'black'} color. Pure white background, studio lighting with soft shadows. The t-shirt should be laid flat or displayed on an invisible mannequin in a front-facing view. Text should be clearly visible with realistic fabric printing texture showing screen-printing quality. Professional e-commerce photography style with even lighting, sharp focus, and high contrast. No wrinkles, perfect presentation suitable for Amazon product listing.`,
      
      'hoodie': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} pullover hoodie featuring the text "${designText}" printed as a ${placementDesc}. The text should be in ${designColor?.name || 'black'} color. Clean white studio background with professional lighting. Display the hoodie front-facing, showing the text clearly with realistic embroidered or screen-printed texture. Include hoodie details like drawstrings and kangaroo pocket. Studio photography with soft, even lighting and minimal shadows for e-commerce use.`,
      
      'sweatshirt': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} sweatshirt featuring the text "${designText}" printed as a ${placementDesc}. The text should be in ${designColor?.name || 'black'} color. Clean white studio background with professional lighting. Front-facing display showing text clarity with realistic screen-printing texture. E-commerce quality photography with even lighting and sharp focus.`,

      'tank-top': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} tank top with the text "${designText}" printed as a ${placementDesc}. The text should be in ${designColor?.name || 'black'} color. Pure white background, professional studio lighting. Front-facing view showing the text with realistic printing quality. Clean, minimalist e-commerce photography suitable for Amazon product listing with sharp details and professional presentation.`,
      
      'long-sleeve': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} long sleeve shirt featuring the text "${designText}" printed as a ${placementDesc}. The text should be in ${designColor?.name || 'black'} color. Clean white studio background with professional lighting. Front-facing display showing text clarity with realistic screen-printing texture. E-commerce quality photography with even lighting and sharp focus.`
    };

    // Amazon-style product photography prompts for image-based designs
    const imageDesignPrompts = {
      't-shirt': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} t-shirt with "${designName}" design printed as a ${placementDesc}. The design should be rendered in ${designColor?.name || 'black'} color scheme. Pure white background, studio lighting with soft shadows. The t-shirt should be laid flat or displayed on an invisible mannequin in a front-facing view. Design should be clearly visible with realistic fabric printing texture showing screen-printing quality. Professional e-commerce photography style with even lighting, sharp focus, and high contrast. No wrinkles, perfect presentation suitable for Amazon product listing.`,
      
      'hoodie': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} pullover hoodie featuring "${designName}" design as a ${placementDesc}. The design should be rendered in ${designColor?.name || 'black'} color scheme. Clean white studio background with professional lighting. Display the hoodie front-facing, showing the design clearly with realistic embroidered or screen-printed texture. Include hoodie details like drawstrings and kangaroo pocket. Studio photography with soft, even lighting and minimal shadows for e-commerce use.`,
      
      'sweatshirt': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} sweatshirt featuring "${designName}" design as a ${placementDesc}. The design should be rendered in ${designColor?.name || 'black'} color scheme. Clean white studio background with professional lighting. Front-facing display showing design clarity with realistic screen-printing texture. E-commerce quality photography with even lighting and sharp focus.`,

      'tank-top': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} tank top with "${designName}" design as a ${placementDesc}. The design should be rendered in ${designColor?.name || 'black'} color scheme. Pure white background, professional studio lighting. Front-facing view showing the design with realistic printing quality. Clean, minimalist e-commerce photography suitable for Amazon product listing with sharp details and professional presentation.`,
      
      'long-sleeve': `Professional Amazon product photography of a ${brandInfo?.color?.name || 'colored'} ${brandInfo?.brand || 'premium'} long sleeve shirt featuring "${designName}" design as a ${placementDesc}. The design should be rendered in ${designColor?.name || 'black'} color scheme. Clean white studio background with professional lighting. Front-facing display showing design clarity with realistic screen-printing texture. E-commerce quality photography with even lighting and sharp focus.`
    };

    let enhancedPrompt;
    
    if (designText) {
      // Use text-based prompts
      enhancedPrompt = textDesignPrompts[productType as keyof typeof textDesignPrompts] || textDesignPrompts['t-shirt'];
    } else {
      // Use image-based prompts
      enhancedPrompt = imageDesignPrompts[productType as keyof typeof imageDesignPrompts] || imageDesignPrompts['t-shirt'];
    }
    
    // Add design context and color information
    if (designDescription) {
      enhancedPrompt += ` Design context: ${designDescription}.`;
    }
    
    if (brandInfo?.color) {
      enhancedPrompt += ` The garment color is ${brandInfo.color.name} (${brandInfo.color.hex}).`;
    }

    if (designColor) {
      enhancedPrompt += ` The design/text color is ${designColor.name} (${designColor.hex}).`;
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
    const designColorName = designColor?.name?.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'black';
    const designType = designText ? 'text' : 'image';
    const fileName = `amazon-mockup-${productType}-${designType}-${sanitizedName}-${colorName}-${designColorName}-${placement}-${timestamp}.png`;
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
      designText,
      brandInfo,
      designColor,
      placement,
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
