
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useSimpleAuthContext } from "@/contexts/SimpleAuthContext";
import { MobileHeaderLogo } from "./mobile/MobileHeaderLogo";
import { MobileHeaderActions } from "./mobile/MobileHeaderActions";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, profile, logout } = useSimpleAuthContext();
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
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
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container flex h-14 items-center px-4">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo */}
          <MobileHeaderLogo />
          
          {/* Right side elements */}
          <div className="flex items-center gap-2">
            {/* Login/Dashboard Button */}
            {isAuthenticated ? (
              <Button 
                variant="default"
                size="sm"
                onClick={() => navigate("/role-dashboard")}
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
            
            {/* Mobile Header Actions (GleeTools, etc) */}
            <MobileHeaderActions onMenuClick={() => setIsOpen(true)} />
            
            {/* Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px] pr-0">
                <nav className="flex flex-col gap-4 mt-8">
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => handleNavigate("/")}
                  >
                    Home
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => handleNavigate("/about")}
                  >
                    About
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => handleNavigate("/events")}
                  >
                    Events
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => handleNavigate("/contact")}
                  >
                    Contact
                  </Button>
                  
                  {/* Auth Buttons */}
                  {isAuthenticated ? (
                    <>
                      <Button 
                        variant="default" 
                        className="justify-start bg-glee-spelman hover:bg-glee-spelman/90 mt-4" 
                        onClick={() => handleNavigate("/role-dashboard")}
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
                      onClick={() => handleNavigate("/login")}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Member Login
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
