
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

export function PitchPipe() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Pitch Pipe
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2 text-lg">Audio Features Removed</h3>
        <p className="text-muted-foreground text-sm">
          Pitch pipe and audio functionality has been removed from the application.
        </p>
      </CardContent>
    </Card>
  );
}
