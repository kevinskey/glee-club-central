
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Bus, 
  Hotel, 
  Music, 
  Users,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

interface TourInfo {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  description: string;
  itinerary: Array<{
    date: string;
    time: string;
    activity: string;
    location: string;
  }>;
  requirements: string[];
}

export function ActiveTourInfo() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [tourInfo, setTourInfo] = useState<TourInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual data fetching
    const mockTour: TourInfo = {
      id: '1',
      name: 'Spring Tour 2024',
      destination: 'New York City',
      startDate: '2024-04-15',
      endDate: '2024-04-20',
      status: 'upcoming',
      description: 'A five-day performance tour featuring concerts at Carnegie Hall and Lincoln Center.',
      itinerary: [
        {
          date: '2024-04-15',
          time: '8:00 AM',
          activity: 'Departure from Atlanta',
          location: 'Spelman College'
        },
        {
          date: '2024-04-15',
          time: '7:00 PM',
          activity: 'Welcome dinner',
          location: 'Hotel restaurant'
        },
        {
          date: '2024-04-16',
          time: '2:00 PM',
          activity: 'Carnegie Hall rehearsal',
          location: 'Carnegie Hall'
        },
        {
          date: '2024-04-16',
          time: '8:00 PM',
          activity: 'Carnegie Hall performance',
          location: 'Carnegie Hall'
        }
      ],
      requirements: [
        'Valid ID required',
        'Black dress or formal attire',
        'Comfortable walking shoes',
        'Personal items and medications'
      ]
    };
    
    setTourInfo(mockTour);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading tour information...</div>
        </CardContent>
      </Card>
    );
  }

  if (!tourInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Bus className="h-8 w-8 mx-auto mb-2" />
            <p>No active tours at this time.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5" />
                {tourInfo.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                {tourInfo.destination}
              </CardDescription>
            </div>
            <Badge variant={tourInfo.status === 'upcoming' ? 'default' : 'secondary'}>
              {tourInfo.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{tourInfo.description}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{tourInfo.startDate} - {tourInfo.endDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tourInfo.itinerary.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{item.activity}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {item.date}
                    <Clock className="h-3 w-3 ml-2" />
                    {item.time}
                    <MapPin className="h-3 w-3 ml-2" />
                    {item.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tourInfo.requirements.map((requirement, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                {requirement}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
