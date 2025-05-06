
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const InviteMemberPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Invite New Member</CardTitle>
            <CardDescription>
              Send invitations to new choir members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Invite member functionality coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InviteMemberPage;
