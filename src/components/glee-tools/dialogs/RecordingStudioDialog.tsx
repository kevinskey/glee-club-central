
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, LogIn } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AudioRecorder } from "../AudioRecorder";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface RecordingStudioDialogProps {
  audioContextRef: React.RefObject<AudioContext | null>;
}

export function RecordingStudioDialog({ audioContextRef }: RecordingStudioDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [authCheckDialogOpen, setAuthCheckDialogOpen] = React.useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Check authentication before opening recording studio
  const handleOpenRecordingStudio = () => {
    if (isAuthenticated && user) {
      setIsOpen(true);
    } else {
      setAuthCheckDialogOpen(true);
    }
  };

  // Go to login page with recording intent
  const handleGoToLogin = () => {
    setAuthCheckDialogOpen(false);
    navigate('/login?returnTo=/dashboard/recording-studio&intent=recording');
  };

  // Go to dashboard recording studio
  const handleGoToDashboardStudio = () => {
    setAuthCheckDialogOpen(false);
    navigate('/dashboard/recording-studio');
  };

  return (
    <>
      <DropdownMenuItem onClick={handleOpenRecordingStudio} className="cursor-pointer flex items-center gap-2 text-popover-foreground">
        <Mic className="h-4 w-4 mr-2" />
        Recording Studio
      </DropdownMenuItem>
      
      {/* Audio Recorder Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Recording Studio</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <AudioRecorder 
              onClose={() => setIsOpen(false)} 
              audioContextRef={audioContextRef}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Authentication Check Dialog */}
      <Dialog open={authCheckDialogOpen} onOpenChange={setAuthCheckDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              You need to be logged in to save recordings. Would you like to:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="default" 
                className="flex-1" 
                onClick={handleGoToLogin}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1" 
                onClick={handleGoToDashboardStudio}
              >
                <Mic className="mr-2 h-4 w-4" />
                Go to Dashboard Studio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
