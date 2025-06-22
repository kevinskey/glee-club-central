
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  Calendar, 
  Music, 
  Image,
  BookOpen,
  Mail,
  ShoppingBag,
  User,
  Shield
} from "lucide-react";

const publicNavigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Events', href: '/calendar', icon: Calendar },
  { name: 'Media', href: '/media', icon: Image },
  { name: 'Contact', href: '/contact', icon: Mail },
  { name: 'Store', href: '/store', icon: ShoppingBag },
];

const memberNavigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: User },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Music', href: '/music', icon: Music },
];

const adminNavigationItems = [
  { name: 'Admin', href: '/admin', icon: Shield },
];

export function DesktopHorizontalNav() {
  const location = useLocation();
  const { isAuthenticated, profile, user } = useAuth();
  
  const isUserAdmin = profile?.is_super_admin || profile?.role === 'admin' || user?.email === 'kevinskey@mac.com';
  
  // Combine navigation items based on user status
  let navigationItems = [...publicNavigationItems];
  
  if (isAuthenticated) {
    navigationItems = [...navigationItems, ...memberNavigationItems];
    
    if (isUserAdmin) {
      navigationItems = [...navigationItems, ...adminNavigationItems];
    }
  }

  return (
    <nav className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-auto">
      <div className="flex items-center space-x-1 xl:space-x-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
                          (item.href !== '/' && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                isActive 
                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" 
                  : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
        
        {/* External Reader Link */}
        <a
          href="https://reader.gleeworld.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <BookOpen className="h-4 w-4 flex-shrink-0" />
          <span className="whitespace-nowrap">Reader</span>
        </a>
      </div>
    </nav>
  );
}
