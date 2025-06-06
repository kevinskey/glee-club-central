
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SlideData {
  id: string;
  title: string;
  description?: string;
  background_image_url?: string;
  background_color?: string;
  link_url?: string;
  design_data?: {
    buttonText?: string;
    textPosition?: 'top' | 'center' | 'bottom';
    textAlignment?: 'left' | 'center' | 'right';
    showText?: boolean;
    height?: 'tiny' | 'small' | 'medium' | 'full' | 'large';
    objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    objectPosition?: string;
    overlayOpacity?: number;
  };
}

// Cache for slides to avoid repeated database calls
let slidesCache: SlideData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const QUERY_TIMEOUT = 2000; // 2 seconds

export function useHeroSlides() {
  const [slides, setSlides] = useState<SlideData[]>([]);
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
      console.log('🎭 HeroSection: Fetching slides...');
      
      // Create an AbortController for better timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);

      const { data, error } = await supabase
        .from('slide_designs')
        .select('id, title, description, background_image_url, background_color, link_url, design_data')
        .eq('is_active', true)
        .order('display_order')
        .limit(3)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error('🚨 HeroSection: Database error:', error);
        throw error;
      }
      
      console.log('🎭 HeroSection: Successfully fetched', data?.length || 0, 'slides');
      const slideData = data || [];
      
      // Update cache
      slidesCache = slideData;
      cacheTimestamp = now;
      
      setSlides(slideData);
      setHasError(false);
    } catch (error) {
      console.error('🚨 HeroSection: Error fetching slides:', error);
      setHasError(true);
      
      // Use cached data if available, even if expired
      if (slidesCache && slidesCache.length > 0) {
        console.log('🎭 HeroSection: Falling back to expired cache');
        setSlides(slidesCache);
        setHasError(false);
      } else {
        setSlides([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Set a maximum loading time before showing fallback
    const maxLoadingTime = setTimeout(() => {
      if (isLoading) {
        console.log('🎭 HeroSection: Max loading time reached, showing fallback');
        setIsLoading(false);
        setHasError(true);
      }
    }, 3000);

    fetchSlidesWithCache();

    return () => clearTimeout(maxLoadingTime);
  }, [fetchSlidesWithCache]);

  return { slides, isLoading, hasError };
}
