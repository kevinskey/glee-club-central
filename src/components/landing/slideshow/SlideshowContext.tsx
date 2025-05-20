
import React, { createContext, useContext } from "react";

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

const SlideshowContext = createContext<SlideshowContextProps>({
  currentIndex: 0,
  nextIndex: 0,
  isTransitioning: false,
  isInitialRender: false,
  setIsInitialRender: () => {},
  initialLoadComplete: true,
});

export function SlideshowProvider({
  children,
}: SlideshowProviderProps) {
  // Simplified context with static values to prevent re-renders
  const value = {
    currentIndex: 0,
    nextIndex: 0,
    isTransitioning: false,
    isInitialRender: false,
    setIsInitialRender: () => {},
    initialLoadComplete: true,
  };

  return (
    <SlideshowContext.Provider value={value}>
      {children}
    </SlideshowContext.Provider>
  );
}

export function useSlideshowContext() {
  return useContext(SlideshowContext);
}
