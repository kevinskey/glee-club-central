
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Calendar, Info, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function GuestDashboardPage() {
  const { profile } = useAuth();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.first_name || 'Guest'}`}
        description="Guest access to Spelman College Glee Club resources"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-glee-spelman" />
              Upcoming Events
            </CardTitle>
            <CardDescription>View upcoming public performances</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with the Spelman College Glee Club's public performances and events.
            </p>
            <Button variant="outline" asChild>
              <Link to="/dashboard/calendar">View Calendar</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5 text-glee-spelman" />
              About the Glee Club
            </CardTitle>
            <CardDescription>Learn about our history and mission</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Discover the rich history and traditions of the Spelman College Glee Club.
            </p>
            <Button variant="outline" asChild>
              <Link to="/about">Read More</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
              Limited Access
            </CardTitle>
            <CardDescription>You are currently browsing as a guest</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              As a guest user, you have limited access to Glee Club resources. Contact the administrator if you need member access.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Become a Member</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
