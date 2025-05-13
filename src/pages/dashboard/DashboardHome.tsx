
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Calendar, Bell, FileText } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Glee World</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Music className="mr-2 h-5 w-5" /> Sheet Music
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Access your choir's sheet music library.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">View rehearsals and performance schedules.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bell className="mr-2 h-5 w-5" /> Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Latest announcements from the directors.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5" /> Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Access club resources and documents.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">No upcoming events scheduled.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">No quick links available.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
