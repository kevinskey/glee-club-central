
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Instagram, 
  Facebook, 
  Youtube 
} from "lucide-react";
import { Icons } from "@/components/Icons";

export const ResourcesSection: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-glee-spelman" />
          <span>Resources</span>
        </CardTitle>
        <CardDescription>Spelman College Links & Social Media</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Button
            variant="outline"
            className="h-auto flex-col py-4 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 whitespace-normal text-center"
            onClick={() => window.open("https://www.spelman.edu", "_blank")}
          >
            <Globe className="h-6 w-6 mb-2 text-glee-spelman" />
            <span className="text-sm">Spelman College</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto flex-col py-4 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 whitespace-normal text-center"
            onClick={() => window.open("https://www.instagram.com/spelmanglee/", "_blank")}
          >
            <Instagram className="h-6 w-6 mb-2 text-glee-spelman" />
            <span className="text-sm">Instagram</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto flex-col py-4 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 whitespace-normal text-center"
            onClick={() => window.open("https://www.facebook.com/SpelmanGlee/", "_blank")}
          >
            <Facebook className="h-6 w-6 mb-2 text-glee-spelman" />
            <span className="text-sm">Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto flex-col py-4 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 whitespace-normal text-center"
            onClick={() => window.open("https://www.tiktok.com/@spelmanglee", "_blank")}
          >
            <Icons.tiktok className="h-6 w-6 mb-2 text-glee-spelman" />
            <span className="text-sm">TikTok</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto flex-col py-4 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 whitespace-normal text-center"
            onClick={() => window.open("https://www.youtube.com/@SpelmanCollegeGleeClub", "_blank")}
          >
            <Youtube className="h-6 w-6 mb-2 text-glee-spelman" />
            <span className="text-sm">YouTube</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
