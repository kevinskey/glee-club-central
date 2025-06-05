
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Icons } from "@/components/Icons";
import { NavigationLinks } from "./NavigationLinks";
import { cn } from "@/lib/utils";

export function MobileFriendlyHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        {/* Main header */}
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <Icons.logo className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <span className="font-semibold text-base sm:text-xl truncate">
              GleeWorld
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationLinks />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-11 w-11 min-h-[44px] min-w-[44px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden border-t transition-all duration-200 ease-in-out",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <div className="px-3 py-4 space-y-2">
            <NavigationLinks isMobile={true} />
          </div>
        </div>
      </div>
    </header>
  );
}
