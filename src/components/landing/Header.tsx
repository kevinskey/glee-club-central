import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Clock } from "@/components/ui/clock";
import { NewsFeed } from "@/components/news/NewsFeed";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Metronome } from "@/components/ui/metronome";
import { Icons } from "@/components/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuProvider,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface HeaderProps {
  initialShowNewsFeed?: boolean;
}

export function Header({ initialShowNewsFeed = true }: HeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showNewsFeed, setShowNewsFeed] = useState(initialShowNewsFeed);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-hide the news feed after a shorter duration (2 seconds instead of default)
  useEffect(() => {
    if (showNewsFeed) {
      const timer = setTimeout(() => {
        setShowNewsFeed(false);
      }, 2000); // 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showNewsFeed]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {showNewsFeed && <NewsFeed onClose={() => setShowNewsFeed(false)} />}
      <div className="container px-4 md:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                  <Icons.logo className="h-5 w-5 text-glee-purple" />
                  <span className="font-playfair text-lg font-semibold text-glee-purple">
                    Glee World
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to homepage</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Metronome />
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-3">
          {/* Main navigation menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={navigationMenuTriggerStyle()}
                  onClick={() => navigate("/")}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={navigationMenuTriggerStyle()}
                  onClick={() => navigate("/about")}
                >
                  About Us
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={navigationMenuTriggerStyle()}
                  onClick={() => navigate("/contact")}
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[200px] p-2">
                    <NavigationMenuLink 
                      className="block p-2 hover:bg-accent rounded-md"
                      onClick={() => navigate("/administration")}
                    >
                      Administration
                    </NavigationMenuLink>
                    <NavigationMenuLink 
                      className="block p-2 hover:bg-accent rounded-md"
                      onClick={() => navigate("/fan-page")}
                    >
                      For Fans
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <ThemeToggle />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Clock />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current time</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Member Portal button */}
          <DropdownMenuProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm"
                  className="bg-glee-purple hover:bg-glee-purple/90 h-8 px-3 text-xs flex items-center gap-1"
                >
                  Member Portal <ChevronDown className="h-3 w-3 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                <DropdownMenuItem onClick={() => navigate("/login")}>Login</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuProvider>
        </div>
        
        {/* Mobile menu and theme toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={toggleMobileMenu}
                  className="p-2 text-glee-purple"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{mobileMenuOpen ? "Close menu" : "Open menu"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container py-4 px-4 flex flex-col gap-2">
            <div className="flex justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Clock />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current time</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Mobile menu items */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start" 
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start" 
              onClick={() => {
                navigate("/about");
                setMobileMenuOpen(false);
              }}
            >
              About Us
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start" 
              onClick={() => {
                navigate("/contact");
                setMobileMenuOpen(false);
              }}
            >
              Contact
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start" 
              onClick={() => {
                navigate("/administration");
                setMobileMenuOpen(false);
              }}
            >
              Administration
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start" 
              onClick={() => {
                navigate("/fan-page");
                setMobileMenuOpen(false);
              }}
            >
              For Fans
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start" 
              onClick={() => {
                navigate("/dashboard");
                setMobileMenuOpen(false);
              }}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start" 
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
            >
              Login
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="mt-2 bg-glee-purple hover:bg-glee-purple/90"
              onClick={() => {
                navigate("/dashboard");
                setMobileMenuOpen(false);
              }}
            >
              Member Portal
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
