
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { LayoutDashboard, Users, FileImage, Settings, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

/**
 * Simplified Admin Dashboard
 * Consolidated from multiple dashboard implementations
 */
const AdminDashboard: React.FC = () => {
  const adminModules = [
    {
      title: "Media Management",
      icon: <FileImage className="h-6 w-6" />,
      description: "Upload and manage site images",
      link: "/admin/media",
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "User Management",
      icon: <Users className="h-6 w-6" />,
      description: "Manage member accounts",
      link: "/admin/users",
      color: "from-green-500 to-green-700"
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="h-6 w-6" />,
      description: "View site analytics",
      link: "/admin/analytics",
      color: "from-purple-500 to-purple-700"
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
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Admin Dashboard"
        description="Manage Glee Club administrative tasks"
        icon={<LayoutDashboard className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
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
    </div>
  );
};

export default AdminDashboard;
