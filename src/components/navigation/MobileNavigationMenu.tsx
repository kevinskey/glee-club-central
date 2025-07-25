
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
  { name: 'Reader', href: 'https://reader.gleeworld.org', icon: BookOpen, external: true },
  { name: 'Contact', href: '/contact', icon: Mail },
  { name: 'Store', href: '/store', icon: ShoppingBag },
];

const memberItems = [
  { name: 'Dashboard', href: '/dashboard', icon: User },
  { name: 'Members', href: '/members', icon: Users },
];

interface MobileNavigationMenuProps {
  onItemClick?: () => void;
}

export function MobileNavigationMenu({ onItemClick }: MobileNavigationMenuProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="flex flex-col space-y-2 p-4">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        if (item.external) {
          return (
            <Button
              key={item.name}
              asChild
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 justify-start text-gray-900 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-400"
              onClick={handleClick}
            >
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <Icon className="h-4 w-4" />
                {item.name}
              </a>
            </Button>
          );
        }
        
        return (
          <Button
            key={item.name}
            asChild
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex items-center gap-2 justify-start",
              isActive ? "bg-orange-500 hover:bg-orange-600 text-white" : "text-gray-900 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-400"
            )}
            onClick={handleClick}
          >
            <Link to={item.href}>
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        );
      })}
      
      {isAuthenticated && (
        <>
          <hr className="my-2" />
          {memberItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Button
                key={item.name}
                asChild
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex items-center gap-2 justify-start",
                  isActive ? "bg-orange-500 hover:bg-orange-600 text-white" : "text-gray-900 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-400"
                )}
                onClick={handleClick}
              >
                <Link to={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </>
      )}
    </div>
  );
}
