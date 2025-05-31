
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { adminNavItems } from "@/components/layout/AdminNavItems";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { X } from "lucide-react";

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminMobileSidebar({ isOpen, onClose }: AdminMobileSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <SheetTitle className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <div className="w-6 h-6 bg-orange-500 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">SC</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Admin</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Glee Club</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav className="p-4 space-y-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.url}
                to={item.url}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                )}
                end={item.url === "/admin"}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.title}</span>
                {item.title === "Orders" && (
                  <Badge variant="destructive" className="bg-red-500 text-white text-xs">
                    12
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
