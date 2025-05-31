
import React from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { adminNavItems } from "@/components/layout/AdminNavItems";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Home, ChevronLeft, LayoutDashboard, Users, User, FileImage, Settings, BarChart3, Package, Calendar, Upload, Image, Tags, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

/**
 * Unified Admin Dashboard - Complete interface with sidebar and main content
 */
const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard: Component rendering');
  const location = useLocation();

  const adminModules = [
    {
      title: "Calendar Management",
      icon: <Calendar className="h-5 w-5" />,
      description: "Manage events, performances, and RSVPs",
      link: "/admin/calendar",
      color: "bg-blue-500",
      stats: "24 events"
    },
    {
      title: "Member Management", 
      icon: <Users className="h-5 w-5" />,
      description: "Manage Glee Club member profiles",
      link: "/admin/members",
      color: "bg-green-500",
      stats: "85 members"
    },
    {
      title: "User Management",
      icon: <User className="h-5 w-5" />,
      description: "Manage user accounts and permissions",
      link: "/admin/user-management",
      color: "bg-purple-500",
      stats: "120 users"
    },
    {
      title: "Hero Manager",
      icon: <Image className="h-5 w-5" />,
      description: "Update landing page hero content",
      link: "/admin/hero-manager",
      color: "bg-orange-500",
      stats: "8 images"
    },
    {
      title: "Media Manager",
      icon: <Upload className="h-5 w-5" />,
      description: "Upload and organize media files",
      link: "/admin/media-uploader",
      color: "bg-indigo-500",
      stats: "342 files"
    },
    {
      title: "Orders",
      icon: <Package className="h-5 w-5" />,
      description: "Manage merchandise orders",
      link: "/admin/orders",
      color: "bg-teal-500",
      stats: "12 pending"
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "View site metrics and insights",
      link: "/admin/analytics",
      color: "bg-red-500",
      stats: "↑ 12% growth"
    },
    {
      title: "Fan Tags",
      icon: <Tags className="h-5 w-5" />,
      description: "Organize fan engagement tags",
      link: "/admin/fan-tags",
      color: "bg-pink-500",
      stats: "45 tags"
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      description: "Configure system preferences",
      link: "/admin/settings",
      color: "bg-gray-500",
      stats: "Updated"
    }
  ];

  const quickStats = [
    {
      title: "Total Events",
      value: "24",
      change: "+3",
      changeType: "positive",
      icon: <Calendar className="h-4 w-4" />,
      color: "text-blue-600"
    },
    {
      title: "Active Members",
      value: "85",
      change: "+5",
      changeType: "positive", 
      icon: <Users className="h-4 w-4" />,
      color: "text-green-600"
    },
    {
      title: "Media Files",
      value: "342",
      change: "+18",
      changeType: "positive",
      icon: <FileImage className="h-4 w-4" />,
      color: "text-purple-600"
    },
    {
      title: "Pending Orders",
      value: "12",
      change: "-3",
      changeType: "neutral",
      icon: <Package className="h-4 w-4" />,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-glee-spelman/10 rounded-lg">
              <div className="w-6 h-6 bg-glee-spelman rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">SC</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Glee Club Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {adminNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.url || 
              (item.url === "/admin" && location.pathname === "/admin");
            
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-glee-spelman text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                end={item.url === "/admin"}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.title}</span>
                {item.title === "Orders" && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                    12
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </nav>

        <Separator />

        {/* Footer */}
        <div className="p-4 space-y-2">
          <Button variant="outline" asChild className="w-full justify-start">
            <NavLink to="/dashboard/member">
              <Home className="h-4 w-4 mr-2" />
              Member Dashboard
            </NavLink>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start text-gray-500">
            <NavLink to="/">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Site
            </NavLink>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-glee-spelman/10 rounded-xl">
                <LayoutDashboard className="h-6 w-6 text-glee-spelman" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Comprehensive administrative control center for Spelman College Glee Club</p>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            stat.changeType === 'positive' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admin Modules Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Administrative Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminModules.map((module, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${module.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                        {module.icon}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {module.stats}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-glee-spelman transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {module.description}
                    </p>
                    
                    <Button 
                      asChild 
                      className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-glee-spelman hover:text-glee-spelman transition-all duration-200"
                      variant="outline"
                    >
                      <Link to={module.link}>
                        Access {module.title}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-glee-spelman" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                >
                  <Link to="/admin/calendar?create=true">
                    <Calendar className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Create Event</div>
                      <div className="text-xs text-gray-500">Schedule new performance</div>
                    </div>
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all duration-200"
                >
                  <Link to="/admin/media-uploader">
                    <Upload className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Upload Media</div>
                      <div className="text-xs text-gray-500">Add photos & videos</div>
                    </div>
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all duration-200"
                >
                  <Link to="/admin/members?action=invite">
                    <Users className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Invite Member</div>
                      <div className="text-xs text-gray-500">Add new Glee member</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
