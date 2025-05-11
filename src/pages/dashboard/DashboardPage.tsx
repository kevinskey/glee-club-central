
import React, { useState, useEffect } from "react";
import { PageHeaderWithToggle } from "@/components/ui/page-header-with-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import ErrorBoundary from "@/components/ErrorBoundary";
import { NextEventCountdown } from "@/components/dashboard/NextEventCountdown";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";
import { RehearsalNotes } from "@/components/dashboard/RehearsalNotes";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";
import { QuickAccess } from "@/components/dashboard/QuickAccess";
import { DuesStatusCard } from "@/components/dashboard/DuesStatusCard";
import { DeveloperTools } from "@/components/dashboard/DeveloperTools";
import { ResourcesSection } from "@/components/dashboard/ResourcesSection";
import { AdminDashboardAccess } from "@/components/dashboard/AdminDashboardAccess";

export interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
}

const DashboardPageContent = () => {
  // All hooks at the top of the component
  const { profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  
  // Fetch events from the database
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gt('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(3);
        
      if (error) throw error;
      
      if (data) {
        // Convert string dates to Date objects
        setEvents(data.map(event => ({
          ...event,
          date: new Date(event.date)
        })));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    // Load data
    const loadData = async () => {
      await fetchEvents();
      setLoading(false);
    };
    
    if (!authLoading) {
      loadData();
    }
  }, [authLoading]);
  
  // Next upcoming event for countdown
  const nextEvent = events && events.length > 0 ? events[0] : null;
  
  const handleRegisterAsAdmin = () => {
    navigate("/dashboard/admin");
  };
  
  // Use conditional rendering instead of early returns
  const renderContent = () => {
    if (loading || authLoading) {
      return (
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      );
    }
    
    return (
      <div className="container mx-auto p-4 space-y-8">
        <PageHeaderWithToggle
          title={`Welcome, ${profile?.first_name || 'Member'}`}
          description="Your Spelman College Glee Club dashboard"
          icon={<Home className="h-6 w-6" />}
        />
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Today's Agenda */}
          <div className="md:col-span-2 space-y-8">
            {/* Next Event Countdown */}
            {nextEvent && <NextEventCountdown event={nextEvent} />}
            
            {/* Upcoming Events */}
            <DashboardEvents events={events} />
            
            {/* Rehearsal Notes */}
            <RehearsalNotes />
            
            {/* Announcements Card */}
            <DashboardAnnouncements />
          </div>
          
          {/* Right Column - Quick Access */}
          <div className="space-y-8">
            {/* Quick Access */}
            <QuickAccess />
            
            {/* Dues Status Card */}
            <DuesStatusCard />
            
            {/* Development Tools */}
            <DeveloperTools />
          </div>
        </div>
        
        {/* Bottom Row */}
        <ResourcesSection />
        
        {/* Admin Dashboard Access */}
        <AdminDashboardAccess onAccess={handleRegisterAsAdmin} />
      </div>
    );
  };
  
  return renderContent();
};

// Wrap the component with ErrorBoundary for better error handling
const DashboardPage = () => {
  return (
    <ErrorBoundary>
      <DashboardPageContent />
    </ErrorBoundary>
  );
};

export default DashboardPage;
