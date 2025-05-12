
import React, { useState, useEffect, createContext, useContext } from "react";
import { useMedia } from "@/hooks/use-mobile";

interface SidebarState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

// Create a context for the sidebar state
const SidebarContext = createContext<SidebarState | undefined>(undefined);

// Create a provider component
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMedia("(max-width: 768px)");
  
  // Close sidebar when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  // Close sidebar when screen size changes to mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);
  
  const onOpen = () => !isMobile && setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => !isMobile && setIsOpen(prev => !prev);
  
  const value = {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
  
  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

// Hook for components to consume the sidebar context
export const useSidebarContext = (): SidebarState => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};

// Original hook implementation as a standalone hook (now just returns the context)
export function useSidebar(): SidebarState {
  return useSidebarContext();
}

// Add this for backward compatibility if needed
useSidebar.setState = (state: { isOpen: boolean }) => {
  console.warn("useSidebar.setState is deprecated. Use onOpen/onClose/onToggle instead.");
};
