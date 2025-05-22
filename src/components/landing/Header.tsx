
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { NewsTicker } from "@/components/landing/news/NewsTicker";
import { HeaderLogo } from "@/components/layout/header/HeaderLogo";
import { HeaderActions } from "@/components/layout/header/HeaderActions";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User } from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  const [showNewsTicker, setShowNewsTicker] = React.useState(true);
  const { isAuthenticated, profile } = useAuth();
  
  const handleDashboardClick = () => {
    navigate("/role-dashboard");
  };
  
  return (
    <>
      {showNewsTicker && <NewsTicker onClose={() => setShowNewsTicker(false)} />}
      
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 w-full">
        <div className="container mx-auto px-4 md:px-6 flex h-16 md:h-20 items-center justify-between">
          {/* Left side: Logo and site name */}
          <div className="flex items-center gap-4">
            <HeaderLogo />
          </div>
          
          {/* Middle: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="font-medium hover:text-glee-spelman transition-colors">
              Home
            </Link>
            <Link to="/about" className="font-medium hover:text-glee-spelman transition-colors">
              About
            </Link>
            <Link to="/events" className="font-medium hover:text-glee-spelman transition-colors">
              Events
            </Link>
            <Link to="/contact" className="font-medium hover:text-glee-spelman transition-colors">
              Contact
            </Link>
          </nav>
          
          {/* Right side: Actions and Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button 
                variant="default"
                onClick={handleDashboardClick}
                className="hidden md:flex items-center bg-glee-spelman hover:bg-glee-spelman/90"
              >
                <User className="w-4 h-4 mr-2" />
                {profile?.first_name ? `${profile.first_name}'s Dashboard` : 'My Dashboard'}
              </Button>
            ) : (
              <Button 
                variant="default"
                onClick={() => navigate("/login")}
                className="hidden md:flex items-center bg-glee-spelman hover:bg-glee-spelman/90"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Member Login
              </Button>
            )}
            <HeaderActions />
          </div>
        </div>
      </header>
    </>
  );
}
