
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Music, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Shield,
  LayoutDashboard
} from 'lucide-react';

export function MobileNav() {
  const { user, logout } = useAuth();
  const { profile, isAdmin } = useProfile();
  
  const isAdminUser = isAdmin();

  const handleSignOut = async () => {
    await logout();
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Music', href: '/dashboard/sheet-music', icon: Music },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Members', href: '/dashboard/members', icon: Users },
  ];

  const adminNavigation = [
    { name: 'Admin', href: '/admin', icon: Shield },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="space-y-2">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
      
      {isAdminUser && (
        <>
          <div className="border-t pt-2 mt-2">
            {adminNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </>
      )}
      
      <div className="border-t pt-2 mt-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
