
import React from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/landing/header/Logo";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";
import { NewsTicker } from "@/components/landing/news/NewsTicker";

export function Header() {
  const navigate = useNavigate();
  const [showNewsTicker, setShowNewsTicker] = React.useState(true);
  
  return (
    <>
      {showNewsTicker && <NewsTicker onClose={() => setShowNewsTicker(false)} />}
      
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 w-full">
        <div className="container mx-auto px-4 md:px-6 flex h-16 md:h-20 items-center justify-between">
          {/* Left side: Logo and site name */}
          <div className="flex items-center gap-4">
            <Logo />
          </div>
          
          {/* Right side: Only GleeToolsDropdown */}
          <div className="flex items-center">
            <GleeToolsDropdown />
          </div>
        </div>
      </header>
    </>
  );
}
