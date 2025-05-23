
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, LogIn } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AudioRecorder } from "../AudioRecorder";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RecordingStudioDialogProps {
  audioContextRef: React.RefObject<AudioContext | null>;
}

export function RecordingStudioDialog({ audioContextRef }: RecordingStudioDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [authCheckDialogOpen, setAuthCheckDialogOpen] = React.useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Check authentication status without causing re-renders
  const userAuthenticated = React.useMemo(() => 
    isAuthenticated && !!user, [isAuthenticated, user]
  );

  // Handle opening recording studio with authentication check
  const handleOpenRecordingStudio = React.useCallback(() => {
    if (userAuthenticated) {
      setIsOpen(true);
    } else {
      setAuthCheckDialogOpen(true);
    }
  }, [userAuthenticated]);

  // Handle login navigation with proper state management
  const handleGoToLogin = React.useCallback(() => {
    setAuthCheckDialogOpen(false);
    
    // Store intent in sessionStorage instead of URL params to reduce route changes
    sessionStorage.setItem('authRedirectPath', '/dashboard/recording-studio');
    sessionStorage.setItem('authRedirectIntent', 'recording');
    
    toast.info("Please log in to use the Recording Studio");
    navigate('/login');
  }, [navigate]);

  // Navigate to dashboard studio
  const handleGoToDashboardStudio = React.useCallback(() => {
    setAuthCheckDialogOpen(false);
    navigate('/dashboard/recording-studio');
  }, [navigate]);

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
