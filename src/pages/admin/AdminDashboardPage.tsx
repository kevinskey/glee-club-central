import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { PageHeaderWithToggle } from "@/components/ui/page-header-with-toggle";
import {
  BarChart3,
  Calendar,
  CreditCard,
  Settings,
  Users,
  Shirt,
  Music,
  Bell,
  Plus,
  Headphones,
  Mail,
  FileText,
  BookOpen
} from "lucide-react";

// Import components
import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { AdminMembersList } from "@/components/admin/AdminMembersList";
import { EventTimeline } from "@/components/admin/EventTimeline";
import { QuickActions } from "@/components/admin/QuickActions";
import { HeroImagesManager } from "@/components/admin/HeroImagesManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Sample data for demonstration
const sampleMembers = [
  {
    id: "1",
    name: "Tanya Williams",
    role: "Singer",
    voicePart: "Alto 2",
    duesPaid: true,
    avatarUrl: ""
  },
  {
    id: "2",
    name: "James Johnson",
    role: "Singer",
    voicePart: "Tenor",
    duesPaid: false,
    avatarUrl: ""
  },
  {
    id: "3",
    name: "Sophia Martinez",
    role: "Section Leader",
    voicePart: "Soprano 1",
    duesPaid: true,
    avatarUrl: ""
  },
  {
    id: "4",
    name: "Marcus Brown",
    role: "Student Conductor",
    voicePart: "Bass",
    duesPaid: true,
    avatarUrl: ""
  },
  {
    id: "5",
    name: "Olivia Garcia",
    role: "Singer",
    voicePart: "Soprano 2",
    duesPaid: false,
    avatarUrl: ""
  }
];

const sampleEvents = [
  {
    id: "1",
    date: "May 15, 2025",
    title: "Spring Concert",
    type: "performance" as const,
    description: "Annual spring performance at Sisters Chapel"
  },
  {
    id: "2",
    date: "May 10, 2025",
    title: "Final Rehearsal",
    type: "rehearsal" as const,
    description: "Pre-concert dress rehearsal"
  },
  {
    id: "3",
    date: "June 5, 2025",
    title: "Alumni Event",
    type: "other" as const,
    description: "Special performance for alumni weekend"
  }
];

