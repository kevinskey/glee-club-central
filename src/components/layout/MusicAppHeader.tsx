
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Music } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";

interface MusicAppHeaderProps {
  currentSection?: string;
}

export function MusicAppHeader({ currentSection }: MusicAppHeaderProps) {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-background border-b sticky top-0 z-10">
      <div className="container py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center mr-6">
              <Music className="h-6 w-6 text-glee-purple mr-2" />
              <span className="font-bold text-lg">Glee Tools</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <GleeToolsDropdown />
            
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Back to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
