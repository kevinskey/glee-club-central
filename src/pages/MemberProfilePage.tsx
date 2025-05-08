
import React from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MemberProfileDashboard } from "@/components/members/MemberProfileDashboard";

export default function MemberProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <PageHeader
        title="Member Profile"
        description="View or edit member details"
        icon={<User className="h-6 w-6" />}
      />
      
      {id && <MemberProfileDashboard memberId={id} />}
    </div>
  );
}
