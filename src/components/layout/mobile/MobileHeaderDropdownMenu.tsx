
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Music, Clock, Piano, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuProvider,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MobileHeaderDropdownMenuProps {
  isAuthenticated: boolean;
  isDashboardPath: boolean;
  onOpenPitchPipe: () => void;
  onOpenMetronome: () => void;
  onOpenAudioRecorder: () => void;
}

export function MobileHeaderDropdownMenu({
  isAuthenticated,
  isDashboardPath,
  onOpenPitchPipe,
  onOpenMetronome,
  onOpenAudioRecorder
}: MobileHeaderDropdownMenuProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { setOpenMobile, openMobile } = useSidebar();

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate("/login");
    }
  };

  return (
    <DropdownMenuProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="flex-shrink-0 h-10 w-10"
          >
            <Menu className="h-6 w-6 text-foreground" />
            <span className="sr-only">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover">
          <DropdownMenuItem onClick={() => navigate("/")}>
            Home
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate("/about")}>
            About
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate("/privacy")}>
            Privacy Policy
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate("/press-kit")}>
            Press Kit
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Glee Tools Section */}
          <DropdownMenuLabel>Glee Tools</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={onOpenPitchPipe}>
            <Music className="h-4 w-4 mr-2" />
            <span>Pitch Pipe</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onOpenMetronome}>
            <Clock className="h-4 w-4 mr-2" />
            <span>Metronome</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onOpenAudioRecorder}>
            <Piano className="h-4 w-4 mr-2" />
            <span>Piano & Recording Studio</span>
          </DropdownMenuItem>
          
          {isAuthenticated && (
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              Dashboard
            </DropdownMenuItem>
          )}
          
          {isDashboardPath && (
            <DropdownMenuItem onClick={() => setOpenMobile(!openMobile)}>
              Toggle Sidebar
            </DropdownMenuItem>
          )}
          
          {isAuthenticated ? (
            <>
              <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                Member Portal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => navigate("/login")}>
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/login")}>
                Member Portal
              </DropdownMenuItem>
            </>
          )}
          
          {!isAuthenticated && (
            <DropdownMenuItem onClick={() => navigate("/register")}>
              Register
            </DropdownMenuItem>
          )}
          
          {!isAuthenticated && (
            <DropdownMenuItem onClick={() => navigate("/register/admin")}>
              Admin Registration
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </DropdownMenuProvider>
  );
}
