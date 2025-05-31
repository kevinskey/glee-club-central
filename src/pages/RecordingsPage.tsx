
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RecordingArchive } from "@/components/recordings/RecordingArchive";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";

export default function RecordingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [contentReady, setContentReady] = useState(false);
  
  // Show loading while authentication is being checked
  if (authLoading) {
    return <PageLoader message="Loading recordings..." />;
  }
  
  // Set loaded state after a delay to prevent UI flicker
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // Trigger content animation once authentication is confirmed
      const contentTimer = setTimeout(() => {
        setContentReady(true);
      }, 300); // Slightly longer delay for smoother transition
      
      return () => clearTimeout(contentTimer);
    }
  }, [authLoading, isAuthenticated]);

  return (
    <div className={`space-y-6 transition-opacity duration-500 ${contentReady ? 'opacity-100' : 'opacity-0'}`}>
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
