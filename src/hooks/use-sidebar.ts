
import { useState, useEffect } from "react";

interface SidebarState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export function useSidebar(): SidebarState {
  const [isOpen, setIsOpen] = useState(false);
  
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
  
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen(prev => !prev);
  
  return {
    isOpen,
    onOpen,
    onClose,
    onToggle
  };
}

// Add this for backward compatibility if needed
useSidebar.setState = (state: { isOpen: boolean }) => {
  console.warn("useSidebar.setState is deprecated. Use onOpen/onClose/onToggle instead.");
};
