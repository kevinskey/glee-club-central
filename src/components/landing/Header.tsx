
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { MobileNavDropdown } from "@/components/layout/mobile/MobileNavDropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";
import { Icons } from "@/components/Icons";
import { useHomePageData } from "@/hooks/useHomePageData";
import { useSSOAuth } from '@/hooks/useSSOAuth';
import { DesktopHorizontalNav } from "@/components/navigation/DesktopHorizontalNav";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, user, logout, isAdmin } = useAuth();
  const { upcomingEvents } = useHomePageData();
  const { navigateToReader } = useSSOAuth();
  
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
    <header className="sticky top-0 z-50 backdrop-blur-md w-full">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 lg:px-8 bg-white/95 dark:bg-gray-800/95 shadow-sm border-b border-gray-200 dark:border-gray-700">
        {/* Logo Section */}
        <div className="flex-shrink-0 min-w-0">
          <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors group min-w-0">
            <Icons.logo className="h-10 w-10 flex-shrink-0" />
            <div className="ml-3 min-w-0">
              <div className="text-lg font-bold text-gray-900 dark:text-white font-playfair truncate">
                GleeWorld
              </div>
              <div className="text-xs text-gray-700 dark:text-white/70 font-medium -mt-1 hidden sm:block truncate">
                Spelman College
              </div>
            </div>
            {/* Event Indicator - Mobile only */}
            {upcomingEvents.length > 0 && (
              <div className="ml-2 lg:hidden">
                <Bell className="h-4 w-4 text-gray-900 dark:text-white" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </Link>
        </div>
        
        {/* Desktop Horizontal Navigation */}
        <DesktopHorizontalNav />
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Desktop Auth Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span 
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer transition-colors" 
                  onClick={handleDashboardClick}
                  title="Dashboard"
                >
                  Dashboard
                </span>
                <span 
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer transition-colors" 
                  onClick={handleLogout}
                  title="Sign Out"
                >
                  Sign Out
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span 
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer transition-colors" 
                  onClick={() => navigate("/signup")}
                  title="Sign Up"
                >
                  Sign Up
                </span>
                <span 
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer transition-colors" 
                  onClick={() => navigate("/login")}
                  title="Login"
                >
                  Login
                </span>
              </div>
            )}
          </div>
          
          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden flex-shrink-0">
            <MobileNavDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
