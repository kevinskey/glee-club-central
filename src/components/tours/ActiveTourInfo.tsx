import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Luggage, 
  Clock,
  Bed,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Tour {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  itinerary: any;
  packing_guide: string;
}

interface TourAssignment {
  room_number: string;
  roommate: {
    first_name: string;
    last_name: string;
  } | null;
}

export const ActiveTourInfo: React.FC = () => {
  const { profile } = useAuth();
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [assignment, setAssignment] = useState<TourAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadActiveTour();
    }
  }, [profile?.id]);

  const loadActiveTour = async () => {
    try {
      // Get active tour
      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .select('*')
        .eq('is_active', true)
        .single();

      if (tourError || !tourData) {
        setActiveTour(null);
        setIsLoading(false);
        return;
      }

      setActiveTour(tourData);

      // Get user's tour assignment
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('tour_assignments')
        .select(`
          room_number,
          roommate:roommate_id(first_name, last_name)
        `)
        .eq('tour_id', tourData.id)
        .eq('member_id', profile?.id)
        .single();

      if (!assignmentError && assignmentData) {
        // Handle the case where roommate could be an array or null
        const roommateData = Array.isArray(assignmentData.roommate) 
          ? assignmentData.roommate[0] 
          : assignmentData.roommate;
        
        setAssignment({
          room_number: assignmentData.room_number,
          roommate: roommateData || null
        });
      }
    } catch (error) {
      console.error('Error loading active tour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!activeTour) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Active Tours</h3>
          <p className="text-muted-foreground">
            There are currently no active tours scheduled.
          </p>
        </CardContent>
      </Card>
    );
  }

  const tourDuration = Math.ceil(
    (new Date(activeTour.end_date).getTime() - new Date(activeTour.start_date).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Tour Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {activeTour.name}
              </CardTitle>
              <CardDescription className="mt-2">
                Active tour information and details
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(activeTour.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">End Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(activeTour.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {tourDuration} days
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tour Details Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="rooming">Rooming</TabsTrigger>
              <TabsTrigger value="packing">Packing Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="itinerary" className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Tour Itinerary
                </h3>
                {activeTour.itinerary ? (
                  <div className="space-y-3">
                    {Object.entries(activeTour.itinerary).map(([date, activities]: [string, any]) => (
                      <div key={date} className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium">{date}</h4>
                        {Array.isArray(activities) ? (
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {activities.map((activity, index) => (
                              <li key={index}>• {activity}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">{activities}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Detailed itinerary will be available soon.
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="rooming" className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  Room Assignment
                </h3>
                {assignment ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">Room Number</p>
                          <p className="text-lg">{assignment.room_number || 'TBD'}</p>
                        </div>
                        {assignment.roommate && (
                          <div>
                            <p className="font-medium">Roommate</p>
                            <p className="text-lg">
                              {assignment.roommate.first_name} {assignment.roommate.last_name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Room assignments may be subject to change. Please check back for updates.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Room assignment information is not yet available.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="packing" className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Luggage className="h-4 w-4" />
                  Packing Guide
                </h3>
                {activeTour.packing_guide ? (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm">
                      {activeTour.packing_guide}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Luggage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Packing guide will be available closer to the tour date.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
