import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RecordingStudioPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader message="Loading recording studio..." />;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You must be logged in to access the recording studio.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recording Studio</h1>
        <p className="text-muted-foreground">
          Create and manage your recordings
        </p>
      </div>

      <Card>
        <CardContent className="text-center py-8">
          <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Recording Studio Coming Soon</h3>
          <p className="text-muted-foreground">
            Recording functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
