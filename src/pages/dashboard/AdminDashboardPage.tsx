
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Settings, 
  BarChart3, 
  FileMusic,
  Shield,
  TrendingUp
} from "lucide-react";

const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin, isLoading, profile } = useAuth();
  
  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Check admin access
  const hasAdminAccess = isAdmin && isAdmin();
  
  if (!isAuthenticated || !hasAdminAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this area.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminModules = [
    {
      title: "Member Management",
      description: "Manage member accounts and permissions",
      icon: <Users className="h-6 w-6" />,
      link: "/dashboard/admin/members",
      color: "bg-blue-500"
    },
    {
      title: "Financial Records",
      description: "Track dues and manage finances",
      icon: <DollarSign className="h-6 w-6" />,
      link: "/dashboard/finances",
      color: "bg-green-500"
    },
    {
      title: "Calendar Management",
      description: "Manage events and rehearsals",
      icon: <Calendar className="h-6 w-6" />,
      link: "/dashboard/calendar",
      color: "bg-purple-500"
    },
    {
      title: "Settings",
      description: "Configure system settings",
      icon: <Settings className="h-6 w-6" />,
      link: "/dashboard/settings",
      color: "bg-gray-500"
    }
  ];

  const quickStats = [
    { label: "Total Members", value: "40", icon: <Users className="h-4 w-4" /> },
    { label: "Active Events", value: "12", icon: <Calendar className="h-4 w-4" /> },
    { label: "Dues Collected", value: "85%", icon: <TrendingUp className="h-4 w-4" /> },
    { label: "Sheet Music", value: "156", icon: <FileMusic className="h-4 w-4" /> }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description={`Welcome, ${profile?.first_name || 'Administrator'} - Administrative controls and overview`}
        icon={<Shield className="h-6 w-6" />}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="text-glee-spelman">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Admin Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminModules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-md ${module.color} text-white`}>
                  {module.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild className="w-full">
                <Link to={module.link}>
                  Access {module.title}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin">
                <BarChart3 className="h-4 w-4 mr-2" />
                Full Admin Panel
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/announcements">
                <FileMusic className="h-4 w-4 mr-2" />
                Manage Announcements
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/sheet-music">
                <FileMusic className="h-4 w-4 mr-2" />
                Sheet Music Library
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
