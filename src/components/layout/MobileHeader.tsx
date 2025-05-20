
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, LogIn } from "lucide-react";
import { MobileMenu } from "@/components/landing/header/MobileMenu";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuProvider
} from "@/components/ui/dropdown-menu";

export function MobileHeader() {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { setOpenMobile, openMobile } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isDashboardPath = location.pathname.startsWith("/dashboard");
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSidebarToggle = () => {
    console.log("Toggling sidebar or mobile menu. isDashboardPath:", isDashboardPath);
    
    if (isDashboardPath) {
      // For dashboard pages, use the sidebar's setOpenMobile function
      setOpenMobile(!openMobile);
    } else {
      // For public pages, toggle our local mobile menu state
      toggleMobileMenu();
    }
  };
  
  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate("/login");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <header className="md:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-screen-2xl mx-auto px-2 flex h-14 items-center justify-between">
          {/* Left side: Logo and site name */}
          <div className="flex items-center gap-1">
            <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors">
              <Icons.logo className="h-7 w-auto" />
              <span className="text-sm font-medium ml-1 text-foreground">Glee World</span>
            </Link>
          </div>
          
          {/* Right side: theme toggle and menu button */}
          <div className="flex items-center gap-0.5">
            <ThemeToggle />
            
            <DropdownMenuProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="flex-shrink-0 h-10 w-10"
                  >
                    <Menu className="h-6 w-6 text-foreground" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuItem onClick={() => navigate("/")}>
                    Home
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/about")}>
                    About
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/privacy")}>
                    Privacy Policy
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/press-kit")}>
                    Press Kit
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {isAuthenticated && (
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  
                  {isDashboardPath && (
                    <DropdownMenuItem onClick={() => setOpenMobile(!openMobile)}>
                      Toggle Sidebar
                    </DropdownMenuItem>
                  )}
                  
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        Member Portal
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/login")}>
                        <LogIn className="h-5 w-5 mr-2" />
                        Login
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate("/login")}>
                        Member Portal
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {!isAuthenticated && (
                    <DropdownMenuItem onClick={() => navigate("/register")}>
                      Register
                    </DropdownMenuItem>
                  )}
                  
                  {!isAuthenticated && (
                    <DropdownMenuItem onClick={() => navigate("/register/admin")}>
                      Admin Registration
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuProvider>
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground border-t py-0.5">
          Glee World v1.0
        </div>
      </header>

      {/* Mobile menu for public pages */}
      {mobileMenuOpen && !isDashboardPath && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
    </>
  );
}
