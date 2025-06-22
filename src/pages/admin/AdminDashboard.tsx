
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Settings,
  BarChart3,
  User,
  FileText,
  Package,
  Music,
  Presentation
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage and monitor your organization's operations
        </p>
      </div>

      {/* Welcome Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {profile?.first_name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Here's a quick overview of what you can do:
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Members Management */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/members')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+32</div>
            <p className="text-xs text-muted-foreground">
              New members this month
            </p>
          </CardContent>
        </Card>

        {/* Calendar Management */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/calendar')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calendar</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2</div>
            <p className="text-xs text-muted-foreground">
              New events scheduled
            </p>
          </CardContent>
        </Card>

        {/* Hero Slides Management */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/hero-slides')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hero Slides</CardTitle>
            <Presentation className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage</div>
            <p className="text-xs text-muted-foreground">
              Homepage hero slides
            </p>
          </CardContent>
        </Card>

        {/* Media Library */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/media')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Library</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              New files uploaded
            </p>
          </CardContent>
        </Card>

        {/* Store Management */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/store')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,500</div>
            <p className="text-xs text-muted-foreground">
              Revenue this month
            </p>
          </CardContent>
        </Card>

        {/* Analytics Dashboard */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/analytics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">
              Traffic increase
            </p>
          </CardContent>
        </Card>
        
        {/* Add Arnold's MP3s card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/arnold-mp3s')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arnold's MP3s</CardTitle>
            <Music className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Admin Only</div>
            <p className="text-xs text-muted-foreground">
              Exclusive access to Arnold's audio collection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Shortcut */}
      <div className="mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/settings')}>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Go to Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>Latest Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              <li>New member John Doe joined.</li>
              <li>Event "Summer Concert" scheduled.</li>
              <li>New media file "Promo Video" uploaded.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
