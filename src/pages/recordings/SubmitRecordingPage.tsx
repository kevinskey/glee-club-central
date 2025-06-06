
import React from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { BackButton } from "@/components/ui/back-button";

export default function SubmitRecordingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <PageWrapper
      title="Submit Recording"
      description="Record your vocals and share with the Glee Club community"
      icon={<Mic />}
      maxWidth="lg"
    >
      <div className="flex items-center justify-end mb-4">
        <BackButton 
          fallbackPath="/recordings" 
          size={isMobile ? "sm" : "default"} 
        />
      </div>
      
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 border border-dashed rounded-lg">
        <Mic className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
        <h3 className="text-base sm:text-lg font-medium mb-2 text-center">Record Your Voice</h3>
        <p className="text-center text-muted-foreground mb-6 max-w-md text-sm sm:text-base">
          Use this page to record your voice and share it with the Glee Club community.
          You can record performances, practice sessions, or vocal warm-ups.
        </p>
        <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-3 max-w-xs mx-auto">
          <Button className="w-full" size={isMobile ? "lg" : "default"}>Start Recording</Button>
          <Button variant="outline" className="w-full" size={isMobile ? "lg" : "default"}>Upload Audio</Button>
        </div>
      </div>
    </PageWrapper>
  );
}
