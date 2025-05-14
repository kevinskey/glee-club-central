
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { ExternalLink, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PressKitMediaGrid } from '@/components/media/PressKitMediaGrid';
import { PressKitDocuments } from '@/components/media/PressKitDocuments';

const PressKitPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Press Kit"
        description="Access promotional materials and resources for the Spelman College Glee Club"
        icon={<FileText className="h-6 w-6" />}
      />
      
      <Tabs defaultValue="media" className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="media" className="flex items-center gap-1">
            <Image className="w-4 h-4" />
            <span>Media</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>Documents</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="media" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Official Images</h2>
            <p className="text-muted-foreground mb-6">
              These images are approved for use in promotional materials, press releases, and publications. 
              When using these images, please credit: "Courtesy of Spelman College Glee Club."
            </p>
            
            <div className="space-y-8">
              <PressKitMediaGrid 
                bucketName="event-images" 
                folder="press-kit" 
                title="Performance Photos" 
                maxItems={8} 
              />
              
              <Separator className="my-8" />
              
              <PressKitMediaGrid 
                bucketName="event-images" 
                folder="logos" 
                title="Logos & Branding" 
                maxItems={4} 
              />
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Press Documents</h2>
            <p className="text-muted-foreground mb-6">
              Below you'll find press releases, fact sheets, and biographies for the Spelman College Glee Club.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Press Releases & Media Kits</h3>
                <PressKitDocuments bucketName="media-library" folder="press-releases" />
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Biographies & Program Notes</h3>
                <PressKitDocuments bucketName="media-library" folder="biographies" />
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
              <p className="mb-4">For media inquiries and interview requests, please contact:</p>
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium">Media Relations Department</p>
                <p className="text-muted-foreground">media@spelmanglee.example.com</p>
                <p className="text-muted-foreground">+1 (404) 555-0123</p>
                <Button variant="outline" className="mt-4 gap-2" asChild>
                  <a href="mailto:media@spelmanglee.example.com">
                    <ExternalLink className="h-4 w-4" />
                    Contact Media Team
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PressKitPage;
