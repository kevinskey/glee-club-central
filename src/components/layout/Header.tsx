
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Menu,
  User,
  Settings,
  LogOut,
  Music,
  Clock,
  Piano,
  Mic,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Icons } from "@/components/Icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";
import { PitchPipe } from "@/components/glee-tools/PitchPipe";
import { Metronome } from "@/components/glee-tools/Metronome";
import { AudioRecorder } from "@/components/glee-tools/AudioRecorder";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";
import { PianoKeyboard } from "@/components/glee-tools/PianoKeyboard";

export function Header() {
  const { profile, signOut } = useAuth();
  const { toggleSidebar, open } = useSidebar();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [pitchPipeOpen, setPitchPipeOpen] = useState(false);
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const [audioRecorderOpen, setAudioRecorderOpen] = useState(false);
  const [pianoKeyboardOpen, setPianoKeyboardOpen] = useState(false);
  
  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate("/login");
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b hidden md:block">
      <div className="max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Logo and site name */}
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold flex items-center gap-2 hover:text-primary transition-colors">
            <Icons.logo className="h-6 w-auto" />
            <span className="text-base text-foreground">Glee World</span>
          </Link>
        </div>
          
        {/* Right side: theme toggle and user dropdown */}
        <div className="flex items-center gap-3">
          <GleeToolsDropdown />
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11">
                <Menu className="h-7 w-7 text-foreground" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuLabel>
                {profile?.first_name} {profile?.last_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                <User className="h-4 w-4 mr-2" />
                <span>My Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/update-password")}>
                <Settings className="h-4 w-4 mr-2" />
                <span>Change Password</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/")}>
                <Icons.logo className="h-4 w-auto mr-2" />
                <span>Home Page</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={toggleSidebar}>
                <Menu className="h-4 w-4 mr-2" />
                <span>Toggle Sidebar</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Glee Tools Section */}
              <DropdownMenuLabel>Glee Tools</DropdownMenuLabel>
              
              <DropdownMenuItem onClick={() => setPitchPipeOpen(true)}>
                <Music className="h-4 w-4 mr-2" />
                <span>Pitch Pipe</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => setMetronomeOpen(true)}>
                <Clock className="h-4 w-4 mr-2" />
                <span>Metronome</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => setPianoKeyboardOpen(true)}>
                <Piano className="h-4 w-4 mr-2" />
                <span>Piano Keyboard</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => setAudioRecorderOpen(true)}>
                <Mic className="h-4 w-4 mr-2" />
                <span>Recording Studio</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="flex items-center gap-2 cursor-pointer text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Pitch Pipe Dialog */}
      <Dialog open={pitchPipeOpen} onOpenChange={setPitchPipeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pitch Pipe</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <PitchPipe onClose={() => setPitchPipeOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Metronome Dialog */}
      <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Metronome</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <Metronome onClose={() => setMetronomeOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Piano Keyboard Dialog */}
      <Dialog open={pianoKeyboardOpen} onOpenChange={setPianoKeyboardOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Piano Keyboard</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <PianoKeyboard onClose={() => setPianoKeyboardOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Audio Recorder Dialog */}
      <Dialog open={audioRecorderOpen} onOpenChange={setAudioRecorderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recording Studio</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <AudioRecorder onClose={() => setAudioRecorderOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
