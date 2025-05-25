import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Calendar, Music, Bell, User, BookOpen, Headphones, Shirt, FileCheck, 
  Edit, Download, FileText, Upload, Award, MapPin, Vote
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NextEventCountdown } from '@/components/dashboard/NextEventCountdown';
import { UpcomingEventsList } from '@/components/calendar/UpcomingEventsList';
import { Button } from '@/components/ui/button';
import { QuickAccess, QuickAccessItem } from '@/components/dashboard/QuickAccess';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { AbsenceRequestForm } from '@/components/attendance/AbsenceRequestForm';
import { MemberPolls } from '@/components/polls/MemberPolls';
import { MemberUploadPortal } from '@/components/uploads/MemberUploadPortal';
import { ActiveTourInfo } from '@/components/tours/ActiveTourInfo';

export default function MemberDashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock next event for countdown
  const nextEvent = {
    id: "next-event",
    title: "Upcoming Performance",
    date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    time: "7:00 PM",
    location: "Sisters Chapel"
  };

  // Mock upcoming events for absence requests
  const upcomingEvents = [
    {
      id: "event-1",
      title: "Weekly Rehearsal",
      date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      time: "6:00 PM",
      location: "Music Hall"
    },
    {
      id: "event-2", 
      title: "Special Performance",
      date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      time: "7:30 PM",
      location: "Sisters Chapel"
    }
  ];
  
  // Quick access items for members
  const memberItems: QuickAccessItem[] = [
    {
      title: "Sheet Music",
      description: "Access sheet music with enhanced PDF viewer",
      icon: <Music className="h-4 w-4 mr-2 text-white" />,
      link: "/dashboard/sheet-music",
    },
    {
      title: "Calendar",
      description: "View upcoming events and rehearsals",
      icon: <Calendar className="h-4 w-4 mr-2 text-white" />,
      link: "/dashboard/calendar",
    },
    {
      title: "Recordings",
      description: "Listen to and upload practice tracks",
      icon: <Headphones className="h-4 w-4 mr-2 text-white" />,
      link: "/dashboard/recordings",
    },
    {
      title: "Upload Files",
      description: "Submit auditions, forms, and surveys",
      icon: <Upload className="h-4 w-4 mr-2 text-white" />,
      link: "#uploads",
      onClick: () => setActiveTab("uploads")
    },
    {
      title: "Vote & Feedback",
      description: "Participate in polls and provide feedback",
      icon: <Vote className="h-4 w-4 mr-2 text-white" />,
      link: "#polls",
      onClick: () => setActiveTab("polls")
    },
    {
      title: "Profile",
      description: "Update your personal information",
      icon: <User className="h-4 w-4 mr-2 text-white" />,
      link: "/dashboard/profile",
    }
  ];
  
  // Member info with attendance status
  const attendanceData = {
    total: 24,
    attended: 21,
    percentage: 87.5
  };
  
  // Member achievements
  const achievements = [
    { name: "Centennial Singer", earned: true },
    { name: "Tour Member", earned: true },
    { name: "Perfect Attendance", earned: false },
    { name: "Section Leader", earned: false }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome to Your Glee Club Cockpit, ${profile?.first_name || 'Member'}`}
        description="Manage all aspects of your Spelman College Glee Club membership"
      />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-8 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="music">Musical Role</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="polls">Polls</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <QuickAccess items={memberItems} />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            {/* Main Content - Left 2/3 */}
            <div className="md:col-span-8 space-y-6">
              {/* Next Rehearsal Countdown */}
              <NextEventCountdown event={nextEvent} />
              
              {/* Active Tour Information */}
              <ActiveTourInfo />
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                      <CardTitle>Upcoming Events</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/dashboard/calendar')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <UpcomingEventsList limit={4} />
                </CardContent>
              </Card>

              {/* Absence Request Form */}
              <AbsenceRequestForm events={upcomingEvents} />
            </div>
            
            {/* Sidebar - Right 1/3 */}
            <div className="md:col-span-4 space-y-6">
              {/* Member Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Member Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dues Status:</span>
                    <Badge variant={profile?.dues_paid ? "default" : "destructive"}>
                      {profile?.dues_paid ? "Paid" : "Unpaid"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Voice Part:</span>
                    <Badge variant="outline">{profile?.voice_part || "Not Assigned"}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Attendance:</span>
                      <span className="text-sm">{attendanceData.percentage}%</span>
                    </div>
                    <Progress value={attendanceData.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">
                      {attendanceData.attended}/{attendanceData.total} events attended
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Links Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-left justify-start" 
                    onClick={() => navigate("/dashboard/sheet-music")}
                  >
                    <Music className="mr-2 h-4 w-4" />
                    Enhanced Sheet Music Viewer
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-left justify-start" 
                    onClick={() => navigate("/dashboard/recordings")}
                  >
                    <Headphones className="mr-2 h-4 w-4" />
                    Practice Recordings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-left justify-start" 
                    onClick={() => setActiveTab("uploads")}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Portal
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-left justify-start" 
                    onClick={() => window.open("https://drive.google.com/drive", "_blank", "noopener,noreferrer")}
                  >
                    <FileCheck className="mr-2 h-4 w-4" />
                    Member Handbook
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Identity Tab */}
        <TabsContent value="identity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your identity and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || "Member"} />
                    <AvatarFallback>{profile?.first_name?.charAt(0) || "M"}{profile?.last_name?.charAt(0) || ""}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{profile?.first_name} {profile?.last_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {profile?.voice_part || "Voice Part Not Assigned"}
                    </p>
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate('/dashboard/profile')}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Spelman Email</h4>
                      <p className="text-sm text-muted-foreground">semail@spelman.edu</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Personal Email</h4>
                      <p className="text-sm text-muted-foreground">{profile?.email || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium">Phone Number</h4>
                      <p className="text-sm text-muted-foreground">{profile?.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Birthday</h4>
                      <p className="text-sm text-muted-foreground">Not provided</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium">Emergency Contact</h4>
                    <p className="text-sm text-muted-foreground">Not provided</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      <Edit className="mr-2 h-4 w-4" />
                      Add Emergency Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>Who to contact in case of emergency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Primary Contact</h4>
                  <p className="text-sm">Not provided</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium">Relationship</h4>
                      <p className="text-sm text-muted-foreground">Not provided</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Phone Number</h4>
                      <p className="text-sm text-muted-foreground">Not provided</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Physical Address</h4>
                  <p className="text-sm text-muted-foreground">Not provided</p>
                </div>
                
                <Button variant="secondary" size="sm" className="mt-4">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Emergency Information
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Academic Tab */}
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Your academic standing and program details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium">Class Year</h4>
                  <p className="text-lg">{profile?.class_year || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Major</h4>
                  <p className="text-lg">Not specified</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Minor</h4>
                  <p className="text-lg">Not specified</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Study Abroad Status</h4>
                  <Badge variant="outline">Not Applicable</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  No study abroad applications on file.
                </p>
              </div>
              
              <Button size="sm" variant="secondary" className="mt-4">
                <Edit className="mr-2 h-4 w-4" />
                Update Academic Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Musical Role Tab */}
        <TabsContent value="music">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Musical Role</CardTitle>
                <CardDescription>Your voice part and ensemble assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Voice Part</h4>
                  <Badge>{profile?.voice_part || "Not Assigned"}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Section Leader</h4>
                  <Badge variant="outline">No</Badge>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Current Solo Assignments</h4>
                  <p className="text-sm text-muted-foreground">No current solo assignments</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Ensemble Assignments</h4>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2">Main Chorus</Badge>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Vocal Range</h4>
                  <p className="text-sm text-muted-foreground">Not recorded</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Audition Status</CardTitle>
                <CardDescription>Your audition history and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Current Status</h4>
                  <Badge className="bg-green-100 text-green-800">Active Member</Badge>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Initial Audition</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Date:</span>
                      <span className="text-sm">{profile?.join_date || "Not recorded"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Result:</span>
                      <span className="text-sm">Accepted</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Annual Review</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Last Review:</span>
                      <span className="text-sm">Not completed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Next Review:</span>
                      <span className="text-sm">August 2025</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Logistics Tab */}
        <TabsContent value="logistics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial & Material Status</CardTitle>
                <CardDescription>Dues, sheet music, and uniform information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Dues Status</h4>
                    <Badge variant={profile?.dues_paid ? "default" : "destructive"}>
                      {profile?.dues_paid ? "Paid in Full" : "Unpaid"}
                    </Badge>
                  </div>
                  {!profile?.dues_paid && (
                    <Button size="sm" variant="secondary" className="w-full">
                      Pay Dues Now
                    </Button>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Sheet Music Status</h4>
                    <Badge variant="outline">Complete</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">All sheet music received</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    <FileCheck className="mr-2 h-4 w-4" />
                    View Sheet Music Library
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Uniform Information</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Dress Size:</span>
                      <span className="text-sm">Not recorded</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Robe Number:</span>
                      <span className="text-sm">Not assigned</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Stole:</span>
                      <span className="text-sm">Not assigned</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2">
                    <Shirt className="mr-2 h-4 w-4" />
                    Update Sizes
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance & Forms</CardTitle>
                <CardDescription>Your attendance record and required forms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Attendance Summary</h4>
                    <Badge variant="outline">{attendanceData.percentage}%</Badge>
                  </div>
                  <Progress value={attendanceData.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-center">
                    {attendanceData.attended}/{attendanceData.total} events attended
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    Submit Absence Request
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Required Forms</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Travel Release Form</span>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Media Release Form</span>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Health Information</span>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" className="w-full mt-2" onClick={() => setActiveTab("uploads")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Additional Forms
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Media Tab */}
        <TabsContent value="media">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Media</CardTitle>
                <CardDescription>Profile photos and media content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-32 h-32 mb-4">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || "Member"} />
                      <AvatarFallback>{profile?.first_name?.charAt(0) || "M"}{profile?.last_name?.charAt(0) || ""}</AvatarFallback>
                    </Avatar>
                    <Button size="sm" variant="secondary">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Headshot
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Media Release Status</h4>
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      You have approved the Glee Club to use your image and recordings in promotional materials.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Glee Club Achievements</CardTitle>
                <CardDescription>Your recognitions and accomplishments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, i) => (
                    <Card key={i} className={`p-4 ${achievement.earned ? 'bg-muted/50' : 'bg-muted/20'}`}>
                      <div className="flex items-center space-x-2">
                        <Award className={`h-5 w-5 ${achievement.earned ? 'text-amber-500' : 'text-gray-400'}`} />
                        <div>
                          <p className="text-sm font-medium">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {achievement.earned ? 'Earned' : 'Not yet earned'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Button size="sm" variant="outline" className="w-full mt-2">
                  <Download className="mr-2 h-4 w-4" />
                  Download Digital ID Badge
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* New Uploads Tab */}
        <TabsContent value="uploads">
          <MemberUploadPortal />
        </TabsContent>

        {/* New Polls Tab */}
        <TabsContent value="polls">
          <MemberPolls />
        </TabsContent>
      </Tabs>
    </div>
  );
}
