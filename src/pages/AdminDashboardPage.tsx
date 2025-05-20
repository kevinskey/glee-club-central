
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
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
  BookOpen,
  Search,
  Check,
  Filter,
  Download,
  Upload,
  Edit,
  CheckCircle,
  XCircle
} from "lucide-react";

// Import components
import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { EventTimeline } from "@/components/admin/EventTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User } from "@/hooks/useUserManagement";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs as VerticalTabs } from "@/components/dashboard/vertical-tabs";

// Sample data for demonstration (since we're updating the existing component)
const sampleMembers = [
  {
    id: "1",
    first_name: "Tanya",
    last_name: "Williams",
    role: "Singer",
    voice_part: "alto_2",
    dues_paid: true,
    avatar_url: "",
    status: "active",
    created_at: new Date().toISOString(),
    class_year: "2026",
    attendance_rate: 95
  },
  {
    id: "2",
    first_name: "James",
    last_name: "Johnson",
    role: "Singer",
    voice_part: "tenor",
    dues_paid: false,
    avatar_url: "",
    status: "active",
    created_at: new Date().toISOString(),
    class_year: "2025",
    attendance_rate: 82
  },
  {
    id: "3",
    first_name: "Sophia",
    last_name: "Martinez",
    role: "Section Leader",
    voice_part: "soprano_1",
    dues_paid: true,
    avatar_url: "",
    status: "active",
    created_at: new Date().toISOString(),
    class_year: "2024",
    attendance_rate: 100
  },
  {
    id: "4",
    first_name: "Marcus",
    last_name: "Brown",
    role: "Student Conductor",
    voice_part: "bass",
    dues_paid: true,
    avatar_url: "",
    status: "active",
    created_at: new Date().toISOString(),
    class_year: "2023",
    attendance_rate: 91
  },
  {
    id: "5",
    first_name: "Olivia",
    last_name: "Garcia",
    role: "Singer",
    voice_part: "soprano_2",
    dues_paid: false,
    avatar_url: "",
    status: "active",
    created_at: new Date().toISOString(),
    class_year: "2026",
    attendance_rate: 78
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

const sheetMusicItems = [
  { id: "sm1", title: "Ave Maria", composer: "Franz Biebl", voicing: "SSAA", uploaded_at: "2025-05-01", assigned: 42 },
  { id: "sm2", title: "Lift Every Voice and Sing", composer: "J. Rosamond Johnson", voicing: "SSAA", uploaded_at: "2025-04-15", assigned: 39 },
  { id: "sm3", title: "Wade in the Water", composer: "Traditional", voicing: "SSAA", uploaded_at: "2025-03-22", assigned: 40 }
];

const attendanceStats = {
  excellent: 65, // percentage of members with >90% attendance
  good: 20, // percentage of members with 75-90% attendance
  concerning: 15, // percentage of members with <75% attendance
  overall: 87, // overall attendance percentage
  lastWeek: [
    { day: 'Mon', count: 35, total: 42 },
    { day: 'Wed', count: 38, total: 42 },
    { day: 'Fri', count: 40, total: 42 }
  ]
};

const duesStats = {
  paid: 32,
  unpaid: 10,
  total: 42,
  percentagePaid: 76
};

export default function AdminDashboardPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const [activeMembers, setActiveMembers] = useState(42);
  const [upcomingEvents, setUpcomingEvents] = useState(3);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVerticalTab, setSelectedVerticalTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
      <PageHeader
        title="Glee Command Center"
        description="Comprehensive management for the Spelman College Glee Club"
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
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Member Management</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid gap-4 md:grid-cols-4">
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
              value={`${duesStats.percentagePaid}%`}
              description={`${duesStats.paid}/${duesStats.total} members paid`}
              icon={<CreditCard className="h-5 w-5" />}
            />
            <AnalyticsCard 
              title="Attendance" 
              value={`${attendanceStats.overall}%`}
              description="Last week average"
              icon={<CheckCircle className="h-5 w-5" />}
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
          
          {/* Recent Member Activity */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Member Activity</CardTitle>
                  <CardDescription>Latest updates from Glee Club members</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("members")}>
                  View All Members
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Voice Part</TableHead>
                        <TableHead>Dues</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleMembers.slice(0, 4).map(member => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{member.first_name.charAt(0)}{member.last_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{member.first_name} {member.last_name}</p>
                                <p className="text-xs text-muted-foreground">{member.class_year}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {member.voice_part.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {member.dues_paid ? 
                              <Badge variant="success" className="text-xs">Paid</Badge> : 
                              <Badge variant="destructive" className="text-xs">Unpaid</Badge>
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={member.attendance_rate} className="h-2 w-16" />
                              <span className="text-xs">{member.attendance_rate}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/admin/members/${member.id}`)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Access Modules */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate('/dashboard/sheet-music')}>
              <CardHeader className="p-4">
                <Music className="h-8 w-8 text-glee-spelman mb-2" />
                <CardTitle className="text-base">Sheet Music</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">Manage and distribute music</p>
              </CardContent>
            </Card>
            
            <Card className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate('/dashboard/calendar')}>
              <CardHeader className="p-4">
                <Calendar className="h-8 w-8 text-glee-spelman mb-2" />
                <CardTitle className="text-base">Calendar</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">Schedule rehearsals & events</p>
              </CardContent>
            </Card>
            
            <Card className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate('/dashboard/wardrobe')}>
              <CardHeader className="p-4">
                <Shirt className="h-8 w-8 text-glee-spelman mb-2" />
                <CardTitle className="text-base">Wardrobe</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">Manage uniforms & attire</p>
              </CardContent>
            </Card>
            
            <Card className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate('/dashboard/messaging')}>
              <CardHeader className="p-4">
                <Mail className="h-8 w-8 text-glee-spelman mb-2" />
                <CardTitle className="text-base">Messaging</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">Send announcements & emails</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Member Management Tab */}
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Member Roster</CardTitle>
                  <CardDescription>Manage all Glee Club members</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search members..." 
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="secondary" onClick={() => navigate('/dashboard/admin/members')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Member
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Vertical tabs for filtering */}
                <div className="md:w-1/5 space-y-1">
                  <VerticalTabs 
                    tabs={[
                      { id: 'all', label: 'All Members', count: 42 },
                      { id: 'soprano', label: 'Soprano', count: 14 },
                      { id: 'alto', label: 'Alto', count: 14 },
                      { id: 'tenor', label: 'Tenor', count: 7 },
                      { id: 'bass', label: 'Bass', count: 7 },
                      { id: 'section_leaders', label: 'Section Leaders', count: 4 },
                      { id: 'unpaid_dues', label: 'Unpaid Dues', count: 10 },
                    ]}
                    activeTab={selectedVerticalTab}
                    onChange={setSelectedVerticalTab}
                  />
                  
                  <div className="pt-4 mt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Filter className="mr-2 h-4 w-4" />
                      Advanced Filters
                    </Button>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Export to CSV
                    </Button>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Members
                    </Button>
                  </div>
                </div>
                
                {/* Member table */}
                <div className="md:w-4/5 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox />
                        </TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Voice Part</TableHead>
                        <TableHead>Class Year</TableHead>
                        <TableHead>Dues</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleMembers.map(member => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{member.first_name.charAt(0)}{member.last_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{member.first_name} {member.last_name}</p>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {member.voice_part.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.class_year}</TableCell>
                          <TableCell>
                            {member.dues_paid ? 
                              <Badge variant="success" className="text-xs">Paid</Badge> : 
                              <Badge variant="destructive" className="text-xs">Unpaid</Badge>
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={member.attendance_rate} className="h-2 w-16" />
                              <span className="text-xs">{member.attendance_rate}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/admin/members/${member.id}`)}>
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing 5 of 42 members
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Analytics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Voice Part Distribution</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>Soprano 1</span>
                          <span>7 members</span>
                        </div>
                        <Progress value={7/42*100} className="h-2" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>Soprano 2</span>
                          <span>7 members</span>
                        </div>
                        <Progress value={7/42*100} className="h-2" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>Alto 1</span>
                          <span>7 members</span>
                        </div>
                        <Progress value={7/42*100} className="h-2" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>Alto 2</span>
                          <span>7 members</span>
                        </div>
                        <Progress value={7/42*100} className="h-2" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>Tenor</span>
                          <span>7 members</span>
                        </div>
                        <Progress value={7/42*100} className="h-2" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>Bass</span>
                          <span>7 members</span>
                        </div>
                        <Progress value={7/42*100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Class Year Distribution</h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>2023</span>
                          <span>6</span>
                        </div>
                        <Progress value={6/42*100} className="h-2" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>2024</span>
                          <span>8</span>
                        </div>
                        <Progress value={8/42*100} className="h-2" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>2025</span>
                          <span>12</span>
                        </div>
                        <Progress value={12/42*100} className="h-2" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>2026</span>
                          <span>16</span>
                        </div>
                        <Progress value={16/42*100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Bulk Actions</CardTitle>
                <CardDescription>Perform actions on multiple members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Send Email</SelectItem>
                      <SelectItem value="mark_paid">Mark Dues as Paid</SelectItem>
                      <SelectItem value="assign_music">Assign Sheet Music</SelectItem>
                      <SelectItem value="export_data">Export Member Data</SelectItem>
                      <SelectItem value="change_status">Change Status</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium text-sm mb-2">Quick Assignment</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="assign-all" />
                        <label htmlFor="assign-all" className="text-sm">Assign to All Active Members</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="assign-soprano" />
                        <label htmlFor="assign-soprano" className="text-sm">Soprano Section Only</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="assign-alto" />
                        <label htmlFor="assign-alto" className="text-sm">Alto Section Only</label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Apply to Selected Members</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sheet Music Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-glee-spelman" />
                    <span>Sheet Music</span>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Music
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto">
                <div className="space-y-3">
                  {sheetMusicItems.map(item => (
                    <div key={item.id} className="border rounded-md p-3 hover:bg-muted/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.composer}</p>
                        </div>
                        <Badge variant="outline">{item.voicing}</Badge>
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-xs text-muted-foreground">Assigned: {item.assigned} members</p>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-3">
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/dashboard/sheet-music')}>
                  Manage Sheet Music
                </Button>
              </CardFooter>
            </Card>
            
            {/* Practice Audio Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-glee-spelman" />
                    <span>Practice Audio</span>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Recording
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border rounded-md p-3 hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">Ave Maria - Soprano 1</h4>
                        <p className="text-xs text-muted-foreground">3:24 • 4.2MB</p>
                      </div>
                      <Badge>S1</Badge>
                    </div>
                  </div>
                  <div className="border rounded-md p-3 hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">Ave Maria - Soprano 2</h4>
                        <p className="text-xs text-muted-foreground">3:24 • 4.1MB</p>
                      </div>
                      <Badge>S2</Badge>
                    </div>
                  </div>
                  <div className="border rounded-md p-3 hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">Ave Maria - Alto 1</h4>
                        <p className="text-xs text-muted-foreground">3:24 • 4.0MB</p>
                      </div>
                      <Badge>A1</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-3">
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/dashboard/recordings')}>
                  Manage Recordings
                </Button>
              </CardFooter>
            </Card>
            
            {/* Handbook Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-glee-spelman" />
                    <span>Handbook</span>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border rounded-md p-3 hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-sm">Glee Club Handbook 2025</h4>
                        <p className="text-xs text-muted-foreground">PDF • 2.4MB • Last updated May 1, 2025</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-1">Handbook Sections:</h4>
                    <ul className="text-xs space-y-1 list-disc pl-4">
                      <li>Welcome & Introduction</li>
                      <li>Attendance Policy</li>
                      <li>Wardrobe Requirements</li>
                      <li>Travel Guidelines</li>
                      <li>Performance Etiquette</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-3">
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/dashboard/handbook')}>
                  Manage Handbook
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Announcements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>Manage communications to members and fans</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-medium">Spring Concert Announcement</p>
                        <p className="text-xs text-muted-foreground">Performance details and ticket information</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Published</Badge>
                    </TableCell>
                    <TableCell>May 1, 2025</TableCell>
                    <TableCell>Public, Members</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-medium">Dues Reminder</p>
                        <p className="text-xs text-muted-foreground">Reminder about upcoming dues deadline</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Published</Badge>
                    </TableCell>
                    <TableCell>Apr 15, 2025</TableCell>
                    <TableCell>Members Only</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-medium">Extra Rehearsal Notice</p>
                        <p className="text-xs text-muted-foreground">Added rehearsal before concert</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Draft</Badge>
                    </TableCell>
                    <TableCell>Not published</TableCell>
                    <TableCell>Members Only</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Media Manager */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Media Manager</CardTitle>
                  <CardDescription>Manage photos, videos, and other media</CardDescription>
                </div>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Upload Media
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="photos">
                <TabsList className="mb-4">
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>
                
                <TabsContent value="photos">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="aspect-square bg-muted rounded overflow-hidden relative group">
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-square bg-muted rounded overflow-hidden relative group">
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-square bg-muted rounded overflow-hidden relative group">
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-square bg-muted rounded overflow-hidden relative group">
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="videos">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video bg-muted rounded overflow-hidden relative group">
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Video className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-sm font-medium text-white">Spring Concert 2025</p>
                      </div>
                    </div>
                    <div className="aspect-video bg-muted rounded overflow-hidden relative group">
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Video className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-sm font-medium text-white">Holiday Concert 2024</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="files">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Tour_Schedule_2025.pdf</p>
                          <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Member_Roster.xlsx</p>
                          <p className="text-xs text-muted-foreground">Excel • 0.8 MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard/media')}>
                Open Media Library
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
                <CardDescription>Overall attendance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{attendanceStats.overall}%</div>
                    <p className="text-sm text-muted-foreground">Average Attendance</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Excellent (>90%)</span>
                      <span className="text-sm font-medium">{attendanceStats.excellent}%</span>
                    </div>
                    <Progress value={attendanceStats.excellent} className="h-2" />
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">Good (75-90%)</span>
                      <span className="text-sm font-medium">{attendanceStats.good}%</span>
                    </div>
                    <Progress value={attendanceStats.good} className="h-2" />
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">Concerning (<75%)</span>
                      <span className="text-sm font-medium">{attendanceStats.concerning}%</span>
                    </div>
                    <Progress value={attendanceStats.concerning} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Last Week's Attendance</CardTitle>
                <CardDescription>Attendance records for recent rehearsals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceStats.lastWeek.map((day, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{day.day} Rehearsal</p>
                          <p className="text-sm text-muted-foreground">
                            {day.count}/{day.total} members present
                          </p>
                        </div>
                        <Badge variant="outline">{Math.round(day.count/day.total*100)}%</Badge>
                      </div>
                      <Progress value={day.count/day.total*100} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-3">
                <Button variant="outline" size="sm" className="w-full">
                  View Full Attendance Records
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Take Attendance</CardTitle>
                <CardDescription>Mark attendance for today's rehearsal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-muted/30">
                    <h4 className="font-medium text-sm mb-2">Today's Rehearsal</h4>
                    <p className="text-sm">Monday, May 5, 2025</p>
                    <p className="text-sm">6:00 PM - 8:00 PM</p>
                    <p className="text-sm">Sisters Chapel</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="attend-1" />
                        <label htmlFor="attend-1" className="text-sm">Tanya Williams</label>
                      </div>
                      <Badge variant="outline">A2</Badge>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="attend-2" />
                        <label htmlFor="attend-2" className="text-sm">James Johnson</label>
                      </div>
                      <Badge variant="outline">T</Badge>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="attend-3" />
                        <label htmlFor="attend-3" className="text-sm">Sophia Martinez</label>
                      </div>
                      <Badge variant="outline">S1</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Check className="mr-2 h-4 w-4" />
                    Submit Attendance
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Showing 3 of 42 members. Use search to filter the list.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Attendance Records</CardTitle>
                  <CardDescription>Detailed attendance history for all members</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="may-25">May 2025</SelectItem>
                      <SelectItem value="apr-25">April 2025</SelectItem>
                      <SelectItem value="mar-25">March 2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="secondary">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Member</TableHead>
                        <TableHead className="text-center">Mon, May 1</TableHead>
                        <TableHead className="text-center">Wed, May 3</TableHead>
                        <TableHead className="text-center">Fri, May 5</TableHead>
                        <TableHead className="text-center">Mon, May 8</TableHead>
                        <TableHead className="text-center">Wed, May 10</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback>{member.first_name.charAt(0)}{member.last_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{member.first_name} {member.last_name}</p>
                                <p className="text-xs text-muted-foreground">{member.voice_part.replace('_', ' ').toUpperCase()}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          </TableCell>
                          <TableCell className="text-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          </TableCell>
                          <TableCell className="text-center">
                            {member.attendance_rate > 90 ? 
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : 
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            }
                          </TableCell>
                          <TableCell className="text-center">
                            {member.attendance_rate > 80 ? 
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : 
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            }
                          </TableCell>
                          <TableCell className="text-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={member.attendance_rate > 90 ? "success" : (member.attendance_rate > 75 ? "outline" : "destructive")}>
                              {member.attendance_rate}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing 5 of 42 members
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Finances Tab */}
        <TabsContent value="finances" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dues Collection</CardTitle>
                <CardDescription>Summary of member dues payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold">${duesStats.paid * 50}</div>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">{duesStats.paid} paid</span>
                    <span className="text-sm">{duesStats.unpaid} unpaid</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${duesStats.percentagePaid}%` }} 
                    />
                  </div>
                  <div className="text-center mt-1">
                    <p className="text-xs text-muted-foreground">
                      {duesStats.percentagePaid}% collected ({duesStats.paid}/{duesStats.total})
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="text-sm font-medium">Unpaid Members</h4>
                  <div className="space-y-1">
                    {sampleMembers.filter(m => !m.dues_paid).map(member => (
                      <div key={member.id} className="flex justify-between items-center">
                        <span className="text-sm">{member.first_name} {member.last_name}</span>
                        <Badge variant="destructive">Unpaid</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-3">
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Dues Reminder
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Tracker</CardTitle>
                <CardDescription>Recent payment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">Sophia Martinez</h4>
                        <p className="text-xs text-muted-foreground">Dues payment • May 1, 2025</p>
                      </div>
                      <p className="font-medium">$50.00</p>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <Badge variant="outline">Cash</Badge>
                      <Badge variant="success">Complete</Badge>
                    </div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">Marcus Brown</h4>
                        <p className="text-xs text-muted-foreground">Dues payment • April 29, 2025</p>
                      </div>
                      <p className="font-medium">$50.00</p>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <Badge variant="outline">Venmo</Badge>
                      <Badge variant="success">Complete</Badge>
                    </div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">Tanya Williams</h4>
                        <p className="text-xs text-muted-foreground">Dues payment • April 28, 2025</p>
                      </div>
                      <p className="font-medium">$50.00</p>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <Badge variant="outline">Cash App</Badge>
                      <Badge variant="success">Complete</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-3">
                <Button variant="outline" className="w-full">
                  View All Payments
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Record Payment</CardTitle>
                <CardDescription>Add a new payment record</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="member" className="text-sm font-medium">Select Member</label>
                    <Select>
                      <SelectTrigger id="member">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleMembers.filter(m => !m.dues_paid).map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.first_name} {member.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                        $
                      </span>
                      <Input id="amount" placeholder="50.00" className="rounded-l-none" defaultValue="50.00" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="payment-method" className="text-sm font-medium">Payment Method</label>
                    <Select defaultValue="cash">
                      <SelectTrigger id="payment-method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="venmo">Venmo</SelectItem>
                        <SelectItem value="cashapp">Cash App</SelectItem>
                        <SelectItem value="zelle">Zelle</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="payment-for" className="text-sm font-medium">Payment For</label>
                    <Select defaultValue="dues">
                      <SelectTrigger id="payment-for">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dues">Semester Dues</SelectItem>
                        <SelectItem value="tour">Tour Fees</SelectItem>
                        <SelectItem value="uniform">Uniform Fee</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">
                    Record Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Budget Tracker</CardTitle>
                  <CardDescription>Track income, expenses, and budget</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="expenses">
                <TabsList>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                </TabsList>
                <TabsContent value="expenses" className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Sheet Music Purchase</TableCell>
                        <TableCell>
                          <Badge variant="outline">Supplies</Badge>
                        </TableCell>
                        <TableCell>May 1, 2025</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Performance Venue Rental</TableCell>
                        <TableCell>
                          <Badge variant="outline">Events</Badge>
                        </TableCell>
                        <TableCell>April 28, 2025</TableCell>
                        <TableCell className="text-right">$500.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tour Transportation</TableCell>
                        <TableCell>
                          <Badge variant="outline">Travel</Badge>
                        </TableCell>
                        <TableCell>April 15, 2025</TableCell>
                        <TableCell className="text-right">$1,200.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="income" className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Member Dues (42 members)</TableCell>
                        <TableCell>
                          <Badge variant="outline">Dues</Badge>
                        </TableCell>
                        <TableCell>April-May 2025</TableCell>
                        <TableCell className="text-right">$2,100.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Concert Ticket Sales</TableCell>
                        <TableCell>
                          <Badge variant="outline">Events</Badge>
                        </TableCell>
                        <TableCell>April 30, 2025</TableCell>
                        <TableCell className="text-right">$1,750.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Alumni Donations</TableCell>
                        <TableCell>
                          <Badge variant="outline">Donations</Badge>
                        </TableCell>
                        <TableCell>April 15, 2025</TableCell>
                        <TableCell className="text-right">$850.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="budget" className="pt-4">
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="mb-4 flex justify-between">
                        <div>
                          <h3 className="font-medium">Budget Summary</h3>
                          <p className="text-sm text-muted-foreground">Academic Year 2024-2025</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-muted-foreground text-sm">Total Income</p>
                              <p className="text-2xl font-bold text-green-600">$4,700.00</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-muted-foreground text-sm">Total Expenses</p>
                              <p className="text-2xl font-bold text-red-600">$1,950.00</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-muted-foreground text-sm">Balance</p>
                              <p className="text-2xl font-bold">$2,750.00</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-4">Budget Allocation</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Travel & Tours</span>
                            <span>40%</span>
                          </div>
                          <Progress value={40} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Music & Equipment</span>
                            <span>25%</span>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Events & Venues</span>
                            <span>20%</span>
                          </div>
                          <Progress value={20} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Wardrobe & Costumes</span>
                            <span>10%</span>
                          </div>
                          <Progress value={10} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Miscellaneous</span>
                            <span>5%</span>
                          </div>
                          <Progress value={5} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
