
import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu } from "lucide-react";
import { Icons } from "@/components/Icons";

interface HeaderNavProps {
  logoText?: string;
  navigationLinks?: Array<{
    label: string;
    href: string;
  }>;
  showLoginButton?: boolean;
  onMobileMenuToggle?: () => void;
}

export function HeaderNav({
  logoText = "GleeWorld",
  navigationLinks = [
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Store", href: "/store" },
    { label: "Press Kit", href: "/press-kit" }
  ],
  showLoginButton = true,
  onMobileMenuToggle
}: HeaderNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8" />
          <span className="text-xl font-playfair font-semibold text-glee-spelman">
            {logoText}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {showLoginButton && (
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Login
            </Button>
          )}
          
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </header>
  );
}
