
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { LayoutDashboard, Users, User, FileImage, Settings, BarChart3, Package, Calendar, Upload, Image, Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/**
 * Complete Admin Dashboard with all core administrative modules
 */
const AdminDashboard: React.FC = () => {
  const adminModules = [
    {
      title: "Calendar Management",
      icon: <Calendar className="h-6 w-6" />,
      description: "Manage event calendar, performances, and RSVPs",
      link: "/admin/calendar",
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Member Management", 
      icon: <Users className="h-6 w-6" />,
      description: "Manage Glee Club member profiles and sections",
      link: "/admin/members",
      color: "from-green-500 to-green-700"
    },
    {
      title: "User Management",
      icon: <User className="h-6 w-6" />,
      description: "Manage user accounts, permissions, and access",
      link: "/admin/user-management",
      color: "from-purple-500 to-purple-700"
    },
    {
      title: "Hero Manager",
      icon: <Image className="h-6 w-6" />,
      description: "Update landing page hero images and content",
      link: "/admin/hero-manager",
      color: "from-orange-500 to-orange-700"
    },
    {
      title: "Media Manager",
      icon: <Upload className="h-6 w-6" />,
      description: "Upload and organize photos, videos, and documents",
      link: "/admin/media-uploader",
      color: "from-indigo-500 to-indigo-700"
    },
    {
      title: "Orders",
      icon: <Package className="h-6 w-6" />,
      description: "Manage merchandise orders and fulfillment",
      link: "/admin/orders",
      color: "from-teal-500 to-teal-700"
    },
    {
      title: "Analytics Dashboard",
      icon: <BarChart3 className="h-6 w-6" />,
      description: "View site analytics, metrics, and insights",
      link: "/admin/analytics",
      color: "from-red-500 to-red-700"
    },
    {
      title: "Fan Tags Manager",
      icon: <Tags className="h-6 w-6" />,
      description: "Organize and manage fan engagement tags",
      link: "/admin/fan-tags",
      color: "from-pink-500 to-pink-700"
    },
    {
      title: "Settings",
      icon: <Settings className="h-6 w-6" />,
      description: "Configure system settings and preferences",
      link: "/admin/settings",
      color: "from-gray-500 to-gray-700"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Admin Dashboard"
        description="Comprehensive administrative control center for Spelman College Glee Club"
        icon={<LayoutDashboard className="h-6 w-6" />}
      />
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Events</p>
                <p className="text-lg font-semibold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-lg font-semibold">85</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileImage className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Media Files</p>
                <p className="text-lg font-semibold">342</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-lg font-semibold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Card key={index} className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 group">
            <CardHeader className={`bg-gradient-to-r ${module.color} text-white rounded-t-lg`}>
              <CardTitle className="flex items-center text-lg">
                <div className="bg-white/20 p-2 rounded-md mr-3 group-hover:bg-white/30 transition-colors">
                  {module.icon}
                </div>
                {module.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-6 flex flex-col justify-between h-full">
              <p className="text-muted-foreground mb-4 flex-grow">{module.description}</p>
              <Button 
                asChild 
                className="w-full bg-glee-spelman hover:bg-glee-spelman/90 text-white"
              >
                <Link to={module.link}>
                  Go to {module.title}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Admin Actions */}
      <div className="mt-12 p-6 bg-gradient-to-r from-glee-purple/10 to-glee-spelman/10 rounded-lg border border-glee-purple/20">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" asChild className="flex items-center justify-center p-4 h-auto">
            <Link to="/admin/calendar?create=true" className="flex flex-col items-center space-y-2">
              <Calendar className="h-5 w-5" />
              <span>Create Event</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex items-center justify-center p-4 h-auto">
            <Link to="/admin/media-uploader" className="flex flex-col items-center space-y-2">
              <Upload className="h-5 w-5" />
              <span>Upload Media</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex items-center justify-center p-4 h-auto">
            <Link to="/admin/members?action=invite" className="flex flex-col items-center space-y-2">
              <Users className="h-5 w-5" />
              <span>Invite Member</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
