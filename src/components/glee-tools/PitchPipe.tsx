
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music } from 'lucide-react';

export function PitchPipe() {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">Pitch Pipe Removed</h3>
        <p className="text-muted-foreground">
          Pitch pipe functionality has been removed from the application.
        </p>
      </CardContent>
    </Card>
  );
}
