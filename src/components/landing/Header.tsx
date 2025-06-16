
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { HeaderLogo } from "@/components/layout/header/HeaderLogo";
import { HeaderActions } from "@/components/layout/header/HeaderActions";
import { MobileNavDropdown } from "@/components/layout/mobile/MobileNavDropdown";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut, UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, user, logout, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  
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
    <header className="glee-header sticky top-0 left-0 right-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Logo - Always visible */}
            <div className="flex-shrink-0">
              <HeaderLogo />
            </div>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex items-center space-x-8 flex-1 justify-center">
                <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                  About
                </Link>
                <Link to="/calendar" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                  Events
                </Link>
                <Link to="/store" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                  Store
                </Link>
                <Link to="/contact" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                  Contact
                </Link>
              </nav>
            )}
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Desktop Auth Buttons */}
              {!isMobile && (
                <>
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost"
                        onClick={handleDashboardClick}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/signup")}
                        className="text-sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Sign Up
                      </Button>
                      <Button 
                        variant="default"
                        onClick={() => navigate("/login")}
                        className="text-sm"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    </div>
                  )}
                  <HeaderActions />
                </>
              )}
              
              {/* Mobile Actions - Simplified to prevent overflow */}
              {isMobile && (
                <div className="flex items-center gap-1">
                  {isAuthenticated ? (
                    <Button 
                      variant="default"
                      onClick={handleDashboardClick}
                      size="sm"
                      className="h-10 w-10 p-0"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="default"
                      onClick={() => navigate("/login")}
                      size="sm"
                      className="h-10 px-3"
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      Login
                    </Button>
                  )}
                  <HeaderActions />
                  <MobileNavDropdown />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
