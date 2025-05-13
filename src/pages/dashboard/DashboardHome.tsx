
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays } from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.user_metadata?.full_name || 'Member'}`}
        description="Your Glee Club dashboard at a glance"
        icon={<CalendarDays className="h-6 w-6" />}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <p className="text-sm text-muted-foreground">Access frequently used features</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <p className="text-sm text-muted-foreground">Your rehearsals and performances</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Announcements</h3>
          <p className="text-sm text-muted-foreground">Latest updates from leadership</p>
        </div>
      </div>
    </div>
  );
}
