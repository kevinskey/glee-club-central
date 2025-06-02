
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Music, Calendar, Heart } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function FanDashboardPage() {
  const { user, profile, isLoading, isInitialized, isAuthenticated } = useAuth();

  // Show loading during auth initialization
  if (!isInitialized || isLoading) {
    return <PageLoader message="Loading fan dashboard..." className="min-h-screen" />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to Glee World!</h1>
        <p className="text-muted-foreground">
          Your gateway to the Spelman College Glee Club
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Stay updated with our latest performances and events.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Latest Recordings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Listen to our newest musical performances.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with other fans and supporters.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Support Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Help support our musical mission.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
