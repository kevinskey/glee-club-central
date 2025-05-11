
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
    <div className="space-y-3 md:space-y-4">
      {announcements && announcements.length > 0 ? (
        announcements.map(announcement => (
          <div key={announcement.id} className="pb-3 border-b last:border-0">
            <h3 className="font-medium text-sm md:text-base">{announcement.title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2 md:line-clamp-none">{announcement.message}</p>
          </div>
        ))
      ) : (
        <div className="text-muted-foreground text-xs md:text-sm">No announcements</div>
      )}
      <div className="mt-3 md:mt-4">
        <Link 
          to="/dashboard/announcements" 
          className="text-xs md:text-sm text-primary hover:underline inline-flex items-center"
        >
          View all announcements
        </Link>
      </div>
    </div>
  );
}
