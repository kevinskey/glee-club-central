
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Bell, Users, Music, Settings } from "lucide-react";
import { Link } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Glee Club Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-glee-purple" />
              Sheet Music
            </CardTitle>
            <CardDescription>
              Access your sheet music library
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              View, annotate, and organize your vocal scores
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/dashboard/sheet-music">View Sheet Music</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-glee-purple" />
              Calendar
            </CardTitle>
            <CardDescription>
              Upcoming rehearsals and performances
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              Stay updated with all Glee Club events
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/dashboard/calendar">View Calendar</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-glee-purple" />
              Announcements
            </CardTitle>
            <CardDescription>
              Important updates and notices
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              Read the latest announcements from the directors
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/dashboard/announcements">View Announcements</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-glee-purple" />
              Members
            </CardTitle>
            <CardDescription>
              View the Glee Club roster
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              Contact information and voice parts
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/dashboard/members">View Members</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Music className="mr-2 h-5 w-5 text-glee-purple" />
              Recordings
            </CardTitle>
            <CardDescription>
              Practice recordings and performances
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              Listen to recordings for practice and reference
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/dashboard/recordings">View Recordings</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-glee-purple" />
              Profile
            </CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              Update your personal information and preferences
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/dashboard/profile">View Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
