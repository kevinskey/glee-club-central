
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { HeroSlidesManager } from "./HeroSlidesManager";
import { HeroGlobalSettings } from "./HeroGlobalSettings";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Image, Layout } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HeroSection {
  id: string;
  name: string;
  description: string;
  location: string;
  slide_count: number;
}

const HERO_SECTIONS = [
  {
    id: "homepage-main",
    name: "Homepage Hero",
    description: "Main hero section on the homepage",
    location: "HomePage - Primary Banner"
  },
  {
    id: "homepage-enhanced", 
    name: "Enhanced Hero",
    description: "Enhanced hero section with advanced features",
    location: "HomePage - Enhanced Section"
  },
  {
    id: "about-hero",
    name: "About Page Hero",
    description: "Hero section for the about page",
    location: "About Page"
  },
  {
    id: "events-hero",
    name: "Events Page Hero", 
    description: "Hero section for the events page",
    location: "Events Page"
  },
  {
    id: "contact-hero",
    name: "Contact Page Hero",
    description: "Hero section for the contact page", 
    location: "Contact Page"
  },
  {
    id: "store-hero",
    name: "Store Page Hero",
    description: "Hero section for the store page",
    location: "Store Page"
  },
  {
    id: "calendar-hero",
    name: "Calendar Page Hero",
    description: "Hero section for the calendar page",
    location: "Calendar Page"
  }
];

export function UniversalHeroManager() {
  const [activeSection, setActiveSection] = useState("homepage-main");
  const [sectionStats, setSectionStats] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchSectionStats();
  }, []);

  const fetchSectionStats = async () => {
    try {
      const stats: Record<string, number> = {};
      
      for (const section of HERO_SECTIONS) {
        const { count, error } = await supabase
          .from('hero_slides')
          .select('*', { count: 'exact', head: true })
          .eq('section_id', section.id)
          .eq('visible', true);

        if (error) throw error;
        stats[section.id] = count || 0;
      }
      
      setSectionStats(stats);
    } catch (error) {
      console.error('Error fetching section stats:', error);
    }
  };

  const createQuickSlide = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .insert({
          section_id: sectionId,
          media_type: 'image',
          title: `New ${HERO_SECTIONS.find(s => s.id === sectionId)?.name} Slide`,
          description: 'Edit this slide to customize your hero section.',
          text_position: 'center',
          text_alignment: 'center',
          visible: false,
          slide_order: 0
        });

      if (error) throw error;
      
      toast.success("Quick slide created successfully");
      await fetchSectionStats();
    } catch (error) {
      console.error("Error creating quick slide:", error);
      toast.error("Failed to create quick slide");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Universal Hero Section Manager
          </CardTitle>
          <CardDescription>
            Manage all hero sections across your entire application from one central location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Hero Sections Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {HERO_SECTIONS.map((section) => (
                  <Card 
                    key={section.id} 
                    className={`cursor-pointer transition-colors ${
                      activeSection === section.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{section.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {sectionStats[section.id] || 0} slides
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{section.description}</p>
                      <p className="text-xs text-muted-foreground font-mono">{section.location}</p>
                      <div className="flex gap-1 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-7 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSection(section.id);
                          }}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-7 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            createQuickSlide(section.id);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Quick Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
              {HERO_SECTIONS.map((section) => (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id}
                  className="text-xs"
                >
                  <div className="flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    <span className="hidden sm:inline">{section.name.split(' ')[0]}</span>
                    {sectionStats[section.id] > 0 && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        {sectionStats[section.id]}
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {HERO_SECTIONS.map((section) => (
              <TabsContent key={section.id} value={section.id} className="space-y-6">
                <div className="border-l-4 border-primary pl-4 mb-6">
                  <h3 className="text-lg font-semibold">{section.name}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    Location: {section.location}
                  </p>
                </div>
                
                <HeroSlidesManager sectionId={section.id} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <HeroGlobalSettings />
    </div>
  );
}
