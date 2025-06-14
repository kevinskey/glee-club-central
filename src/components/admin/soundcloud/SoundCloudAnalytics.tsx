
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export function SoundCloudAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
          <p className="text-muted-foreground">
            Detailed analytics for track performance, user engagement, and listening patterns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
