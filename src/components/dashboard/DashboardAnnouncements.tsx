
import React, { useState } from "react";
import { Link } from "react-router-dom";

export function DashboardAnnouncements() {
  // Sample announcements data
  const [announcements] = useState([
    {
      id: 1,
      title: "End of Semester Performance",
      message: "Our final performance will be held on May 15th at Sisters Chapel. All members must attend dress rehearsal."
    },
    {
      id: 2,
      title: "Dues Reminder",
      message: "Spring semester dues are due by April 30th. Please make your payments online through the dashboard."
    },
    {
      id: 3,
      title: "New Sheet Music Available",
      message: "New arrangements for the Spring concert have been uploaded. Please review before next rehearsal."
    }
  ]);

  return (
    <div className="space-y-4">
      {announcements && announcements.length > 0 ? (
        announcements.map(announcement => (
          <div key={announcement.id} className="pb-3 border-b last:border-0">
            <h3 className="font-medium">{announcement.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>
          </div>
        ))
      ) : (
        <div className="text-muted-foreground">No announcements</div>
      )}
      <div className="mt-4">
        <Link 
          to="/dashboard/announcements" 
          className="text-sm text-primary hover:underline"
        >
          View all announcements
        </Link>
      </div>
    </div>
  );
}
