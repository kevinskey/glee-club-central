
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export function ExecEventsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground">
          (Events module coming soon. This is a placeholder component.)
        </div>
      </CardContent>
    </Card>
  );
}
