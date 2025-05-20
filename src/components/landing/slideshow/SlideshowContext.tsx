
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
  const [isInitialRender, setIsInitialRender] = useState(true);

  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  
  // After initial render, mark it as complete to prevent extra flashing
  useEffect(() => {
    if (isInitialRender && initialLoadComplete) {
      const timer = setTimeout(() => {
        setIsInitialRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInitialRender, initialLoadComplete]);

  // Set up slideshow with proper timing
  useEffect(() => {
    // Don't start the slideshow until initial load is complete
    if (!initialLoadComplete || !images || images.length <= 1) return;
    
    // Clean up any existing timers
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    
    // Function to handle transitions
    const handleTransition = () => {
      setIsTransitioning(true);
      
      // After transition completes, update to next image
      timerRef.current = window.setTimeout(() => {
        if (!isMountedRef.current) return;
        
        const newCurrentIndex = nextIndex;
        const newNextIndex = (nextIndex + 1) % images.length;
        
        setCurrentIndex(newCurrentIndex);
        setNextIndex(newNextIndex);
        setIsTransitioning(false);
      }, transition);
    };

    // Set up interval for consistent timing between transitions
    intervalRef.current = window.setInterval(handleTransition, duration);
    
    return () => {
      // Clean up timers
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [initialLoadComplete, images, duration, transition, nextIndex]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

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
