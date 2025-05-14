
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PressKitDocuments } from "@/components/media/PressKitDocuments";
import { PressKitMediaGrid } from "@/components/media/PressKitMediaGrid";
import { FileText, Image, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PressKitPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Press Kit"
        description="Media resources for press and promotional use"
        icon={<FileText className="h-6 w-6" />}
      />
      
      <Card className="border-accent">
        <CardHeader>
          <CardTitle>About the Spelman College Glee Club</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Spelman College Glee Club, founded in the early 1900s, has a distinguished legacy 
            of musical excellence spanning more than a century. As one of the oldest and most 
            respected collegiate choral ensembles in the nation, the Glee Club carries the distinction 
            of being the official ambassadorial vocal ensemble for Spelman College.
          </p>
          
          <p>
            Under the direction of Dr. Kevin Johnson, the Glee Club performs a diverse repertoire 
            that includes classical masterpieces, spirituals, contemporary compositions, and works by 
            African American composers. The ensemble regularly tours domestically and internationally, 
            showcasing the musical talents of Spelman women while embodying the college's commitment 
            to academic and artistic excellence.
          </p>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Full Biography (PDF)
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="images">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="images">
            <Image className="h-4 w-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="mt-6">
          <PressKitMediaGrid />
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <PressKitDocuments />
        </TabsContent>
      </Tabs>
    </div>
  );
}
