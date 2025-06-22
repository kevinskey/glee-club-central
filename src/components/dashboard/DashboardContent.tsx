
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EcommerceSection } from './EcommerceSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Music, 
  Users, 
  Bell, 
  Clock, 
  MapPin, 
  Star,
  BookOpen,
  DollarSign,
  Award,
  TrendingUp,
  Heart,
  Mic
} from 'lucide-react';

export function DashboardContent() {
  const { profile, isAdmin } = useAuth();

  if (!profile) {
    return <div>Loading dashboard content...</div>;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">3</div>
            <p className="text-xs text-blue-700">
              Next: Spring Concert
            </p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                March 15
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Sheet Music</CardTitle>
            <Music className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">12</div>
            <p className="text-xs text-purple-700">
              Available pieces
            </p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                3 New
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Attendance</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">95%</div>
            <p className="text-xs text-green-700">
              This semester
            </p>
            <div className="mt-2">
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Dues Status</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              Current
            </div>
            <p className="text-xs text-orange-700">
              Spring 2025
            </p>
            <div className="mt-2">
              <Badge variant="default" className="text-xs">
                Paid
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Your most-used Glee Club features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">View Sheet Music</span>
              <span className="text-xs text-muted-foreground">Access your vocal parts</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Calendar className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Mark Attendance</span>
              <span className="text-xs text-muted-foreground">Check in to rehearsals</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Mic className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Practice Log</span>
              <span className="text-xs text-muted-foreground">Track your practice time</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Bell className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Announcements</span>
              <span className="text-xs text-muted-foreground">Stay up to date</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Your next Glee Club events and rehearsals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  15
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Spring Concert</p>
                  <p className="text-sm text-gray-500">March 15, 2025 • 7:00 PM</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">Sisters Chapel</span>
                  </div>
                </div>
                <Badge variant="default">Performance</Badge>
              </div>
              
              <div className="flex items-start space-x-4 p-3 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                  18
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Rehearsal</p>
                  <p className="text-sm text-gray-500">March 18, 2025 • 6:00 PM</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">Music Building</span>
                  </div>
                </div>
                <Badge variant="secondary">Practice</Badge>
              </div>
              
              <div className="flex items-start space-x-4 p-3 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  22
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Alumni Event</p>
                  <p className="text-sm text-gray-500">March 22, 2025 • 2:00 PM</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">Student Center</span>
                  </div>
                </div>
                <Badge variant="outline">Social</Badge>
              </div>
            </div>
            
            <Button variant="ghost" className="w-full mt-4">
              View All Events
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest updates and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New sheet music uploaded</p>
                  <p className="text-xs text-muted-foreground">Amazing Grace - Arranged for SATB</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Music className="h-4 w-4 text-blue-600" />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Attendance marked</p>
                  <p className="text-xs text-muted-foreground">Tuesday Rehearsal - Present</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <Users className="h-4 w-4 text-green-600" />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Practice session logged</p>
                  <p className="text-xs text-muted-foreground">45 minutes - Voice exercises</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Dues payment received</p>
                  <p className="text-xs text-muted-foreground">Spring 2025 semester dues</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* E-commerce Section - Only show if user has access */}
      <EcommerceSection profile={profile} />

      {/* Member Spotlight */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Glee Club Spotlight
          </CardTitle>
          <CardDescription>
            Celebrating our amazing community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                SG
              </div>
              <div>
                <h4 className="font-semibold">Member of the Month</h4>
                <p className="text-sm text-muted-foreground">Recognizing outstanding dedication</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 italic">
              "Congratulations to all our members for their continued dedication to excellence in choral music. 
              Your commitment to our mission 'To Amaze and Inspire' makes the Spelman Glee Club extraordinary!"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
