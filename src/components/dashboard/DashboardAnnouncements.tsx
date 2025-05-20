
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function DashboardAnnouncements() {
  const navigate = useNavigate();
  
  const announcements = [
    {
      id: "1",
      title: "Concert Attire Reminder",
      date: "May 10, 2025",
      content: "Please remember to bring your formal attire for the Spring Concert next week. Black attire with purple accessories."
    },
    {
      id: "2",
      title: "Rehearsal Time Change",
      date: "May 6, 2025",
      content: "This week's Thursday rehearsal will start at 6:30 PM instead of 7:00 PM due to venue availability."
    }
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-glee-spelman" />
          <span>Announcements</span>
        </CardTitle>
        <Button
          variant="link"
          className="text-sm text-glee-spelman hover:underline p-0"
          onClick={() => navigate("/dashboard/announcements")}
        >
          View all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{announcement.title}</h4>
                <span className="text-xs text-muted-foreground">{announcement.date}</span>
              </div>
              <p className="text-sm mt-1">{announcement.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
