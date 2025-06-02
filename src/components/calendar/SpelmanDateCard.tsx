
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface SpelmanDateCardProps {
  spelmanDate?: {
    name: string;
    date: string;
    description?: string;
  };
}

export function SpelmanDateCard({ spelmanDate }: SpelmanDateCardProps) {
  const defaultDate = {
    name: "Important Academic Date",
    date: "TBD",
    description: "Academic calendar information will be updated soon"
  };

  const displayDate = spelmanDate || defaultDate;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium">{displayDate.name}</h3>
        <p className="text-sm text-muted-foreground">{displayDate.date}</p>
        {displayDate.description && (
          <p className="text-sm mt-2">{displayDate.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
