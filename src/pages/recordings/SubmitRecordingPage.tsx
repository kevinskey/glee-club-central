
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SubmitRecordingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Submit Recording"
        description="Record your vocals and share with the Glee Club community"
        icon={<Mic className="h-6 w-6" />}
        actions={
          <Button onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        }
      />
      
      <div className="container px-4">
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <Mic className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Record Your Voice</h3>
          <p className="text-center text-muted-foreground mb-6">
            Use this page to record your voice and share it with the Glee Club community.
            You can record performances, practice sessions, or vocal warm-ups.
          </p>
          <Button>Start Recording</Button>
        </div>
      </div>
    </div>
  );
}
