
import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/Icons";

export function Header() {
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b hidden md:block">
      <div className="max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Logo and site name */}
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold flex items-center gap-2 hover:text-primary transition-colors">
            <Icons.logo className="h-6 w-auto" />
            <span className="text-base text-foreground">Glee World</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
