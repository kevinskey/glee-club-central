import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RecordingsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
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
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recordings content will be displayed here */}
        <div className="flex h-40 items-center justify-center rounded-md border bg-muted p-8 text-center">
          <p className="text-sm text-muted-foreground">Recordings will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