export default function AdminDashboardPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const [activeMembers, setActiveMembers] = useState(42);
  const [duesPercentage, setDuesPercentage] = useState(87);
  const [upcomingEvents, setUpcomingEvents] = useState(3);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  // Tasks to be completed
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finalize wardrobe for Spring Concert", status: "pending", due: "May 8, 2025" },
    { id: 2, title: "Upload sheet music for new repertoire", status: "completed", due: "April 29, 2025" },
    { id: 3, title: "Assign van coordinator for campus tour", status: "pending", due: "May 12, 2025" },
    { id: 4, title: "Send reminder about dues deadline", status: "pending", due: "April 30, 2025" }
  ]);
  
  // Redirect if user is not authenticated or not an admin
  if (!isLoading && (!isAuthenticated || !isAdmin())) {
    return <Navigate to="/dashboard" />;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeaderWithToggle
        title="Administrator Dashboard"
        description="Manage all aspects of the Glee Club"
        icon={<Settings className="h-6 w-6" />}
        actions={
          <Button 
            className="bg-glee-spelman hover:bg-glee-spelman/90 text-white"
            onClick={() => navigate("/dashboard/messaging")}
          >
            <Mail className="mr-2 h-4 w-4" /> Send Message
          </Button>
        }
      />
      
      {/* Admin Quick Actions Bar */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => navigate("/dashboard/admin/members")}
        >
          <Plus className="h-4 w-4" /> Member
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Event
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Announcement
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Music
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <AnalyticsCard 
              title="Active Members" 
              value={activeMembers} 
              change={4}
              description={`${activeMembers} total members`}
              icon={<Users className="h-5 w-5" />}
            />
            <AnalyticsCard 
              title="Upcoming Events" 
              value={upcomingEvents}
              description="Next: Spring Concert (May 15)"
              icon={<Calendar className="h-5 w-5" />}
            />
            <AnalyticsCard 
              title="Dues Collection" 
              value={`${duesPercentage}%`}
              description={`${Math.round(activeMembers * duesPercentage/100)}/${activeMembers} members paid`}
              icon={<CreditCard className="h-5 w-5" />}
            />
          </div>
          
          {/* Tasks and Timeline Section */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Admin Tasks */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Tasks</CardTitle>
                  <Button variant="ghost" size="sm" className="text-glee-spelman hover:text-glee-spelman/80">
                    <Plus className="h-4 w-4 mr-1" /> Add Task
                  </Button>
                </div>
                <CardDescription>Outstanding items that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-glee-spelman'}`}></div>
                        <div>
                          <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                          <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className={`${task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {task.status === 'completed' ? 'Done' : 'Mark Done'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <EventTimeline events={sampleEvents} />
          </div>
          
          {/* Quick Access Tools */}
          <div className="grid gap-4 md:grid-cols-12">
            {/* Sidebar-like quick shortcuts */}
            <div className="md:col-span-3 bg-muted/30 rounded-lg p-4 border">
              <h3 className="font-semibold text-sm mb-3 px-3">Administrative Tools</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate("/dashboard/admin/members")}>
                  <Users className="h-4 w-4 mr-2" /> Member Management
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate("/dashboard/admin/events")}>
                  <Calendar className="h-4 w-4 mr-2" /> Calendar Manager
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate("/dashboard/sheet-music")}>
                  <Music className="h-4 w-4 mr-2" /> Sheet Music
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate("/dashboard/wardrobe")}>
                  <Shirt className="h-4 w-4 mr-2" /> Wardrobe Manager
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate("/dashboard/messaging")}>
                  <Mail className="h-4 w-4 mr-2" /> Communications
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate("/dashboard/dues")}>
                  <CreditCard className="h-4 w-4 mr-2" /> Finance & Dues
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate("/dashboard/admin/settings")}>
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </Button>
              </div>
            </div>
            
            {/* Members and Activity Section */}
            <div className="md:col-span-9">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Member Overview</CardTitle>
                    <Button variant="outline" onClick={() => navigate("/dashboard/admin/users")}>View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AdminMembersList members={sampleMembers} />
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-glee-spelman/10 p-2 rounded">
                    <Users className="h-4 w-4 text-glee-spelman" />
                  </div>
                  <div>
                    <p className="font-medium">New member registered</p>
                    <p className="text-sm text-muted-foreground">Tanya Williams joined as Alto 2</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-glee-spelman/10 p-2 rounded">
                    <Music className="h-4 w-4 text-glee-spelman" />
                  </div>
                  <div>
                    <p className="font-medium">New sheet music uploaded</p>
                    <p className="text-sm text-muted-foreground">Ave Maria - Soprano 1 & 2 parts</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-glee-spelman/10 p-2 rounded">
                    <Calendar className="h-4 w-4 text-glee-spelman" />
                  </div>
                  <div>
                    <p className="font-medium">Event updated</p>
                    <p className="text-sm text-muted-foreground">Spring Concert time changed to 7:30 PM</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-glee-spelman/10 p-2 rounded">
                    <Bell className="h-4 w-4 text-glee-spelman" />
                  </div>
                  <div>
                    <p className="font-medium">Announcement sent</p>
                    <p className="text-sm text-muted-foreground">Reminder about dues payment deadline</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          {/* Content Management Section */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Sheet Music Management */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-glee-spelman" />
                  <span>Sheet Music</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Upload and manage sheet music for all voice parts.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/dashboard/sheet-music")}
                  >
                    Manage Sheet Music
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Practice Audio Management */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-glee-spelman" />
                  <span>Practice Audio</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Upload rehearsal tracks and section recordings.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/dashboard/recordings")}
                  >
                    Manage Audio Files
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Handbook Management */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-glee-spelman" />
                  <span>Handbook</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Update the club handbook, policies and guidelines.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/dashboard/handbook")}
                  >
                    Edit Handbook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Website Content Management */}
          <HeroImagesManager />
          
          {/* Announcement Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Create and manage announcements for members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-medium">End of Semester Performance</h3>
                    <p className="text-sm text-muted-foreground">Published: May 1, 2025</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive">Delete</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-medium">Dues Reminder</h3>
                    <p className="text-sm text-muted-foreground">Published: April 15, 2025</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive">Delete</Button>
                  </div>
                </div>
                <Button className="bg-glee-spelman hover:bg-glee-spelman/90 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Create New Announcement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure dashboard appearance and behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Site settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Permissions</CardTitle>
                <CardDescription>Manage role-based access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Permission settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
