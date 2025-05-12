
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Share2, Instagram, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/Icons";

export default function SocialPage() {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/spelmanglee/",
      icon: <Instagram className="h-6 w-6" />,
      description: "Follow us for photos and short videos from performances"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/SpelmanGlee/",
      icon: <Facebook className="h-6 w-6" />,
      description: "Like our page for event announcements and community updates"
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@spelmanglee",
      icon: <Icons.tiktok className="h-6 w-6" />,
      description: "Enjoy short clips of our performances and behind-the-scenes content"
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@SpelmanCollegeGleeClub",
      icon: <Youtube className="h-6 w-6" />,
      description: "Watch full performances and interviews"
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Social Media"
        description="Connect with the Spelman College Glee Club on social media"
        icon={<Share2 className="h-6 w-6" />}
      />
      
      <div className="container px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.map((social) => (
            <Card key={social.name} className="overflow-hidden">
              <CardHeader className="bg-glee-spelman/5 flex flex-row items-center gap-4 pb-2">
                <div className="bg-glee-spelman/10 p-2 rounded-full">
                  {social.icon}
                </div>
                <CardTitle>{social.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="mb-4">{social.description}</CardDescription>
                <Button 
                  asChild 
                  className="w-full"
                  variant="outline"
                >
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    Visit {social.name}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
