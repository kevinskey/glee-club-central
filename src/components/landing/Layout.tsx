
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex-grow ${fullWidth ? 'w-full' : (isMobile ? 'w-full' : 'w-full px-4 sm:px-6 md:container md:mx-auto')}`}>
      {children}
    </div>
  );
};
