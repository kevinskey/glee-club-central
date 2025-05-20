
import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface SlideshowContextProps {
  currentIndex: number;
  nextIndex: number;
  isTransitioning: boolean;
  isInitialRender: boolean;
  setIsInitialRender: (value: boolean) => void;
  initialLoadComplete: boolean;
}

interface SlideshowProviderProps {
  children: React.ReactNode;
  images: string[];
  duration: number;
  transition: number;
  initialLoadComplete: boolean;
}

const SlideshowContext = createContext<SlideshowContextProps | undefined>(undefined);

export function SlideshowProvider({
  children,
  images,
  duration,
  transition,
  initialLoadComplete,
}: SlideshowProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(false);

  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  
  // Set up slideshow with proper timing
  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Don't start the slideshow if we don't have enough images
    if (!images || images.length <= 1) return;
    
    // Clean up any existing timers
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    
    // Set up a simple interval for transitions
    const interval = window.setInterval(() => {
      if (!isMountedRef.current) return;
      
      setIsTransitioning(true);
      
      // After transition completes, update indices
      timerRef.current = window.setTimeout(() => {
        if (!isMountedRef.current) return;
        
        setCurrentIndex(prevIndex => {
          const newIndex = (prevIndex + 1) % images.length;
          setNextIndex((newIndex + 1) % images.length);
          return newIndex;
        });
        
        setIsTransitioning(false);
      }, transition);
      
    }, duration);
    
    intervalRef.current = interval;
    
    return () => {
      // Clean up timers
      isMountedRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [images, duration, transition]);

  return (
    <SlideshowContext.Provider 
      value={{
        currentIndex,
        nextIndex,
        isTransitioning,
        isInitialRender,
        setIsInitialRender,
        initialLoadComplete,
      }}
    >
      {children}
    </SlideshowContext.Provider>
  );
}

export function useSlideshowContext() {
  const context = useContext(SlideshowContext);
  if (context === undefined) {
    throw new Error("useSlideshowContext must be used within a SlideshowProvider");
  }
  return context;
}
