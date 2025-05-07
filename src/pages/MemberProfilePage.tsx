
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberProfileDashboard } from "@/components/members/MemberProfileDashboard";

export default function MemberProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  if (!id) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Profile ID is required</h2>
        <p className="mb-4">No member ID was provided.</p>
        <Button onClick={() => navigate('/dashboard/users')}>Return to Members</Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <PageHeader
        title="Member Profile"
        description="View and manage member information"
        icon={<User className="h-6 w-6" />}
      />

      <div className="mt-6">
        <MemberProfileDashboard memberId={id} />
      </div>
    </div>
  );
}
