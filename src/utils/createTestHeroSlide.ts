
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function createTestHeroSlide() {
  try {
    console.log('🧪 Creating test hero slide...');
    
    // First, check if any slides exist for homepage-main
    const { data: existingSlides, error: fetchError } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('section_id', 'homepage-main');

    if (fetchError) {
      console.error('Error fetching existing slides:', fetchError);
      throw fetchError;
    }

    console.log('Existing slides for homepage-main:', existingSlides);

    // Create a test slide
    const testSlide = {
      section_id: 'homepage-main',
      media_type: 'image' as const,
      title: 'Test Hero Slide',
      description: 'This is a test slide to verify the hero system is working correctly.',
      text_position: 'center' as const,
      text_alignment: 'center' as const,
      visible: true,
      slide_order: existingSlides ? existingSlides.length : 0,
      button_text: 'Learn More',
      button_link: '/about'
    };

    const { data: newSlide, error: insertError } = await supabase
      .from('hero_slides')
      .insert(testSlide)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating test slide:', insertError);
      throw insertError;
    }

    console.log('✅ Test slide created successfully:', newSlide);
    toast.success('Test hero slide created successfully!');
    
    return newSlide;
  } catch (error) {
    console.error('❌ Failed to create test slide:', error);
    toast.error('Failed to create test slide');
    throw error;
  }
}

export async function checkHeroSystemStatus() {
  try {
    console.log('🔍 Checking hero system status...');
    
    // Check hero_slides table
    const { data: slides, error: slidesError } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('section_id', 'homepage-main');
    
    if (slidesError) throw slidesError;
    
    // Check hero_settings table
    const { data: settings, error: settingsError } = await supabase
      .from('hero_settings')
      .select('*')
      .limit(1);
    
    // Settings error is not critical
    if (settingsError) {
      console.warn('Hero settings not found, will use defaults');
    }
    
    // Check media_library for potential hero images
    const { data: mediaFiles, error: mediaError } = await supabase
      .from('media_library')
      .select('*')
      .eq('is_hero', true);
    
    if (mediaError) throw mediaError;
    
    const status = {
      slides: slides || [],
      settings: settings || [],
      heroMediaFiles: mediaFiles || [],
      slideCount: slides?.length || 0,
      visibleSlideCount: slides?.filter(s => s.visible).length || 0
    };
    
    console.log('🎭 Hero system status:', status);
    return status;
    
  } catch (error) {
    console.error('❌ Error checking hero system:', error);
    throw error;
  }
}
