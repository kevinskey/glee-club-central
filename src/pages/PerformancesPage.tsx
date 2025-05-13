
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Music } from "lucide-react";

export default function PerformancesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Performances"
        description="Upcoming and past performances of the Glee Club"
        icon={<Music className="h-6 w-6" />}
      />
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Performance Schedule</h2>
        <p className="text-muted-foreground">Performances content will be displayed here.</p>
      </div>
    </div>
  );
}
