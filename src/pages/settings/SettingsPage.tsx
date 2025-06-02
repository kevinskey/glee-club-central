import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" defaultValue={user?.email} disabled />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" placeholder="Your Name" />
            </div>
            <div>
              <Button>Update Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
