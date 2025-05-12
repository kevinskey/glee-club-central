
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SubmitRecordingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Submit Recording"
        description="Record your vocals and share with the Glee Club community"
        icon={<Mic className="h-6 w-6" />}
        actions={
          <Button onClick={() => navigate(-1)} size={isMobile ? "sm" : "default"}>
            Back
          </Button>
        }
      />
      
      <div className="container px-4">
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 border border-dashed rounded-lg">
          <Mic className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2 text-center">Record Your Voice</h3>
          <p className="text-center text-muted-foreground mb-6 max-w-md">
            Use this page to record your voice and share it with the Glee Club community.
            You can record performances, practice sessions, or vocal warm-ups.
          </p>
          <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-3 max-w-xs mx-auto">
            <Button className="w-full" size={isMobile ? "lg" : "default"}>Start Recording</Button>
            <Button variant="outline" className="w-full" size={isMobile ? "lg" : "default"}>Upload Audio</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
