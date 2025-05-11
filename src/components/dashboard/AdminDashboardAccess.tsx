
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminDashboardAccessProps {
  onAccess: () => void;
}

export const AdminDashboardAccess: React.FC<AdminDashboardAccessProps> = ({ onAccess }) => {
  return (
    <Card className="border-glee-spelman/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Administrator Dashboard</CardTitle>
        <CardDescription>
          Access the administrator dashboard to manage Glee Club resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="border-glee-spelman text-glee-spelman hover:bg-glee-spelman/5"
          onClick={onAccess}
        >
          Go to Admin Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};
