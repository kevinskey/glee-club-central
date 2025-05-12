
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogIn, Share2, MessageSquare, Mic } from "lucide-react";

export function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-glee-spelman text-white border-t border-glee-purple/30 md:hidden">
      <div className="flex items-center justify-around w-full px-2 py-2">
        <Link 
          to="/login" 
          className="flex flex-col items-center justify-center px-3 py-2"
        >
          <LogIn className="h-5 w-5" />
          <span className="text-xs mt-1">Login</span>
        </Link>
        <Link 
          to="/recordings/submit" 
          className="flex flex-col items-center justify-center px-3 py-2"
        >
          <Mic className="h-5 w-5" />
          <span className="text-xs mt-1">Record</span>
        </Link>
        <Link 
          to="/social" 
          className="flex flex-col items-center justify-center px-3 py-2"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-xs mt-1">Social</span>
        </Link>
        <Link 
          to="/contact" 
          className="flex flex-col items-center justify-center px-3 py-2"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs mt-1">Contact</span>
        </Link>
      </div>
    </div>
  );
}
