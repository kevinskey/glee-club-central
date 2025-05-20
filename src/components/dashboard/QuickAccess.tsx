
import React from "react";
import { useNavigate } from "react-router-dom";
import { Music, Calendar, Headphones, User, Bell, Mic } from "lucide-react";

export function QuickAccess() {
  const navigate = useNavigate();
  
  // Quick access tiles
  const quickAccessTiles = [
    {
      title: "Sheet Music",
      icon: <Music className="h-5 w-5 text-white" />,
      href: "/dashboard/sheet-music",
      color: "bg-gradient-to-br from-purple-500 to-purple-700"
    },
    {
      title: "Calendar",
      icon: <Calendar className="h-5 w-5 text-white" />,
      href: "/dashboard/calendar",
      color: "bg-gradient-to-br from-blue-500 to-blue-700"
    },
    {
      title: "Practice Resources",
      icon: <Headphones className="h-5 w-5 text-white" />,
      href: "/dashboard/practice",
      color: "bg-gradient-to-br from-green-500 to-green-700"
    },
    {
      title: "My Recordings",
      icon: <Mic className="h-5 w-5 text-white" />,
      href: "/dashboard/recordings",
      color: "bg-gradient-to-br from-red-500 to-red-700"
    },
    {
      title: "My Profile",
      icon: <User className="h-5 w-5 text-white" />,
      href: "/dashboard/profile",
      color: "bg-gradient-to-br from-amber-500 to-amber-700"
    },
    {
      title: "Announcements",
      icon: <Bell className="h-5 w-5 text-white" />,
      href: "/dashboard/announcements",
      color: "bg-gradient-to-br from-pink-500 to-pink-700"
    },
  ];
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickAccessTiles.map((tile, index) => (
          <div 
            key={index} 
            className={`${tile.color} rounded-xl p-4 h-full shadow-md hover:shadow-lg transition-all text-white flex flex-col justify-between min-h-[120px] cursor-pointer`}
            onClick={() => navigate(tile.href)}
          >
            <div className="p-2 bg-white/20 rounded-lg w-fit">
              {tile.icon}
            </div>
            <div className="mt-auto">
              <h3 className="font-medium">{tile.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
