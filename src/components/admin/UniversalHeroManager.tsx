
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Image, Layout, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SlideSection {
  id: string;
  name: string;
  description: string;
  location: string;
  slide_count: number;
}

const SLIDE_SECTIONS = [
  {
    id: "homepage-main",
    name: "Homepage Slides",
    description: "Main slide section on the homepage",
    location: "HomePage - Primary Banner"
  },
  {
    id: "about-slides",
    name: "About Page Slides",
    description: "Slide section for the about page",
    location: "About Page"
  },
  {
    id: "events-slides",
    name: "Events Page Slides", 
    description: "Slide section for the events page",
    location: "Events Page"
  },
  {
    id: "contact-slides",
    name: "Contact Page Slides",
    description: "Slide section for the contact page", 
    location: "Contact Page"
  },
  {
    id: "store-slides",
    name: "Store Page Slides",
    description: "Slide section for the store page",
    location: "Store Page"
  }
];

export function UniversalHeroManager() {
  const [activeSection, setActiveSection] = useState("homepage-main");
  const [sectionStats, setSectionStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSectionStats();
  }, []);

  const fetchSectionStats = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 UniversalSlideManager: Fetching section stats...');
      
      const stats: Record<string, number> = {};
      
      for (const section of SLIDE_SECTIONS) {
        const { count, error } = await supabase
          .from('slide_designs')
          .select('*', { count: 'exact', head: true })
          .eq('section_id', section.id)
          .eq('is_active', true);

        if (error) {
          console.error(`🎯 Error fetching stats for ${section.id}:`, error);
          stats[section.id] = 0;
        } else {
          stats[section.id] = count || 0;
          console.log(`🎯 Section ${section.id}: ${count} active slides`);
        }
      }
      
      setSectionStats(stats);
      console.log('🎯 UniversalSlideManager: Final stats:', stats);
    } catch (error) {
      console.error('🎯 Error fetching section stats:', error);
      toast.error('Failed to load section statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const createQuickSlide = async (sectionId: string) => {
    try {
      setIsLoading(true);
      console.log(`🎯 Creating quick slide for section: ${sectionId}`);
      
      const sectionName = SLIDE_SECTIONS.find(s => s.id === sectionId)?.name || 'Section';
      
      const slideData = {
        section_id: sectionId,
        title: `New ${sectionName} Slide`,
        description: 'Edit this slide to customize your content and appearance.',
        design_data: {
          textElements: [{
            id: '1',
            text: `Welcome to ${sectionName}`,
            position: { x: 50, y: 50 },
            style: { fontSize: '2rem', fontWeight: 'bold', color: 'white' }
          }]
        },
        is_active: true,
        display_order: sectionStats[sectionId] || 0
      };
      
      console.log(`🎯 Inserting slide data:`, slideData);

      const { data: newSlide, error } = await supabase
        .from('slide_designs')
        .insert(slideData)
        .select()
        .single();

      if (error) {
        console.error(`🎯 Error inserting slide for ${sectionId}:`, error);
        throw error;
      }
      
      console.log(`🎯 Successfully created new slide:`, newSlide);
      toast.success(`Quick slide created for ${sectionName}`);
      
      await fetchSectionStats();
      
    } catch (error) {
      console.error("🎯 Error creating quick slide:", error);
      toast.error(`Failed to create quick slide: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getSectionDisplayName = (sectionId: string) => {
    const section = SLIDE_SECTIONS.find(s => s.id === sectionId);
    return section?.name || sectionId;
  };

  if (isLoading && Object.keys(sectionStats).length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading slide manager...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Universal Slide Section Manager
          </CardTitle>
          <CardDescription>
            Manage all slide sections across your entire application from one central location. 
            Create, edit, and organize slides for different pages and sections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
            {/* Left Column - Slide Sections List */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Slide Sections</h3>
                <Button 
                  onClick={fetchSectionStats} 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                {SLIDE_SECTIONS.map((section) => {
                  const slideCount = sectionStats[section.id] || 0;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <Card 
                      key={section.id} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        isActive 
                          ? 'ring-2 ring-primary bg-primary/5 shadow-sm' 
                          : 'hover:bg-muted/30'
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">{section.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{section.description}</p>
                            <p className="text-xs text-muted-foreground font-mono">{section.location}</p>
                          </div>
                          <Badge 
                            variant={slideCount > 0 ? "default" : "secondary"} 
                            className="text-xs ml-2 shrink-0"
                          >
                            {slideCount}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-6 flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              createQuickSlide(section.id);
                            }}
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Slides Manager */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  {getSectionDisplayName(activeSection)} Slides
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage slides for the selected section. Changes will be reflected on the live website.
                </p>
              </div>
              
              <div className="text-center text-muted-foreground py-8">
                <Image className="h-8 w-8 mx-auto mb-2" />
                <p>Slide management interface will be implemented here.</p>
                <p className="text-xs">Select a section to view and edit slides.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
