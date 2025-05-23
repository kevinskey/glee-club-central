
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RecordingArchive } from "@/components/recordings/RecordingArchive";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function RecordingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  
  // Set loaded state after a delay to prevent UI flicker
  useEffect(() => {
    // First set initial loading state
    if (!isLoaded && !authLoading) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 200);
      
      return () => clearTimeout(timer);
    }
    
    // Then trigger content animation once everything is ready
    if (isLoaded && !contentReady) {
      const contentTimer = setTimeout(() => {
        setContentReady(true);
      }, 100);
      
      return () => clearTimeout(contentTimer);
    }
  }, [isLoaded, authLoading, contentReady]);
  
  // Error handling for missing authentication
  useEffect(() => {
    if (isLoaded && !authLoading && !isAuthenticated) {
      toast.error("Authentication required to access recordings");
      navigate("/login");
    }
  }, [isLoaded, authLoading, isAuthenticated, navigate]);

  // Loading state shows skeleton UI
  if (authLoading || !isLoaded) {
    return (
      <div className="space-y-6 opacity-0 animate-fade-in">
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
        <div className="h-40 w-full bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${contentReady ? 'animate-fade-in opacity-100' : 'opacity-0'}`}>
      <PageHeader
        title="Recordings"
        description="Submit and listen to vocal recordings"
        icon={<Mic className="h-6 w-6" />}
        actions={
          <Button onClick={() => navigate("/recordings/submit")}>
            Submit Recording
          </Button>
        }
      />
      
      <RecordingArchive />
    </div>
  );
}
