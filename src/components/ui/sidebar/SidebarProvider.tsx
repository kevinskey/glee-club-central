
import React, { createContext, useState, ReactNode, useCallback } from "react";
import { useSidebar } from "./useSidebar";

interface SidebarProviderProps {
  children: ReactNode;
  defaultState?: "expanded" | "collapsed";
}

export const SidebarContext = useSidebar().SidebarContext;

export function SidebarProvider({ 
  children, 
  defaultState = "expanded" 
}: SidebarProviderProps) {
  const [state, setState] = useState<"expanded" | "collapsed">(defaultState);
  const [open, setOpen] = useState(true);
  const [openMobile, setOpenMobile] = useState(false);
  const isMobile = window.innerWidth < 768;
  
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
