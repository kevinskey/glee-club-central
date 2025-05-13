
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Clock } from "lucide-react";

export default function PracticeLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice Logs"
        description="Track your personal practice time and progress"
        icon={<Clock className="h-6 w-6" />}
      />
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Your Practice History</h2>
        <p className="text-muted-foreground">Practice logs content will be displayed here.</p>
      </div>
    </div>
  );
}
