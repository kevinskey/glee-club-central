import React, { memo } from "react";
import { HeaderLogo } from "./header/HeaderLogo";
import { HeaderActions } from "./header/HeaderActions";

// Memoize the ConsolidatedHeader component to prevent unnecessary re-renders
export const ConsolidatedHeader = memo(function ConsolidatedHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-2xl mx-auto px-4 flex h-16 items-center justify-between">
        {/* Left side: Logo and site name */}
        <div className="flex items-center gap-3">
          <HeaderLogo />
        </div>
          
        {/* Right side: only GleeToolsDropdown */}
        <HeaderActions />
      </div>
    </header>
  );
});
