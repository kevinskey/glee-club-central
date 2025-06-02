
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface SpelmanDateCardProps {
  spelmanDate: {
    name: string;
    date: string;
    description?: string;
  };
}

export function SpelmanDateCard({ spelmanDate }: SpelmanDateCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium">{spelmanDate.name}</h3>
        <p className="text-sm text-muted-foreground">{spelmanDate.date}</p>
        {spelmanDate.description && (
          <p className="text-sm mt-2">{spelmanDate.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
