
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Mic } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RecordingSection } from "@/components/audio/RecordingSection";
import { MusicAppHeader } from "@/components/layout/MusicAppHeader";
import { toast } from "sonner";

export default function RecordingStudioPage() {
  const { isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      toast.success("Welcome to the Recording Studio! You are ready to record and save your tracks.");
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <MusicAppHeader currentSection="recording" />
      <div className="container py-6">
        <PageHeader
          title="Recording Studio"
          description="Record, save, and manage your vocal recordings"
          icon={<Mic className="h-6 w-6" />}
        />

        <div className="mt-8">
          <RecordingSection 
            onRecordingSaved={(category) => {
              toast.success(`Recording saved successfully to ${category === "my_tracks" ? "My Tracks" : 
                             category === "part_tracks" ? "Part Tracks" : 
                             "Recordings"}`);
            }}
          />
        </div>
      </div>
    </>
  );
}
