
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, Calendar, BarChart, FileMusic } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const adminModules = [
    {
      title: "Member Management",
      icon: <Users className="h-6 w-6" />,
      description: "Manage member accounts and permissions",
      link: "/admin/users",
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Calendar Management",
      icon: <Calendar className="h-6 w-6" />,
      description: "Schedule events and rehearsals",
      link: "/admin/calendar",
      color: "from-green-500 to-green-700"
    },
    {
      title: "Analytics",
      icon: <BarChart className="h-6 w-6" />,
      description: "View reports and statistics",
      link: "/admin/analytics",
      color: "from-pink-500 to-pink-700"
    },
    {
      title: "Media Library",
      icon: <FileMusic className="h-6 w-6" />,
      description: "Manage music and media files",
      link: "/admin/media",
      color: "from-purple-500 to-purple-700"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Admin Dashboard"
        description="Manage Glee Club administrative tasks"
        icon={<LayoutDashboard className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {adminModules.map((module, index) => (
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
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                <span className="text-sm text-muted-foreground">Total Members</span>
                <span className="text-2xl font-bold">42</span>
              </div>
              <div className="flex flex-col p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                <span className="text-sm text-muted-foreground">Upcoming Events</span>
                <span className="text-2xl font-bold">5</span>
              </div>
              <div className="flex flex-col p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                <span className="text-sm text-muted-foreground">Media Files</span>
                <span className="text-2xl font-bold">128</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
