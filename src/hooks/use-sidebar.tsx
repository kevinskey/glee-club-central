
// This file is now deprecated and should be removed in favor of the more robust useSidebar.tsx in the UI components
import { useState, useEffect } from "react";
import { useMedia } from "./use-mobile";

// This is considered deprecated - use the component from @/components/ui/sidebar instead
console.warn("The use-sidebar.tsx hook is deprecated. Please use @/components/ui/sidebar instead.");

export function useSidebar() {
  return {
    isOpen: false, // Default value, should not be used
    onOpen: () => console.warn("Using deprecated sidebar hook"),
    onClose: () => console.warn("Using deprecated sidebar hook"),
    onToggle: () => console.warn("Using deprecated sidebar hook"),
  };
}
