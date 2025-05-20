
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  return (
    <div className={`flex-grow ${fullWidth ? 'w-full' : 'container mx-auto px-4'}`}>
      {children}
    </div>
  );
};
