
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function DashboardAnnouncements() {
  // Mock announcements data
  const announcements = [
    {
      id: 1,
      date: "May 5, 2025",
      title: "Spring Concert Schedule Change",
      content: "The Spring Concert has been moved from 6:00 PM to 7:30 PM to accommodate venue requirements.",
      priority: "high"
    },
    {
      id: 2,
      date: "May 3, 2025",
      title: "Dues Reminder",
      content: "Please remember all outstanding dues must be paid by May 10th to participate in the end-of-semester concert.",
      priority: "medium"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="destructive">Important</Badge>;
      case 'medium':
        return <Badge variant="secondary">Announcement</Badge>;
      default:
        return <Badge variant="outline">Notice</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-amber-600" />
            Announcements
          </CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map(announcement => (
            <div key={announcement.id} className="border rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{announcement.title}</h4>
                  {getPriorityBadge(announcement.priority)}
                </div>
                <span className="text-xs text-muted-foreground">{announcement.date}</span>
              </div>
              <p className="text-sm">{announcement.content}</p>
            </div>
          ))}
          
          {announcements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="mx-auto h-10 w-10 mb-2 opacity-30" />
              <p>No announcements at this time</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
