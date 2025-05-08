
import React from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  CreditCard,
  FileText, 
  Headphones, 
  Mic,
  Video,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  href,
  color = "bg-primary/10",
}: FeatureCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <Link to={href} className="block h-full">
        <CardHeader className="pb-3">
          <div className={`mb-2 w-fit rounded-md p-2 ${color}`}>{icon}</div>
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
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  const greeting = profile ? `Hello, ${profile.first_name || ''}!` : "Hello!";
  
  const features = [
    {
      title: "Sheet Music Library",
      description: "Access and download sheet music for your voice part",
      icon: <FileText className="h-6 w-6" />,
      href: "/dashboard/sheet-music",
      color: "bg-purple-500/10",
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
    },
    {
      title: "Glee Club Schedule",
      description: "View upcoming rehearsals, concerts, and events",
      icon: <Calendar className="h-6 w-6" />,
      href: "/dashboard/calendar",
      color: "bg-red-500/10",
    },
    {
      title: "Glee Club Handbook",
      description: "Read the official Glee Club handbook and guidelines",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/dashboard/handbook",
      color: "bg-indigo-500/10",
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
        icon={<Bell className="h-6 w-6" />}
      />

      <div className="mt-6">
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
