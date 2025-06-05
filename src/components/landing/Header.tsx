
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { NewsTicker } from "@/components/landing/news/NewsTicker";
import { HeaderLogo } from "@/components/layout/header/HeaderLogo";
import { HeaderActions } from "@/components/layout/header/HeaderActions";
import { MobileNavDropdown } from "@/components/layout/mobile/MobileNavDropdown";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut, UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const navigate = useNavigate();
  const [showNewsTicker, setShowNewsTicker] = React.useState(true);
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
    <>
      {/* Fixed Header with News Ticker - Ensure proper z-index and positioning */}
      <header className="fixed top-0 left-0 right-0 w-full max-w-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 z-50 m-0 p-0">
        {/* News Ticker */}
        {showNewsTicker && <NewsTicker />}
        
        {/* Main Header - Apple style navigation with generous padding */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <div className="container mx-auto px-8 md:px-12 lg:px-16 flex h-14 md:h-16 items-center justify-between">
            {/* Logo */}
            <HeaderLogo />
            
            {/* Desktop Navigation - Apple style with generous spacing */}
            {!isMobile && (
              <nav className="flex items-center space-x-10 lg:space-x-12">
                <Link to="/" className="text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
                  Home
                </Link>
                <Link to="/about" className="text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
                  About
                </Link>
                <Link to="/calendar" className="text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
                  Events
                </Link>
                <Link to="/store" className="text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
                  Store
                </Link>
                <Link to="/contact" className="text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </nav>
            )}
            
            {/* Right Side Actions - Apple style with generous spacing */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Desktop Auth Buttons */}
              {!isMobile && (
                <>
                  {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost"
                        onClick={handleDashboardClick}
                        className="text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 px-4 py-2"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {profile?.first_name ? `${profile.first_name}'s Dashboard` : 'Dashboard'}
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 px-4 py-2"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost"
                        onClick={() => navigate("/signup")}
                        className="text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 px-4 py-2"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Sign Up
                      </Button>
                      <Button 
                        variant="default"
                        onClick={() => navigate("/login")}
                        className="bg-gradient-to-r from-glee-columbia via-glee-purple to-glee-columbia hover:from-glee-columbia/90 hover:via-glee-purple/90 hover:to-glee-columbia/90 text-white text-sm font-normal px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    </div>
                  )}
                  <HeaderActions />
                </>
              )}
              
              {/* Mobile Actions */}
              {isMobile && (
                <div className="flex items-center gap-2">
                  {isAuthenticated ? (
                    <Button 
                      variant="default"
                      onClick={handleDashboardClick}
                      size="sm"
                      className="bg-gradient-to-r from-glee-columbia via-glee-purple to-glee-columbia hover:from-glee-columbia/90 hover:via-glee-purple/90 hover:to-glee-columbia/90 text-white"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/signup")}
                        size="sm"
                        className="border-glee-columbia text-glee-columbia hover:bg-glee-columbia/10 dark:border-glee-columbia dark:text-glee-columbia"
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="default"
                        onClick={() => navigate("/login")}
                        size="sm"
                        className="bg-gradient-to-r from-glee-columbia via-glee-purple to-glee-columbia hover:from-glee-columbia/90 hover:via-glee-purple/90 hover:to-glee-columbia/90 text-white"
                      >
                        <LogIn className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <HeaderActions />
                  <MobileNavDropdown />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
