
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { HeaderLogo } from "@/components/layout/header/HeaderLogo";
import { HeaderActions } from "@/components/layout/header/HeaderActions";
import { MobileNavDropdown } from "@/components/layout/mobile/MobileNavDropdown";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut, UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, user, logout, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  
  console.log("Header render - isMobile:", isMobile, "window width:", window.innerWidth);
  
  const handleDashboardClick = () => {
    const isKnownAdmin = user?.email === 'kevinskey@mac.com';
    const hasAdminRole = isAdmin();
    
    if (isKnownAdmin || hasAdminRole) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
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
    <header className="glee-header fixed top-0 left-0 right-0 w-full z-50 bg-navy-900 backdrop-blur-sm" style={{ margin: 0, padding: 0, top: 0 }}>
      <div className="w-full" style={{ margin: 0, padding: 0 }}>
        <div className="bg-navy-900 shadow-sm border-b border-navy-700" style={{ margin: 0, padding: 0 }}>
          <div className="flex h-16 items-center justify-between w-full px-6">
            {/* Logo - Always visible */}
            <div className="flex-shrink-0">
              <HeaderLogo />
            </div>
            
            {/* Desktop Navigation - Hidden on mobile */}
            <nav className={`items-center space-x-8 flex-1 justify-center ${isMobile ? 'hidden' : 'flex'}`}>
              <Link to="/" className="text-sm font-medium text-white hover:text-blue-300 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm font-medium text-white hover:text-blue-300 transition-colors">
                About
              </Link>
              <Link to="/calendar" className="text-sm font-medium text-white hover:text-blue-300 transition-colors">
                Events
              </Link>
              <Link to="/store" className="text-sm font-medium text-white hover:text-blue-300 transition-colors">
                Store
              </Link>
              <Link to="/contact" className="text-sm font-medium text-white hover:text-blue-300 transition-colors">
                Contact
              </Link>
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Desktop Auth Buttons - Hidden on mobile */}
              <div className={`items-center gap-3 ${isMobile ? 'hidden' : 'flex'}`}>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button 
                      variant="ghost"
                      onClick={handleDashboardClick}
                      className="text-sm font-medium text-white hover:text-blue-300 hover:bg-navy-800"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-sm font-medium text-white hover:text-blue-300 hover:bg-navy-800"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/signup")}
                      className="text-sm border-white text-white hover:bg-white hover:text-navy-900"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => navigate("/login")}
                      className="text-sm bg-blue-600 hover:bg-blue-700"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Mobile Actions - Shown only on mobile */}
              <div className={`items-center gap-1 ${isMobile ? 'flex' : 'hidden'}`}>
                <ThemeToggle />
                {isAuthenticated ? (
                  <Button 
                    variant="default"
                    onClick={handleDashboardClick}
                    size="sm"
                    className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                  >
                    <User className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button 
                    variant="default"
                    onClick={() => navigate("/login")}
                    size="sm"
                    className="h-8 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    <LogIn className="w-3.5 h-3.5 mr-1" />
                    Login
                  </Button>
                )}
                <MobileNavDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
