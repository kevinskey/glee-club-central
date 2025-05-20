
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
  const [isInitialRender, setIsInitialRender] = useState(false); // Start with false to prevent flashing

  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const isChangingRef = useRef(false);

  // Set up slideshow with proper timing - simplified to avoid loops
  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Don't start the slideshow if we don't have enough images
    if (!images || images.length <= 1) return;
    
    // Clean up any existing timers
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    
    // Function to handle transitions
    const handleTransition = () => {
      // Prevent multiple transitions from happening simultaneously
      if (isChangingRef.current || !isMountedRef.current) return;
      isChangingRef.current = true;
      
      setIsTransitioning(true);
      
      // After transition completes, update to next image
      timerRef.current = window.setTimeout(() => {
        if (!isMountedRef.current) return;
        
        const newCurrentIndex = nextIndex;
        const newNextIndex = (nextIndex + 1) % images.length;
        
        setCurrentIndex(newCurrentIndex);
        setNextIndex(newNextIndex);
        setIsTransitioning(false);
        isChangingRef.current = false;
      }, transition);
    };

    // Set up interval for consistent timing between transitions
    intervalRef.current = window.setInterval(handleTransition, duration);
    
    return () => {
      // Clean up timers
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      isMountedRef.current = false;
    };
  }, [images, duration, transition, nextIndex]);

  const value = {
    currentIndex,
    nextIndex,
    isTransitioning,
    isInitialRender,
    setIsInitialRender,
    initialLoadComplete,
  };

  return (
    <SlideshowContext.Provider value={value}>
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
