
import React from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MemberProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      
      <PageHeader
        title="Member Profile"
        description="View member details"
        icon={<User className="h-6 w-6" />}
      />
      
      <div className="bg-card border rounded-lg p-6 mt-6">
        <p>Profile information for member ID: {id || 'No ID provided'}</p>
      </div>
    </div>
  );
}
