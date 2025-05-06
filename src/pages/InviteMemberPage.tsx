
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const InviteMemberPage: React.FC = () => {
  return (
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
  );
};

export default InviteMemberPage;
