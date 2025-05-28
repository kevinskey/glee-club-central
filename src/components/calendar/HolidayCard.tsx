
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NationalHoliday {
  id: string;
  title: string;
  date: Date;
  description: string;
  imageUrl: string;
  isObserved: boolean;
  category: 'federal' | 'observance';
}

interface HolidayCardProps {
  holiday: NationalHoliday;
  className?: string;
}

export const HolidayCard: React.FC<HolidayCardProps> = ({ holiday, className }) => {
  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      <div className="relative h-32 overflow-hidden">
        <img 
          src={holiday.imageUrl} 
          alt={holiday.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={holiday.category === 'federal' ? 'default' : 'secondary'}>
            {holiday.category === 'federal' ? 'Federal Holiday' : 'Observance'}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{holiday.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{holiday.description}</p>
      </CardContent>
    </Card>
  );
};
