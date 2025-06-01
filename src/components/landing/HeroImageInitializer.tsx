
import React, { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export function HeroImageInitializer() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeHeroImages = async () => {
      // Prevent multiple initializations
      if (hasInitialized.current) {
        return;
      }

      try {
        console.info('Hero images: Starting initialization...');
        
        // Check if hero images already exist
        const { data: existingImages, error: checkError } = await supabase
          .from('media_library')
          .select('id')
          .eq('is_hero', true)
          .eq('hero_tag', 'main-hero')
          .limit(1);

        if (checkError) {
          console.error('Hero images: Error checking existing images:', checkError);
          return;
        }

        if (existingImages && existingImages.length > 0) {
          console.info('Hero images: Already initialized, skipping...');
          hasInitialized.current = true;
          return;
        }

        // Only initialize if no hero images exist
        const fallbackImages = [
          {
            title: "Spelman College Glee Club Performance",
            file_url: "https://images.unsplash.com/photo-1493836434471-b9d2aa522a8e?w=1200&h=600&fit=crop",
            is_hero: true,
            hero_tag: 'main-hero',
            is_public: true,
            display_order: 1
          }
        ];

        const { error: insertError } = await supabase
          .from('media_library')
          .insert(fallbackImages);

        if (insertError) {
          console.error('Hero images: Error inserting fallback images:', insertError);
        } else {
          console.info('Hero images: Fallback images inserted successfully');
          hasInitialized.current = true;
        }
      } catch (error) {
        console.error('Hero images: Initialization failed:', error);
      }
    };

    // Only run once on mount
    if (!hasInitialized.current) {
      initializeHeroImages();
    }
  }, []); // Empty dependency array to run only once

  return null;
}
