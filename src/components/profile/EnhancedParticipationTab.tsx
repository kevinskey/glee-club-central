
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Trophy, Star, CheckCircle, AlertCircle } from "lucide-react";

interface EnhancedParticipationTabProps {
  profile: any;
}

export const EnhancedParticipationTab: React.FC<EnhancedParticipationTabProps> = ({ profile }) => {
  const attendanceData = {
    rehearsal: 95,
    concerts: 100,
    events: 12,
    streak: 8
  };

  const recentActivities = [
    {
      id: 1,
      type: 'rehearsal',
      title: 'Spring Concert Rehearsal',
      date: 'March 15, 2024',
      status: 'present',
      points: 10
    },
    {
      id: 2,
      type: 'sectional',
      title: 'Sectional Practice - Alto',
      date: 'March 12, 2024',
      status: 'present',
      points: 5
    },
    {
      id: 3,
      type: 'concert',
      title: 'Community Outreach Performance',
      date: 'March 10, 2024',
      status: 'present',
      points: 20
    },
    {
      id: 4,
      type: 'rehearsal',
      title: 'Weekly Rehearsal',
      date: 'March 8, 2024',
      status: 'excused',
      points: 0
    }
  ];

  const achievements = [
    { id: 1, title: 'Perfect Attendance', description: 'No absences this semester', icon: Trophy, color: 'text-yellow-500' },
    { id: 2, title: 'Team Player', description: 'Helped 5+ members', icon: Users, color: 'text-blue-500' },
    { id: 3, title: 'Rising Star', description: 'Improved performance rating', icon: Star, color: 'text-purple-500' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'excused':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'absent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'excused':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'absent':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile: Single Column */}
      <div className="block sm:hidden space-y-4">
        {/* Quick Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{attendanceData.rehearsal}%</div>
                <div className="text-xs text-green-600">Rehearsals</div>
                <Progress value={attendanceData.rehearsal} className="mt-2 h-2" />
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{attendanceData.concerts}%</div>
                <div className="text-xs text-blue-600">Concerts</div>
                <Progress value={attendanceData.concerts} className="mt-2 h-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{attendanceData.events}</div>
                <div className="text-xs text-orange-600">Events This Semester</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{attendanceData.streak}</div>
                <div className="text-xs text-purple-600">Week Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <IconComponent className={`h-6 w-6 ${achievement.color}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">+{activity.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Desktop: Two Column Layout */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats and Achievements */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Attendance Summary
                </CardTitle>
                <CardDescription>
                  Your attendance record this semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Rehearsal Attendance</span>
                      <span className="font-medium">{attendanceData.rehearsal}%</span>
                    </div>
                    <Progress value={attendanceData.rehearsal} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Concert Attendance</span>
                      <span className="font-medium">{attendanceData.concerts}%</span>
                    </div>
                    <Progress value={attendanceData.concerts} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-xl font-bold text-orange-600">{attendanceData.events}</div>
                      <div className="text-xs text-orange-600">Events</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">{attendanceData.streak}</div>
                      <div className="text-xs text-purple-600">Week Streak</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Your recent accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <IconComponent className={`h-5 w-5 ${achievement.color}`} />
                        <div>
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your recent participation in Glee Club activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(activity.status)}
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">+{activity.points} points</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Roles & Responsibilities
                </CardTitle>
                <CardDescription>
                  Your current roles within the Glee Club
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">{profile?.voice_part || 'Not assigned'}</Badge>
                  {profile?.role && profile.role !== 'member' && (
                    <Badge variant="secondary">{profile.role}</Badge>
                  )}
                  <Badge variant="outline">Active Member</Badge>
                  <Badge variant="outline">Semester 2024</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
