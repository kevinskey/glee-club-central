
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Calendar, 
  Music, 
  Image,
  BookOpen,
  Mail,
  ShoppingBag,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Media', href: '/media', icon: Image },
  { name: 'Reader', href: '/reader', icon: BookOpen },
  { name: 'Contact', href: '/contact', icon: Mail },
  { name: 'Store', href: '/store', icon: ShoppingBag },
];

const memberItems = [
  { name: 'Dashboard', href: '/dashboard', icon: User },
  { name: 'Members', href: '/members', icon: Users },
];

export function NavigationMenu() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Button
            key={item.name}
            asChild
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex items-center gap-2",
              isActive && "bg-orange-500 hover:bg-orange-600 text-white"
            )}
          >
            <Link to={item.href}>
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        );
      })}
      
      {isAuthenticated && memberItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Button
            key={item.name}
            asChild
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex items-center gap-2",
              isActive && "bg-orange-500 hover:bg-orange-600 text-white"
            )}
          >
            <Link to={item.href}>
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
