
import { supabase } from '@/integrations/supabase/client';

export const addCentennialImageToLibrary = async () => {
  try {
    // Check if this image already exists in the library
    const { data: existingImage } = await supabase
      .from('site_images')
      .select('*')
      .eq('name', 'Centennial Celebration Glee Club')
      .single();

    if (existingImage) {
      console.log('Centennial image already exists in library');
      return { success: true, imageUrl: existingImage.file_url };
    }

    // Add the new image to the site_images table
    const { data, error } = await supabase
      .from('site_images')
      .insert({
        name: 'Centennial Celebration Glee Club',
        description: 'A centennial celebration of the Spelman College Glee Club - historic photo with "Amaze & Inspire" text',
        file_url: '/lovable-uploads/5d6ba7fa-4ea7-42ac-872e-940fb620a273.png',
        file_path: '5d6ba7fa-4ea7-42ac-872e-940fb620a273.png',
        category: 'backgrounds',
        position: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding image to library:', error);
      return { success: false, error };
    }

    console.log('Successfully added centennial image to library');
    return { success: true, imageUrl: data.file_url };
  } catch (error) {
    console.error('Error in addCentennialImageToLibrary:', error);
    return { success: false, error };
  }
};
