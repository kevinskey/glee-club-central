
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Users } from "lucide-react";

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Members Directory"
        description="View and contact fellow Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Members List</h2>
        <p className="text-muted-foreground">Member list content will be displayed here.</p>
      </div>
    </div>
  );
}
