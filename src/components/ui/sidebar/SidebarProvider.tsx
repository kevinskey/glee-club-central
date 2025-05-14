
import React, { createContext, useState, ReactNode, useCallback } from "react";
import { SidebarContext as BaseSidebarContext, SidebarContextType } from "./useSidebar";
import { useMedia } from "@/hooks/use-mobile";

interface SidebarProviderProps {
  children: ReactNode;
  defaultState?: "expanded" | "collapsed";
}

// Use the imported SidebarContext directly
export const SidebarContext = BaseSidebarContext;

export function SidebarProvider({ 
  children, 
  defaultState = "expanded" 
}: SidebarProviderProps) {
  const [state, setState] = useState<"expanded" | "collapsed">(defaultState);
  const [open, setOpen] = useState(true);
  const [openMobile, setOpenMobile] = useState(false);
  const isMobile = useMedia("(max-width: 768px)");
  
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setState(prev => prev === "expanded" ? "collapsed" : "expanded");
      setOpen(prev => !prev);
    }
  }, [isMobile, openMobile]);

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
