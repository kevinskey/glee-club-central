
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HeroSlideData {
  id: string;
  title: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  text_position: 'top' | 'center' | 'bottom';
  text_alignment: 'left' | 'center' | 'right';
  visible: boolean;
  slide_order: number;
  media_id?: string;
  youtube_url?: string;
  media_type: 'image' | 'video';
  background_image_url?: string;
  link_url?: string;
  object_fit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

// Cache for slides to avoid repeated database calls
let slidesCache: HeroSlideData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const QUERY_TIMEOUT = 6000; // 6 seconds for better reliability

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlideData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchSlidesWithCache = useCallback(async () => {
    const now = Date.now();
    
    // Check if we have valid cached data
    if (slidesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('🎭 HeroSection: Using cached slides');
      setSlides(slidesCache);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    try {
      console.log('🎭 HeroSection: Fetching hero slides...');
      
      // Create a promise race between the query and timeout
      const queryPromise = supabase
        .from('hero_slides')
        .select(`
          id, 
          title, 
          description, 
          button_text, 
          button_link, 
          text_position, 
          text_alignment, 
          visible, 
          slide_order, 
          media_id, 
          youtube_url, 
          media_type,
          media_library!inner(file_url)
        `)
        .eq('visible', true)
        .order('slide_order');

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), QUERY_TIMEOUT);
      });

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        console.error('🚨 HeroSection: Database error:', error);
        throw error;
      }
      
      // Transform data to include background image URLs
      const transformedSlides = (data || []).map((slide: any) => ({
        ...slide,
        background_image_url: slide.media_library?.file_url || null,
        link_url: slide.button_link,
        object_fit: 'cover' // Default object fit since column doesn't exist yet
      }));
      
      console.log('🎭 HeroSection: Successfully fetched', transformedSlides.length, 'hero slides');
      
      // Update cache
      slidesCache = transformedSlides;
      cacheTimestamp = now;
      
      setSlides(transformedSlides);
      setHasError(false);
      setIsLoading(false);
    } catch (error) {
      console.error('🚨 HeroSection: Error fetching hero slides:', error);
      
      // Use cached data if available, even if expired
      if (slidesCache && slidesCache.length > 0) {
        console.log('🎭 HeroSection: Falling back to expired cache');
        setSlides(slidesCache);
        setHasError(false);
      } else {
        setSlides([]);
        setHasError(true);
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlidesWithCache();
  }, [fetchSlidesWithCache]);

  return { slides, isLoading, hasError };
}
