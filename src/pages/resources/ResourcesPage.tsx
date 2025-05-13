
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { BookOpen } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Resources"
        description="Educational materials and resources for Glee Club members"
        icon={<BookOpen className="h-6 w-6" />}
      />
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Available Resources</h2>
        <p className="text-muted-foreground">Resources content will be displayed here.</p>
      </div>
    </div>
  );
}
