
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  Users,
  Calendar,
  Music,
  FileText,
  MessageSquare,
  CreditCard,
  Shirt,
  BarChart3,
  Upload,
  Settings,
  Megaphone
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  
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

  // Admin features
  const adminFeatures = [
    {
      title: "Member Management",
      description: "Manage profiles, roles, and voice parts",
      icon: Users,
      path: "/dashboard/admin/members"
    },
    {
      title: "Calendar Manager",
      description: "Schedule events and rehearsals",
      icon: Calendar,
      path: "/dashboard/calendar"
    },
    {
      title: "Repertoire Library",
      description: "Organize sheet music and recordings",
      icon: Music,
      path: "/dashboard/sheet-music"
    },
    {
      title: "Announcements",
      description: "Post news and updates",
      icon: Megaphone,
      path: "/dashboard/announcements"
    },
    {
      title: "Messaging",
      description: "Send communications to members",
      icon: MessageSquare,
      path: "/dashboard/messages"
    },
    {
      title: "Financial Tracking",
      description: "Manage dues and payments",
      icon: CreditCard,
      path: "/dashboard/admin/finances"
    },
    {
      title: "Wardrobe Management",
      description: "Track and assign uniforms",
      icon: Shirt,
      path: "/dashboard/admin/wardrobe"
    },
    {
      title: "Media Sources",
      description: "Upload and manage photos and videos",
      icon: Upload,
      path: "/dashboard/media-library"
    },
    {
      title: "Documentation",
      description: "Manage handbook and forms",
      icon: FileText,
      path: "/dashboard/handbook"
    },
    {
      title: "Analytics",
      description: "View statistics and reports",
      icon: BarChart3,
      path: "/dashboard/admin/analytics"
    },
    {
      title: "Site Settings",
      description: "Configure site appearance and options",
      icon: Settings,
      path: "/dashboard/admin/settings"
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Administrator Dashboard"
        description="Manage all aspects of the Glee Club"
        icon={<Settings className="h-6 w-6" />}
      />
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+4 since last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next: Spring Concert (May 15)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dues Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">35/42 members paid</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin Features Grid */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Administration Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminFeatures.map((feature, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <feature.icon className="h-5 w-5 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button asChild variant="outline" className="w-full">
                <Link to={feature.path}>
                  Manage
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Recent Activity Section */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Activity</h2>
      <Card>
        <CardContent className="p-6">
          <ul className="space-y-4">
            <li className="flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">New member registered</p>
                <p className="text-sm text-muted-foreground">Tanya Williams joined as Alto 2</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">New sheet music uploaded</p>
                <p className="text-sm text-muted-foreground">Ave Maria - Soprano 1 & 2 parts</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Event updated</p>
                <p className="text-sm text-muted-foreground">Spring Concert time changed to 7:30 PM</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
