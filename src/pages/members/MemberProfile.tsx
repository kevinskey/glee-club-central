
import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from "@/components/ui/page-header";
import { User } from "lucide-react";

export default function MemberProfile() {
  const { id } = useParams();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Profile"
        description={`Viewing profile for member ${id}`}
        icon={<User className="h-6 w-6" />}
      />
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
        <p className="text-muted-foreground">Member profile content will be displayed here.</p>
      </div>
    </div>
  );
}
