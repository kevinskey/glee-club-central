
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Users, Music, Calendar, DollarSign, Settings, BarChart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickActions } from "@/components/admin/QuickActions";
import ErrorBoundary from "@/components/ErrorBoundary";

const AdminDashboardPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const adminModules = [
    {
      title: "Member Management",
      icon: <Users className="h-6 w-6" />,
      description: "Manage member accounts and permissions",
      link: "/admin/members",
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Sheet Music Library",
      icon: <Music className="h-6 w-6" />,
      description: "Add, remove, and organize music",
      link: "/admin/sheet-music",
      color: "from-purple-500 to-purple-700"
    },
    {
      title: "Calendar Management",
      icon: <Calendar className="h-6 w-6" />,
      description: "Schedule events and rehearsals",
      link: "/admin/calendar",
      color: "from-green-500 to-green-700"
    },
    {
      title: "Financial Records",
      icon: <DollarSign className="h-6 w-6" />,
      description: "Track dues and manage finances",
      link: "/admin/finances",
      color: "from-yellow-500 to-yellow-700"
    },
    {
      title: "Analytics",
      icon: <BarChart className="h-6 w-6" />,
      description: "View reports and statistics",
      link: "/admin/analytics",
      color: "from-pink-500 to-pink-700"
    },
    {
      title: "Settings",
      icon: <Settings className="h-6 w-6" />,
      description: "Configure system settings",
      link: "/admin/settings",
      color: "from-gray-500 to-gray-700"
    }
  ];

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <PageHeader
            title="Admin Dashboard"
            description={`Welcome, ${profile?.first_name || 'Administrator'} - Full administrative access`}
          />
          <div className="hidden md:flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-md">
            <Sparkles className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Admin Mode</span>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <QuickActions />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="py-2 border-b">
                      <div className="font-medium">New member registered</div>
                      <div className="text-sm text-muted-foreground">May 13, 2025 • 10:45 AM</div>
                    </li>
                    <li className="py-2 border-b">
                      <div className="font-medium">Sheet music uploaded</div>
                      <div className="text-sm text-muted-foreground">May 12, 2025 • 3:22 PM</div>
                    </li>
                    <li className="py-2 border-b">
                      <div className="font-medium">Event schedule updated</div>
                      <div className="text-sm text-muted-foreground">May 11, 2025 • 1:15 PM</div>
                    </li>
                    <li className="py-2">
                      <div className="font-medium">Dues payment received</div>
                      <div className="text-sm text-muted-foreground">May 10, 2025 • 9:30 AM</div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Members</span>
                      <span className="font-semibold">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Events</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sheet Music Files</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage Used</span>
                      <span className="font-semibold">2.4 GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminModules.slice(0, 3).map((module, index) => (
                <Link key={index} to={module.link} className="no-underline">
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className={`bg-gradient-to-r ${module.color} text-white rounded-t-lg`}>
                      <CardTitle className="flex items-center">
                        <div className="bg-white/20 p-2 rounded-md mr-3">
                          {module.icon}
                        </div>
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-muted-foreground">{module.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/admin/analytics" className="no-underline">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-md mr-3">
                        <BarChart className="h-6 w-6" />
                      </div>
                      Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground">View reports and statistics</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/admin/settings" className="no-underline">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-md mr-3">
                        <Settings className="h-6 w-6" />
                      </div>
                      Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground">Configure system settings</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboardPage;
