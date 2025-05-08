
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import {
  BarChart3,
  Calendar,
  CreditCard,
  Settings,
  Users,
  Shirt,
  Music,
  Bell,
} from "lucide-react";

// Import the new components
import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { AdminMembersList } from "@/components/admin/AdminMembersList";
import { EventTimeline } from "@/components/admin/EventTimeline";
import { QuickActions } from "@/components/admin/QuickActions";

// Sample data for demonstration
const sampleMembers = [
  {
    id: "1",
    name: "Tanya Williams",
    role: "Singer",
    voicePart: "Alto 2",
    duesPaid: true,
    avatarUrl: ""
  },
  {
    id: "2",
    name: "James Johnson",
    role: "Singer",
    voicePart: "Tenor",
    duesPaid: false,
    avatarUrl: ""
  },
  {
    id: "3",
    name: "Sophia Martinez",
    role: "Section Leader",
    voicePart: "Soprano 1",
    duesPaid: true,
    avatarUrl: ""
  },
  {
    id: "4",
    name: "Marcus Brown",
    role: "Student Conductor",
    voicePart: "Bass",
    duesPaid: true,
    avatarUrl: ""
  },
  {
    id: "5",
    name: "Olivia Garcia",
    role: "Singer",
    voicePart: "Soprano 2",
    duesPaid: false,
    avatarUrl: ""
  }
];

const sampleEvents = [
  {
    id: "1",
    date: "May 15, 2025",
    title: "Spring Concert",
    type: "performance" as const,
    description: "Annual spring performance at Sisters Chapel"
  },
  {
    id: "2",
    date: "May 10, 2025",
    title: "Final Rehearsal",
    type: "rehearsal" as const,
    description: "Pre-concert dress rehearsal"
  },
  {
    id: "3",
    date: "June 5, 2025",
    title: "Alumni Event",
    type: "other" as const,
    description: "Special performance for alumni weekend"
  }
];

export default function AdminDashboardPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const [activeMembers, setActiveMembers] = useState(42);
  const [duesPercentage, setDuesPercentage] = useState(87);
  const [upcomingEvents, setUpcomingEvents] = useState(3);
  
  // Redirect if user is not authenticated or not an admin
  if (!isLoading && (!isAuthenticated || !isAdmin())) {
    return <Navigate to="/dashboard" />;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Administrator Dashboard"
        description="Manage all aspects of the Glee Club"
        icon={<Settings className="h-6 w-6" />}
      />
      
      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <AnalyticsCard 
          title="Active Members" 
          value={activeMembers} 
          change={4}
          description={`${activeMembers} total members`}
          icon={<Users className="h-5 w-5" />}
        />
        <AnalyticsCard 
          title="Upcoming Events" 
          value={upcomingEvents}
          description="Next: Spring Concert (May 15)"
          icon={<Calendar className="h-5 w-5" />}
        />
        <AnalyticsCard 
          title="Dues Collection" 
          value={`${duesPercentage}%`}
          description={`${Math.round(activeMembers * duesPercentage/100)}/${activeMembers} members paid`}
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>
      
      {/* Quick Actions Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <QuickActions />
        <EventTimeline events={sampleEvents} />
      </div>
      
      {/* Members and Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <AdminMembersList members={sampleMembers} />
        
        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">New member registered</p>
                <p className="text-sm text-muted-foreground">Tanya Williams joined as Alto 2</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded">
                <Music className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">New sheet music uploaded</p>
                <p className="text-sm text-muted-foreground">Ave Maria - Soprano 1 & 2 parts</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Event updated</p>
                <p className="text-sm text-muted-foreground">Spring Concert time changed to 7:30 PM</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Announcement sent</p>
                <p className="text-sm text-muted-foreground">Reminder about dues payment deadline</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded">
                <Shirt className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Wardrobe update</p>
                <p className="text-sm text-muted-foreground">Concert dresses assigned to 5 new members</p>
                <p className="text-xs text-muted-foreground">Last week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
