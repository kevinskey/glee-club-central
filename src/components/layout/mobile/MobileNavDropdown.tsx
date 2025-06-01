
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogIn, LogOut, Home, Calendar, Users, Mail, Store } from "lucide-react";

export function MobileNavDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    setIsOpen(false);
    navigate("/role-dashboard");
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* Navigation Links */}
          <div className="space-y-2">
            <Link 
              to="/" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={handleNavClick}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/about" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={handleNavClick}
            >
              <Users className="h-5 w-5" />
              <span>About</span>
            </Link>
            
            <Link 
              to="/events" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={handleNavClick}
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </Link>
            
            <Link 
              to="/calendar" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={handleNavClick}
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </Link>
            
            <Link 
              to="/store" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={handleNavClick}
            >
              <Store className="h-5 w-5" />
              <span>Store</span>
            </Link>
            
            <Link 
              to="/contact" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={handleNavClick}
            >
              <Mail className="h-5 w-5" />
              <span>Contact</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t pt-4">
            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="space-y-2">
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
              </div>
            ) : (
              <Button 
                variant="default"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="w-full justify-start bg-glee-spelman hover:bg-glee-spelman/90"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Member Login
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
