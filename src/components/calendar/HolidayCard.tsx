
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface HolidayCardProps {
  holiday: {
    name: string;
    date: string;
    description?: string;
  };
}

export function HolidayCard({ holiday }: HolidayCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium">{holiday.name}</h3>
        <p className="text-sm text-muted-foreground">{holiday.date}</p>
        {holiday.description && (
          <p className="text-sm mt-2">{holiday.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
