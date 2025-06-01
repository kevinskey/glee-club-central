
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { NewsTicker } from "@/components/landing/news/NewsTicker";
import { HeaderLogo } from "@/components/layout/header/HeaderLogo";
import { HeaderActions } from "@/components/layout/header/HeaderActions";
import { MobileNavDropdown } from "@/components/layout/mobile/MobileNavDropdown";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const navigate = useNavigate();
  const [showNewsTicker, setShowNewsTicker] = React.useState(true);
  const { isAuthenticated, profile, logout } = useAuth();
  const isMobile = useIsMobile();
  
  const handleDashboardClick = () => {
    navigate("/role-dashboard");
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
          
          {/* Middle: Navigation Links - Desktop only */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="font-medium text-foreground hover:text-glee-spelman transition-colors">
              Home
            </Link>
            <Link to="/about" className="font-medium text-foreground hover:text-glee-spelman transition-colors">
              About
            </Link>
            <Link to="/calendar" className="font-medium text-foreground hover:text-glee-spelman transition-colors">
              Calendar
            </Link>
            <Link to="/store" className="font-medium text-foreground hover:text-glee-spelman transition-colors">
              Store
            </Link>
            <Link to="/contact" className="font-medium text-foreground hover:text-glee-spelman transition-colors">
              Contact
            </Link>
          </nav>
          
          {/* Right side: Actions and Auth */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth Buttons */}
            {!isMobile && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="default"
                      onClick={handleDashboardClick}
                      className="hidden sm:flex items-center bg-glee-spelman hover:bg-glee-spelman/90"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {profile?.first_name ? `${profile.first_name}'s Dashboard` : 'My Dashboard'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleLogout}
                      className="flex items-center border-glee-spelman text-glee-spelman hover:bg-glee-spelman/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="default"
                    onClick={() => navigate("/login")}
                    className="flex items-center bg-glee-spelman hover:bg-glee-spelman/90"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Member Login</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                )}
                <HeaderActions />
              </>
            )}
            
            {/* Mobile Navigation */}
            {isMobile && (
              <div className="flex items-center gap-2">
                <HeaderActions />
                <MobileNavDropdown />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
