
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  CreditCard,
  FileText, 
  Headphones, 
  Mic,
  Video,
  Bell,
  CheckSquare,
  MessageSquare,
  User,
  Music
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
  badge?: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  href,
  color = "bg-primary/10",
  badge
}: FeatureCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <Link to={href} className="block h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className={`mb-2 w-fit rounded-md p-2 ${color}`}>{icon}</div>
            {badge && (
              <Badge variant="outline" className="ml-2">
                {badge}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-3 pt-0">
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <span className="transform transition-transform group-hover:translate-x-1">
            View section →
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default function DashboardPage() {
  const { profile, isLoading } = useAuth();
  const [profileProgress, setProfileProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Calculate member progress
  useEffect(() => {
    if (profile) {
      try {
        // Simulate progress calculation - would be based on actual data
        const randomProgress = Math.floor(Math.random() * 100);
        setProfileProgress(randomProgress);
      } catch (error) {
        console.error("Error calculating progress:", error);
      }
    }
  }, [profile]);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Loading your Glee Club dashboard...</p>
      </div>
    );
  }

  // Show error state if there's an issue
  if (loadError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
          <p className="mb-4 text-muted-foreground">{loadError}</p>
          <Button 
            onClick={() => {
              setLoadError(null);
              setRetryCount(prev => prev + 1);
            }}
          >
            Retry Loading Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const greeting = profile ? `Hello, ${profile.first_name || ''}!` : "Hello!";
  const voicePart = profile?.voice_part ? formatVoicePart(profile.voice_part) : "Not assigned";
  const duesPaid = profile?.dues_paid ? "Paid" : "Unpaid";
  const lastLogin = profile?.last_sign_in_at ? 
    new Date(profile.last_sign_in_at).toLocaleDateString() : 
    "First login";
  
  function formatVoicePart(voicePart: string | null): string {
    if (!voicePart) return "Not assigned";
    
    switch (voicePart) {
      case "soprano_1": return "Soprano 1";
      case "soprano_2": return "Soprano 2";
      case "alto_1": return "Alto 1";
      case "alto_2": return "Alto 2";
      case "tenor": return "Tenor";
      case "bass": return "Bass";
      default: return voicePart;
    }
  }

  const features = [
    {
      title: "Sheet Music Library",
      description: "Access and download sheet music for your voice part",
      icon: <FileText className="h-6 w-6" />,
      href: "/dashboard/sheet-music",
      color: "bg-purple-500/10",
      badge: voicePart
    },
    {
      title: "Practice & Sight Reading",
      description: "Access warm-ups and sectionals",
      icon: <Headphones className="h-6 w-6" />,
      href: "/dashboard/practice",
      color: "bg-blue-500/10",
    },
    {
      title: "Recording Submissions",
      description: "Submit recordings of your vocal part for review",
      icon: <Mic className="h-6 w-6" />,
      href: "/dashboard/recordings",
      color: "bg-green-500/10",
    },
    {
      title: "Videos",
      description: "Watch performances and recordings",
      icon: <Video className="h-6 w-6" />,
      href: "/dashboard/videos",
      color: "bg-purple-500/10",
    },
    {
      title: "Pay Dues",
      description: "View and pay your choir membership dues",
      icon: <CreditCard className="h-6 w-6" />,
      href: "/dashboard/dues",
      color: "bg-amber-500/10",
      badge: duesPaid
    },
    {
      title: "Glee Club Schedule",
      description: "View upcoming rehearsals, concerts, and events",
      icon: <Calendar className="h-6 w-6" />,
      href: "/dashboard/calendar",
      color: "bg-red-500/10",
    },
    {
      title: "Attendance",
      description: "Check your attendance record and report absences",
      icon: <CheckSquare className="h-6 w-6" />,
      href: "/dashboard/attendance",
      color: "bg-teal-500/10",
    },
    {
      title: "Messages",
      description: "Chat with members and read announcements",
      icon: <MessageSquare className="h-6 w-6" />,
      href: "/dashboard/messages",
      color: "bg-sky-500/10",
    },
    {
      title: "Performance Checklist",
      description: "View wardrobe requirements and performance details",
      icon: <Music className="h-6 w-6" />,
      href: "/dashboard/performance-checklist",
      color: "bg-pink-500/10",
    },
    {
      title: "Announcements",
      description: "View important announcements from Glee Club leadership",
      icon: <Bell className="h-6 w-6" />,
      href: "/dashboard/announcements",
      color: "bg-orange-500/10",
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <PageHeader
        title={greeting}
        description="Welcome to the Glee World digital choir hub"
        icon={<Music className="h-6 w-6" />}
      />

      {/* Member Profile Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Voice Part</p>
              <p className="font-medium">{voicePart}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dues Status</p>
              <Badge variant={duesPaid === "Paid" ? "success" : "destructive"}>
                {duesPaid}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="font-medium">{lastLogin}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Learning Progress</span>
              <span className="text-sm font-medium">{profileProgress}%</span>
            </div>
            <Progress value={profileProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <h2 className="text-xl font-semibold mb-4">Features</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            href={feature.href}
            color={feature.color}
            badge={feature.badge}
          />
        ))}
      </div>
    </div>
  );
}
