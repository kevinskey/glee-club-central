
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MobileMenu } from "@/components/landing/header/MobileMenu";
import { useSidebar } from "@/components/ui/sidebar";
import { MobileHeaderLogo } from "./mobile/MobileHeaderLogo";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileHeaderDropdownMenu } from "./mobile/MobileHeaderDropdownMenu";
import { MobileToolDialogs } from "./mobile/MobileToolDialogs";

export function MobileHeader() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { setOpenMobile, openMobile } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pitchPipeOpen, setPitchPipeOpen] = useState(false);
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const [audioRecorderOpen, setAudioRecorderOpen] = useState(false);
  const [pianoKeyboardOpen, setPianoKeyboardOpen] = useState(false);
  
  const isDashboardPath = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSidebarToggle = () => {
    if (isDashboardPath) {
      // For dashboard pages, use the sidebar's setOpenMobile function
      setOpenMobile(!openMobile);
    } else {
      // For public pages, toggle our local mobile menu state
      toggleMobileMenu();
    }
  };

  return (
    <>
      <header className="md:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-screen-2xl mx-auto px-2 flex h-14 items-center justify-between">
          {/* Left side: Logo */}
          <div className="flex items-center gap-1">
            <MobileHeaderLogo />
          </div>
          
          {/* Right side: tools and menu dropdown */}
          <div className="flex items-center gap-0.5">
            <GleeToolsDropdown />
            <ThemeToggle />
            <MobileHeaderDropdownMenu 
              isAuthenticated={isAuthenticated}
              isDashboardPath={isDashboardPath}
              onOpenPitchPipe={() => setPitchPipeOpen(true)}
              onOpenMetronome={() => setMetronomeOpen(true)}
              onOpenAudioRecorder={() => setAudioRecorderOpen(true)}
              onOpenPianoKeyboard={() => setPianoKeyboardOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Mobile menu for public pages */}
      {mobileMenuOpen && !isDashboardPath && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
      
      {/* Tool Dialogs */}
      <MobileToolDialogs
        pitchPipeOpen={pitchPipeOpen}
        metronomeOpen={metronomeOpen}
        audioRecorderOpen={audioRecorderOpen}
        pianoKeyboardOpen={pianoKeyboardOpen}
        setPitchPipeOpen={setPitchPipeOpen}
        setMetronomeOpen={setMetronomeOpen}
        setAudioRecorderOpen={setAudioRecorderOpen}
        setPianoKeyboardOpen={setPianoKeyboardOpen}
      />
    </>
  );
}
