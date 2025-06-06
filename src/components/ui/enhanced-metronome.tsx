
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function EnhancedMetronome() {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">Metronome Removed</h3>
        <p className="text-muted-foreground">
          Metronome functionality has been removed from the application.
        </p>
      </CardContent>
    </Card>
  );
}
