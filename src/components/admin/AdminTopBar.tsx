
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  Menu, 
  Settings, 
  LogOut, 
  User,
  Moon,
  Sun
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

interface AdminTopBarProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export function AdminTopBar({ onMenuClick, isMobile = false }: AdminTopBarProps) {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between transition-colors duration-200 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMenuClick}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo/Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg transition-colors duration-200">
            <div className="w-6 h-6 bg-orange-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">SC</span>
            </div>
          </div>
          {!isMobile && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Glee Club Management</p>
            </div>
          )}
        </div>

        {/* Search Bar - Desktop Only */}
        {!isMobile && (
          <div className="flex-1 max-w-md ml-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        {isMobile && (
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <Search className="h-5 w-5" />
          </Button>
        )}

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTheme}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
            3
          </Badge>
        </Button>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || "Admin"} />
                <AvatarFallback className="bg-orange-500 text-white">
                  {profile?.first_name?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors duration-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
