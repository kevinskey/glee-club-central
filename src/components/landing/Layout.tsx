
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  return (
    <div className={`flex-grow ${fullWidth ? 'w-full' : 'w-full px-4 sm:px-6 md:container md:mx-auto'}`}>
      {children}
    </div>
  );
};
