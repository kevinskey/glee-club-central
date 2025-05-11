
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function NavigationLinks() {
  const navigate = useNavigate();
  
  const navLinkStyle = cn(
    navigationMenuTriggerStyle(),
    "hover:text-white hover:bg-glee-spelman"
  );
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink 
            className={navLinkStyle}
            onClick={() => navigate("/")}
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink 
            className={navLinkStyle}
            onClick={() => navigate("/about")}
          >
            About Us
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink 
            className={navLinkStyle}
            onClick={() => navigate("/contact")}
          >
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:text-white hover:bg-glee-spelman">Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[200px] p-2 bg-popover">
              <NavigationMenuLink 
                className="block p-2 hover:bg-glee-spelman hover:text-white rounded-md"
                onClick={() => navigate("/administration")}
              >
                Administration
              </NavigationMenuLink>
              <NavigationMenuLink 
                className="block p-2 hover:bg-glee-spelman hover:text-white rounded-md"
                onClick={() => navigate("/fan-page")}
              >
                For Fans
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
