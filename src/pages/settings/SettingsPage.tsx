
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const { loading } = useAuth();

  if (loading) {
    return <PageLoader message="Loading settings..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences
        </p>
      </div>

      <Card>
        <CardContent className="text-center py-8">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Settings Coming Soon</h3>
          <p className="text-muted-foreground">
            Settings functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
