
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  CreditCard,
  FileText, 
  Headphones, 
  Mic, 
  ShoppingBag,
  Bell,
  Video,
  FileImage,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface UpcomingEventProps {
  title: string;
  date: string;
  time?: string;
  location?: string;
}

const UpcomingEvent = ({ title, date, time, location }: UpcomingEventProps) => {
  return (
    <div className="flex items-start space-x-4 p-4 border-b last:border-b-0">
      <div className="flex-shrink-0 w-12 h-12 rounded-md bg-orange-100 flex items-center justify-center">
        <Calendar className="h-6 w-6 text-orange-500" />
      </div>
      <div className="flex-grow">
        <h4 className="font-medium">{title}</h4>
        <div className="text-sm text-muted-foreground">
          <p>{date} {time && `• ${time}`}</p>
          {location && <p>{location}</p>}
        </div>
      </div>
    </div>
  );
};

interface AnnouncementProps {
  title: string;
  date: string;
  preview: string;
}

const Announcement = ({ title, date, preview }: AnnouncementProps) => {
  return (
    <div className="p-4 border-b last:border-b-0">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{preview}</p>
    </div>
  );
};

// Sample data for dashboard
const upcomingEvents = [
  {
    title: "Spring Concert Rehearsal",
    date: "May 10, 2025",
    time: "6:00 PM - 8:30 PM",
    location: "Sisters Chapel"
  },
  {
    title: "Spring Concert",
    date: "May 15, 2025",
    time: "7:00 PM",
    location: "Sisters Chapel"
  },
  {
    title: "Sectional Practice - Sopranos",
    date: "May 12, 2025",
    time: "5:00 PM - 6:30 PM",
    location: "Music Room 101"
  }
];

const announcements = [
  {
    title: "Wardrobe Updates for Spring Concert",
    date: "May 6, 2025",
    preview: "Please be advised that all members should wear the formal black concert attire with orange accessories for the upcoming Spring Concert..."
  },
  {
    title: "Summer Tour Information",
    date: "May 5, 2025",
    preview: "The summer tour schedule has been finalized. Please review the attached itinerary and confirm your participation by May 20th..."
  },
  {
    title: "New Sheet Music Available",
    date: "May 3, 2025",
    preview: "The new repertoire for the Fall semester has been uploaded to the Sheet Music section. Please begin familiarizing yourself with these pieces..."
  }
];

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const greeting = profile ? `Hello, ${profile.first_name || ''}!` : "Hello!";
  const [activeTab, setActiveTab] = useState("features");
  
  const isAdmin = profile?.role === "administrator";

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
      description: "Access warm-ups, sectionals, and sight reading exercises",
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
      description: "Watch performances and recordings from the Glee Club",
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
  ];
  
  const additionalFeatures = [
    {
      title: "Glee Club Handbook",
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
      title: "Media Library",
      description: "View and download photos and media from past events",
      icon: <FileImage className="h-6 w-6" />,
      href: "/dashboard/media-library",
      color: "bg-orange-500/10",
    },
  ];

  return (
    <div>
      <PageHeader
        title={greeting}
        description="Welcome to the Glee World digital choir hub"
        icon={<Bell className="h-6 w-6" />}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin">Admin</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="features" className="pt-4">
          <h2 className="text-xl font-semibold mb-4">Key Features</h2>
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
          
          <Separator className="my-8" />
          
          <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature) => (
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
        </TabsContent>
        
        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Upcoming Events</span>
                  <Link to="/dashboard/calendar" className="text-sm font-normal text-primary hover:underline flex items-center">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardTitle>
                <CardDescription>Your scheduled rehearsals and performances</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {upcomingEvents.map((event, index) => (
                  <UpcomingEvent
                    key={index}
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                  />
                ))}
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/dashboard/calendar">
                    View Full Calendar
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Announcements</span>
                  {isAdmin && (
                    <Link to="/dashboard/announcements" className="text-sm font-normal text-primary hover:underline flex items-center">
                      Manage <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  )}
                </CardTitle>
                <CardDescription>Important updates from Glee Club leadership</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {announcements.map((announcement, index) => (
                  <Announcement
                    key={index}
                    title={announcement.title}
                    date={announcement.date}
                    preview={announcement.preview}
                  />
                ))}
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.info("Full announcement features coming soon!")}
                >
                  View All Announcements
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="admin" className="pt-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Member Management</CardTitle>
                  <CardDescription>Manage choir members and permissions</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">View, add, edit, and manage choir member details, roles, and access permissions.</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link to="/dashboard/members">Manage Members</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Manage all site content</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">Upload sheet music, manage rehearsal recordings, and update announcements.</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link to="/dashboard/announcements">Manage Announcements</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Event Management</CardTitle>
                  <CardDescription>Manage performances and rehearsals</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">Create, edit and manage calendar events, rehearsals, and performances.</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link to="/dashboard/calendar">Manage Calendar</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
