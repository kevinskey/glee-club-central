
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface HolidayCardProps {
  holiday?: {
    name: string;
    date: string;
    description?: string;
  };
}

export function HolidayCard({ holiday }: HolidayCardProps) {
  const defaultHoliday = {
    name: "Upcoming Holiday",
    date: "TBD",
    description: "Holiday information will be updated soon"
  };

  const displayHoliday = holiday || defaultHoliday;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium">{displayHoliday.name}</h3>
        <p className="text-sm text-muted-foreground">{displayHoliday.date}</p>
        {displayHoliday.description && (
          <p className="text-sm mt-2">{displayHoliday.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
