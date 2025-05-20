
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface AdminDashboardAccessProps {
  onAccess: () => void;
}

export function AdminDashboardAccess({ onAccess }: AdminDashboardAccessProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5 text-primary" />
          Admin Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          You have administrative privileges. Access the admin dashboard to manage members, content, and settings.
        </p>
        <Button onClick={onAccess} className="w-full bg-primary hover:bg-primary/90">
          Go to Admin Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
