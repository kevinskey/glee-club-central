
import React from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  CreditCard, 
  FileText, 
  Headphones, 
  Mic, 
  ShoppingBag,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
          <CardTitle className="text-xl">{title}</CardTitle>
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
  const { user } = useAuth();
  const greeting = user ? `Hello, ${user?.name.split(" ")[0]}!` : "Hello!";

  const features = [
    {
      title: "Sheet Music Library",
      description: "Access and download sheet music for your voice part",
      icon: <FileText className="h-6 w-6" />,
      href: "/dashboard/sheet-music",
      color: "bg-glee-purple/10",
    },
    {
      title: "Practice on Your Own",
      description: "Access warm-ups, sectional recordings, and practice media",
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
      href: "/dashboard/schedule",
      color: "bg-red-500/10",
    },
    {
      title: "Club Handbook",
      description: "Read the official Glee Club handbook and guidelines",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/dashboard/handbook",
      color: "bg-indigo-500/10",
    },
    {
      title: "Buy Glee Merch",
      description: "Purchase official Glee Club merchandise",
      icon: <ShoppingBag className="h-6 w-6" />,
      href: "/dashboard/merch",
      color: "bg-pink-500/10",
    },
    {
      title: "Check Attendance",
      description: "View your attendance record for rehearsals and events",
      icon: <CheckSquare className="h-6 w-6" />,
      href: "/dashboard/attendance",
      color: "bg-teal-500/10",
    },
  ];

  return (
    <div>
      <PageHeader
        title={greeting}
        description="Welcome to the Glee World digital choir hub"
        icon={<Bell className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  );
}
