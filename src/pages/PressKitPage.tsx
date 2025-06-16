
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { ExternalLink, FileText, Image, Award, Calendar, Users, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PressKitMediaGrid } from '@/components/media/PressKitMediaGrid';
import { PressKitDocuments } from '@/components/media/PressKitDocuments';

const PressKitPage: React.FC = () => {
  const achievements = [
    "Over 100 years of musical excellence",
    "Performances at prestigious venues worldwide",
    "Alumni include Grammy winners and Broadway stars",
    "Regular performers at Atlanta's finest cultural events",
    "Featured in national and international media"
  ];

  const quickFacts = [
    { label: "Founded", value: "1924" },
    { label: "Members", value: "60-80 students" },
    { label: "Genres", value: "Classical, Spiritual, Contemporary" },
    { label: "Director", value: "Dr. Kevin Johnson" },
    { label: "Home", value: "Atlanta, Georgia" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Press Kit"
        description="Official press resources for the Spelman College Glee Club"
        icon={<FileText className="h-6 w-6" />}
      />
      
      {/* Quick Facts Banner */}
      <Card className="mt-8 bg-gradient-to-r from-glee-spelman/10 to-orange-500/10 border-glee-spelman/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {quickFacts.map((fact, index) => (
              <div key={index}>
                <div className="text-2xl font-bold text-glee-spelman">{fact.value}</div>
                <div className="text-sm text-muted-foreground">{fact.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="about" className="mt-8">
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="about" className="flex items-center gap-1">
            <Music className="w-4 h-4" />
            <span>About</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-1">
            <Image className="w-4 h-4" />
            <span>Media</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Contact</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Mission & History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-glee-spelman" />
                  Mission & History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The Spelman College Glee Club, founded in 1924, is one of the most prestigious collegiate choral ensembles in the United States. For nearly a century, we have maintained our commitment to musical excellence while celebrating the rich traditions of African American culture and music.
                </p>
                <p className="text-muted-foreground">
                  Our mission is <em>"To Amaze and Inspire"</em> through the transformative power of music, fostering sisterhood, scholarship, and service within the Spelman College community and beyond.
                </p>
                <div className="pt-2">
                  <Badge variant="secondary" className="bg-glee-spelman/10 text-glee-spelman">
                    Est. 1924
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Notable Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-500" />
                  Notable Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-glee-spelman mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Repertoire & Performance Style */}
          <Card>
            <CardHeader>
              <CardTitle>Musical Excellence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Spelman College Glee Club performs a diverse repertoire spanning classical masterworks, traditional Negro spirituals, contemporary gospel, jazz arrangements, and modern popular music. Our performances showcase the versatility and vocal excellence of Spelman women while honoring our cultural heritage.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="font-semibold text-glee-spelman">Classical</div>
                  <div className="text-xs text-muted-foreground">Masterworks & Art Songs</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="font-semibold text-glee-spelman">Spirituals</div>
                  <div className="text-xs text-muted-foreground">Traditional & Arranged</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="font-semibold text-glee-spelman">Gospel</div>
                  <div className="text-xs text-muted-foreground">Contemporary & Traditional</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="font-semibold text-glee-spelman">Modern</div>
                  <div className="text-xs text-muted-foreground">Pop & Jazz Arrangements</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Leadership */}
          <Card>
            <CardHeader>
              <CardTitle>Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-semibold">Dr. Kevin Johnson</h4>
                  <p className="text-sm text-muted-foreground">Director of Choral Activities</p>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Leading the Glee Club with over 15 years of choral excellence and innovation.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-semibold">Student Executive Board</h4>
                  <p className="text-sm text-muted-foreground">Elected student leadership</p>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Comprising President, Vice President, Secretary, Treasurer, and department heads.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Official Images & Media</h2>
            <p className="text-muted-foreground mb-6">
              High-resolution images approved for editorial and promotional use. When using these images, 
              please credit: "Courtesy of Spelman College Glee Club."
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
                title="Logos & Branding Assets" 
                maxItems={4} 
              />
              
              <Separator className="my-8" />
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Media Usage Guidelines</h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li>• All images are provided for editorial and promotional use only</li>
                    <li>• Credit required: "Courtesy of Spelman College Glee Club"</li>
                    <li>• Commercial use requires written permission</li>
                    <li>• Images may not be altered without permission</li>
                    <li>• Please send copies of published materials to our press contact</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Press Documents & Resources</h2>
            <p className="text-muted-foreground mb-6">
              Download official press releases, fact sheets, biographies, and program notes.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-glee-spelman" />
                  Press Releases & Media Kits
                </h3>
                <PressKitDocuments bucketName="media-library" folder="press-releases" />
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-glee-spelman" />
                  Biographies & Program Notes
                </h3>
                <PressKitDocuments bucketName="media-library" folder="biographies" />
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Standard Press Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Quick Facts Sheet</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Essential information about the Glee Club including history, achievements, and current activities.
                    </p>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Standard Bio</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      200-word professional biography suitable for programs and press releases.
                    </p>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Media Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-glee-spelman" />
                  Media Relations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Press Inquiries</h4>
                  <p className="text-sm text-muted-foreground">For interviews, press releases, and media requests</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <strong>Email:</strong> press@spelmanglee.org
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> (404) 270-5777
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold">Performance Bookings</h4>
                  <p className="text-sm text-muted-foreground">For concert bookings and performance requests</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <strong>Email:</strong> bookings@spelmanglee.org
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> (404) 270-5777
                    </p>
                  </div>
                </div>

                <Button className="w-full bg-glee-spelman hover:bg-glee-spelman/90" asChild>
                  <a href="mailto:press@spelmanglee.org">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contact Media Team
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* General Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Spelman College Glee Club</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>350 Spelman Lane SW</p>
                    <p>Atlanta, GA 30314</p>
                    <p>United States</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold">Website & Social Media</h4>
                  <div className="mt-2 space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <a href="https://spelmangleeclub.org" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        spelmangleeclub.org
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <a href="https://instagram.com/spelmanglee" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        @spelmanglee
                      </a>
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Response Time
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    We typically respond to media inquiries within 24-48 hours during business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Press Release Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Press Release Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">What We Provide</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• High-resolution performance photos</li>
                    <li>• Director and student interviews</li>
                    <li>• Concert programs and setlists</li>
                    <li>• Historical information and archives</li>
                    <li>• Audio/video samples (with permission)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Media Preferences</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 48-hour advance notice preferred</li>
                    <li>• Written interview questions appreciated</li>
                    <li>• Photo/video requests require approval</li>
                    <li>• Please share final articles with us</li>
                    <li>• Social media tags welcome</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PressKitPage;
