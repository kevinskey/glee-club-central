
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music } from 'lucide-react';

export function RecordingLibrary() {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">Recording Library Removed</h3>
        <p className="text-muted-foreground">
          Recording library functionality has been removed from the application.
        </p>
      </CardContent>
    </Card>
  );
}
