
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

export const DeveloperTools: React.FC = () => {
  const { promoteToSuperAdmin, isUpdating, isSuperAdmin } = usePermissions();
  
  return (
    <Card className="shadow-md border-orange-400">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-500" />
          <span>Development Tools</span>
        </CardTitle>
        <CardDescription>
          Helper tools for development only
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full border-orange-400 text-orange-600 hover:bg-orange-50"
          onClick={promoteToSuperAdmin}
          disabled={isUpdating || isSuperAdmin}
        >
          {isUpdating ? "Promoting..." : isSuperAdmin ? "Already Super Admin" : "Make Me Super Admin"}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          For development only. Sets your account as a super admin with all permissions.
        </p>
      </CardContent>
    </Card>
  );
};
