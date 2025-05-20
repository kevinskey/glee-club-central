
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom"; // Using Link instead of useNavigate directly
import { Music, Calendar, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Glee World</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your central hub for Spelman College Glee Club activities and resources.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-glee-purple" />
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:underline"
                  asChild
                >
                  <Link to="/dashboard/sheet-music">Sheet Music Library</Link>
                </Button>
              </li>
              <li className="flex items-center">
                <Music className="h-4 w-4 mr-2 text-glee-purple" />
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:underline"
                  asChild
                >
                  <Link to="/dashboard/recordings">Recordings</Link>
                </Button>
              </li>
              <li className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-glee-purple" />
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:underline"
                  asChild
                >
                  <Link to="/dashboard/calendar">Calendar</Link>
                </Button>
              </li>
              <li className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-glee-purple" />
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:underline"
                  asChild
                >
                  <Link to="/dashboard/profile">My Profile</Link>
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
