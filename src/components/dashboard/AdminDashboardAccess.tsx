
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminDashboardAccessProps {
  onAccess: () => void;
}

export function AdminDashboardAccess({ onAccess }: AdminDashboardAccessProps) {
  return (
    <Card className="shadow-md border-glee-spelman/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-glee-spelman" />
          <span>Admin Access</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm">
            You have administrator privileges. Access the admin dashboard to manage users, content, and settings.
          </p>
          <Button 
            className="w-full bg-glee-spelman hover:bg-glee-spelman/90 text-white" 
            onClick={onAccess}
          >
            Go to Admin Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
