import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogIn, LogOut, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function MobileNavDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate("/role-dashboard");
    setIsOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Calendar", href: "/calendar" },
    { label: "Reader", href: "https://reader.gleeworld.org" },
    { label: "Studio", href: "https://studio.gleeworld.org" },
    { label: "Merch", href: "https://merch.gleeworld.org" },
    { label: "Store", href: "/store" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-10 w-10" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          {/* Navigation Links */}
          <div className="flex flex-col gap-2 pt-4">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-2 py-2 text-lg font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex flex-col gap-2 pt-4 border-t">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="default"
                  onClick={handleDashboardClick}
                  className="w-full justify-start bg-glee-spelman hover:bg-glee-spelman/90"
                >
                  <User className="w-4 h-4 mr-2" />
                  {profile?.first_name ? `${profile.first_name}'s Dashboard` : 'My Dashboard'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start border-glee-spelman text-glee-spelman hover:bg-glee-spelman/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigate("/signup");
                    setIsOpen(false);
                  }}
                  className="w-full justify-start border-glee-spelman text-glee-spelman hover:bg-glee-spelman/10"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
                <Button 
                  variant="default"
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full justify-start bg-glee-spelman hover:bg-glee-spelman/90"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
