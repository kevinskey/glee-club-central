
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Music } from "lucide-react";

export default function ProfilePage() {
  const { user, profile } = useAuth();

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Get display name
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  // Get role description
  const getVoicePart = () => {
    if (profile?.voice_part) {
      return profile.voice_part;
    }
    return "Not specified";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mx-auto max-w-3xl">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 bg-glee-purple text-white text-2xl">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{getDisplayName()}</CardTitle>
              <CardDescription>
                {profile?.role === "admin" ? "Administrator" : "Choir Member"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user?.email || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <Music className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Voice Part</p>
                    <p className="text-sm text-muted-foreground">{getVoicePart()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
