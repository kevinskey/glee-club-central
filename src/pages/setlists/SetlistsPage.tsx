
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { ListMusic } from "lucide-react";

export default function SetlistsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Setlists"
        description="Create and manage performance setlists"
        icon={<ListMusic className="h-6 w-6" />}
      />
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Your Setlists</h2>
        <p className="text-muted-foreground">Setlists content will be displayed here.</p>
      </div>
    </div>
  );
}
