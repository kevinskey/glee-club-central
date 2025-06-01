
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/contexts/ProfileContext';

// This is a stub component for backward compatibility
export function UserRoleEditor() {
  const { profile } = useProfile();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Role</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          {profile?.is_super_admin ? 'Administrator' : 'Member'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Role management has been simplified. Users are now either administrators or members.
        </p>
      </CardContent>
    </Card>
  );
}
