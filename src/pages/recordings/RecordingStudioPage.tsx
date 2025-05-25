
import React, { useEffect, useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Mic } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RecordingSection } from "@/components/audio/RecordingSection";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RecordingStudioPage() {
  const { isAuthenticated, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for browser compatibility
    const checkBrowserCompatibility = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Your browser doesn't support audio recording. Please try using Chrome, Firefox, or Edge.");
        return false;
      }
      return true;
    };

    const initializeRecordingStudio = async () => {
      setIsLoading(true);
      try {
        // Check browser compatibility
        if (!checkBrowserCompatibility()) return;
        
        if (isAuthenticated && user) {
          // If we have user data, we're ready to proceed
          toast.success("Welcome to the Recording Studio! You are ready to record and save your tracks.");
        }
      } catch (err) {
        console.error("Failed to initialize recording studio:", err);
        setError("There was a problem loading the recording studio. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeRecordingStudio();
  }, [isAuthenticated, user]);

  return (
    <div className="container py-6">
      <PageHeader
        title="Recording Studio"
        description="Record, save, and manage your vocal recordings"
        icon={<Mic className="h-6 w-6" />}
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-glee-spelman"></div>
        </div>
      ) : (
        <div className="mt-8">
          <RecordingSection 
            onRecordingSaved={(category) => {
              toast.success(`Recording saved successfully to ${category === "my_tracks" ? "My Tracks" : 
                            category === "part_tracks" ? "Part Tracks" : 
                            "Recordings"}`);
            }}
          />
        </div>
      )}
    </div>
  );
}
