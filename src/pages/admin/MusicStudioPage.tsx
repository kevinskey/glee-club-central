
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

export default function MusicStudioPage() {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Music Studio</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Music Studio Removed</h3>
          <p className="text-muted-foreground">
            Music studio functionality has been removed from the application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
