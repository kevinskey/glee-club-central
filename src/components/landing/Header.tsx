
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { NewsTicker } from "@/components/landing/news/NewsTicker";
import { HeaderLogo } from "@/components/layout/header/HeaderLogo";
import { HeaderActions } from "@/components/layout/header/HeaderActions";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const navigate = useNavigate();
  const [showNewsTicker, setShowNewsTicker] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, profile, logout } = useAuth();
  const isMobile = useIsMobile();
  
  const handleDashboardClick = () => {
    navigate("/role-dashboard");
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
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
            <Link to="/events" className="font-medium text-foreground hover:text-glee-spelman transition-colors">
              Events
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
            
            {/* Mobile Menu */}
            {isMobile && (
              <>
                {/* Mobile Auth Button */}
                {isAuthenticated ? (
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={handleDashboardClick}
                    className="bg-glee-spelman hover:bg-glee-spelman/90"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="bg-glee-spelman hover:bg-glee-spelman/90"
                  >
                    <LogIn className="h-4 w-4" />
                  </Button>
                )}

                {/* Mobile Header Actions */}
                <HeaderActions />
                
                {/* Mobile Menu Button */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[80%] sm:w-[350px] pr-0">
                    <nav className="flex flex-col gap-4 mt-8">
                      <Button 
                        variant="ghost" 
                        className="justify-start" 
                        onClick={() => handleNavigation("/")}
                      >
                        Home
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start" 
                        onClick={() => handleNavigation("/about")}
                      >
                        About
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start" 
                        onClick={() => handleNavigation("/events")}
                      >
                        Events
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start" 
                        onClick={() => handleNavigation("/contact")}
                      >
                        Contact
                      </Button>
                      
                      {/* Auth Buttons */}
                      {isAuthenticated ? (
                        <>
                          <Button 
                            variant="default" 
                            className="justify-start bg-glee-spelman hover:bg-glee-spelman/90 mt-4" 
                            onClick={handleDashboardClick}
                          >
                            <User className="mr-2 h-4 w-4" />
                            {profile?.first_name ? `${profile.first_name}'s Dashboard` : 'My Dashboard'}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start border-glee-spelman text-glee-spelman hover:bg-glee-spelman/10" 
                            onClick={handleLogout}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="default" 
                          className="justify-start bg-glee-spelman hover:bg-glee-spelman/90 mt-4" 
                          onClick={() => handleNavigation("/login")}
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Member Login
                        </Button>
                      )}
                    </nav>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
