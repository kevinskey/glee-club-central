
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
              <li>
                <a href="/dashboard/profile" className="text-primary hover:underline">
                  My Profile
                </a>
              </li>
              <li>
                <a href="/dashboard/members" className="text-primary hover:underline">
                  Members Directory
                </a>
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
