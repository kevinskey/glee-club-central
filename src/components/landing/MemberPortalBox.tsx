
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, Music } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { SiteImage } from "@/components/site/SiteImage";

export function MemberPortalBox() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-lg mx-auto">
        <Card className="bg-gradient-to-br from-glee-columbia/80 to-glee-purple/60 text-white shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <SiteImage 
                src="/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png"
                alt="Glee Club Heritage Art"
                aspectRatio={1}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold">Glee World Member Portal</CardTitle>
                <CardDescription className="text-white/90">
                  Access your dashboard, sheet music, and more
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-white/20 rounded-full">
                  <Music className="h-8 w-8" />
                </div>
                <p className="text-center text-white/90 max-w-sm">
                  Log in to access your personalized dashboard, rehearsal schedules, and sheet music.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-white text-glee-columbia hover:bg-white/90"
                >
                  <LogIn className="mr-2 h-4 w-4" /> 
                  Member Login
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/fan')} 
                  className="border-white text-white hover:bg-white/20"
                >
                  Guest Access
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
