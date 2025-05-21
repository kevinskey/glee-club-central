
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Music, Mic, Headphones, FileMusic, Radio } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";

interface MusicAppHeaderProps {
  currentSection?: string;
}

export function MusicAppHeader({ currentSection }: MusicAppHeaderProps) {
  const { isAuthenticated } = useAuth();
  
  // Define music app sections
  const sections = [
    { id: "recordings", label: "Recordings", icon: <Mic className="h-4 w-4 mr-2" />, path: "/recordings" },
    { id: "practice", label: "Practice", icon: <Headphones className="h-4 w-4 mr-2" />, path: "/practice" },
    { id: "sheet-music", label: "Sheet Music", icon: <FileMusic className="h-4 w-4 mr-2" />, path: "/sheet-music" },
    { id: "audio", label: "Audio Library", icon: <Radio className="h-4 w-4 mr-2" />, path: "/audio-management" }
  ];
  
  return (
    <div className="bg-background border-b sticky top-0 z-10">
      <div className="container py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center mr-6">
              <Music className="h-6 w-6 text-glee-purple mr-2" />
              <span className="font-bold text-lg">Music Studio</span>
            </Link>
            
            <Tabs value={currentSection} className="hidden md:block">
              <TabsList>
                {sections.map((section) => (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    asChild
                  >
                    <Link to={section.path} className="flex items-center">
                      {section.icon}
                      {section.label}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
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
        
        {/* Mobile tabs */}
        <div className="md:hidden mt-2 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {sections.map((section) => (
              <Link 
                key={section.id}
                to={section.path}
                className={`flex items-center whitespace-nowrap px-3 py-1.5 text-sm rounded-full ${
                  currentSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted-foreground/10"
                }`}
              >
                {section.icon}
                {section.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
