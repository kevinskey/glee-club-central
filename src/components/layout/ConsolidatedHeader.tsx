
import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/Icons";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";

export function ConsolidatedHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-2xl mx-auto px-4 flex h-16 items-center justify-between">
        {/* Left side: Logo and site name */}
        <div className="flex items-center gap-3">
          <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors">
            <Icons.logo className="h-6 w-auto" />
            <span className="text-base ml-2 text-foreground">Glee World</span>
          </Link>
        </div>
          
        {/* Right side: only GleeToolsDropdown */}
        <div className="flex items-center">
          <GleeToolsDropdown />
        </div>
      </div>
    </header>
  );
}
