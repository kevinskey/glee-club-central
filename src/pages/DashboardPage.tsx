
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Music, Calendar, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
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
                  onClick={() => navigate("/dashboard/sheet-music")}
                >
                  Sheet Music Library
                </Button>
              </li>
              <li className="flex items-center">
                <Music className="h-4 w-4 mr-2 text-glee-purple" />
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:underline"
                  onClick={() => navigate("/dashboard/recordings")}
                >
                  Recordings
                </Button>
              </li>
              <li className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-glee-purple" />
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:underline"
                  onClick={() => navigate("/dashboard/calendar")}
                >
                  Calendar
                </Button>
              </li>
              <li className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-glee-purple" />
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:underline"
                  onClick={() => navigate("/dashboard/profile")}
                >
                  My Profile
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
