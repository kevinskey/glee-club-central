
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and edit your profile information"
        icon={<User className="h-6 w-6" />}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your basic profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Name</h4>
                <p className="text-sm text-muted-foreground">John Doe</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Voice Part</h4>
                <p className="text-sm text-muted-foreground">Tenor</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Member Since</h4>
                <p className="text-sm text-muted-foreground">January 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Choir Membership</CardTitle>
            <CardDescription>
              Your membership status and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Dues</h4>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Role</h4>
                <p className="text-sm text-muted-foreground">Member</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Attendance</h4>
                <p className="text-sm text-muted-foreground">95%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
