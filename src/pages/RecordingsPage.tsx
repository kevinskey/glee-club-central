
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RecordingArchive } from "@/components/recordings/RecordingArchive";

export default function RecordingsPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Set loaded state after a small delay to prevent UI flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="animate-fade-in space-y-6 opacity-0">
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
        <div className="h-40 w-full bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
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
