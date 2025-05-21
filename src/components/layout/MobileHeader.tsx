
import React, { useState } from "react";
import { MobileHeaderLogo } from "./mobile/MobileHeaderLogo";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";

export function MobileHeader() {
  return (
    <>
      <header className="md:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-screen-2xl mx-auto px-2 flex h-14 items-center justify-between">
          {/* Left side: Logo */}
          <div className="flex items-center gap-1">
            <MobileHeaderLogo />
          </div>
          
          {/* Right side: only GleeToolsDropdown */}
          <div className="flex items-center">
            <GleeToolsDropdown />
          </div>
        </div>
      </header>
    </>
  );
}
