
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Headphones } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function RecordingsPage() {
  const { user, isLoading } = useAuth();
  const { isAuthenticated } = useProfile();

  if (isLoading) {
    return <PageLoader message="Loading recordings..." />;
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Headphones className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You must be logged in to access recordings.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recordings</h1>
        <p className="text-muted-foreground">
          Access practice tracks and performance recordings
        </p>
      </div>

      <Card>
        <CardContent className="text-center py-8">
          <Headphones className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Recordings Coming Soon</h3>
          <p className="text-muted-foreground">
            Recording functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
