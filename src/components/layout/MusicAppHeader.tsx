
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Music, Menu, X } from "lucide-react";
import { MobileNavDropdown } from "./mobile/MobileNavDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";

export function MusicAppHeader({ currentSection }: { currentSection: string }) {
  const { user, logout } = useAuth();
  const { isAuthenticated } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  const navigationSections = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Music,
    },
    {
      name: "Music",
      href: "/dashboard/music",
      icon: Music,
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: Music,
    },
    {
      name: "Members",
      href: "/dashboard/members",
      icon: Music,
    },
    {
      name: "Recordings",
      href: "/dashboard/recordings",
      icon: Music,
    },
  ];

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Music />
          <span className="font-bold">GleeClub</span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          {navigationSections.map((section) => (
            <Button
              key={section.name}
              variant="ghost"
              size="sm"
              onClick={() => navigate(section.href)}
              className={cn(
                location.pathname.startsWith(section.href)
                  ? "text-primary"
                  : "text-secondary-foreground hover:text-primary",
                "data-[active=true]:text-primary"
              )}
            >
              {section.name}
            </Button>
          ))}
          {isAuthenticated && (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          {/* Only show nav dropdown for non-admin users on mobile */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
              <span className="sr-only">Toggle Menu</span>
            </Button>
          )}
          {!isAuthenticated && <MobileNavDropdown />}
        </div>
      </div>
    </header>
  );
}
