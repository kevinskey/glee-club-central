
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mic } from 'lucide-react';

export function KaraokeStudio() {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">Karaoke Studio Removed</h3>
        <p className="text-muted-foreground">
          Karaoke functionality has been removed from the application.
        </p>
      </CardContent>
    </Card>
  );
}
