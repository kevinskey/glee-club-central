
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
      {/* Fixed Header */}
      <header 
        className="fixed top-0 left-0 right-0 w-full bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700"
        style={{ 
          position: 'fixed',
          zIndex: 9999,
          top: 0,
          left: 0,
          right: 0
        }}
      >
        {/* News Ticker */}
        {showNewsTicker && <NewsTicker />}
        
        {/* Main Header */}
        <div className="bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6 flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <HeaderLogo />
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex items-center space-x-6">
                <Link to="/" className="font-medium text-gray-900 dark:text-gray-100 hover:text-glee-spelman transition-colors">
                  Home
                </Link>
                <Link to="/about" className="font-medium text-gray-900 dark:text-gray-100 hover:text-glee-spelman transition-colors">
                  About
                </Link>
                <Link to="/calendar" className="font-medium text-gray-900 dark:text-gray-100 hover:text-glee-spelman transition-colors">
                  Calendar
                </Link>
                <Link to="/store" className="font-medium text-gray-900 dark:text-gray-100 hover:text-glee-spelman transition-colors">
                  Store
                </Link>
                <Link to="/contact" className="font-medium text-gray-900 dark:text-gray-100 hover:text-glee-spelman transition-colors">
                  Contact
                </Link>
              </nav>
            )}
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Desktop Auth Buttons */}
              {!isMobile && (
                <>
                  {isAuthenticated ? (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="default"
                        onClick={handleDashboardClick}
                        className="bg-glee-spelman hover:bg-glee-spelman/90 text-white"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {profile?.first_name ? `${profile.first_name}'s Dashboard` : 'My Dashboard'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleLogout}
                        className="border-glee-spelman text-glee-spelman hover:bg-glee-spelman/10 dark:border-glee-spelman dark:text-glee-spelman"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/signup")}
                        className="border-glee-spelman text-glee-spelman hover:bg-glee-spelman/10 dark:border-glee-spelman dark:text-glee-spelman"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Sign Up
                      </Button>
                      <Button 
                        variant="default"
                        onClick={() => navigate("/login")}
                        className="bg-glee-spelman hover:bg-glee-spelman/90 text-white"
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
                      className="bg-glee-spelman hover:bg-glee-spelman/90 text-white"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/signup")}
                        size="sm"
                        className="border-glee-spelman text-glee-spelman hover:bg-glee-spelman/10 dark:border-glee-spelman dark:text-glee-spelman"
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="default"
                        onClick={() => navigate("/login")}
                        size="sm"
                        className="bg-glee-spelman hover:bg-glee-spelman/90 text-white"
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
      
      {/* Spacer div to push content below the fixed header */}
      <div className="h-20 md:h-24" style={{ height: showNewsTicker ? '120px' : '80px' }}></div>
    </>
  );
}
