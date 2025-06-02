
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { HeroSlidesManager } from "./HeroSlidesManager";
import { HeroGlobalSettings } from "./HeroGlobalSettings";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Image, Layout, Eye, EyeOff } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSectionStats();
  }, []);

  const fetchSectionStats = async () => {
    try {
      setIsLoading(true);
      const stats: Record<string, number> = {};
      
      for (const section of HERO_SECTIONS) {
        const { count, error } = await supabase
          .from('hero_slides')
          .select('*', { count: 'exact', head: true })
          .eq('section_id', section.id)
          .eq('visible', true);

        if (error) {
          console.error(`Error fetching stats for ${section.id}:`, error);
          stats[section.id] = 0;
        } else {
          stats[section.id] = count || 0;
        }
      }
      
      setSectionStats(stats);
    } catch (error) {
      console.error('Error fetching section stats:', error);
      toast.error('Failed to load section statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const createQuickSlide = async (sectionId: string) => {
    try {
      setIsLoading(true);
      
      // Get the next order number for this section
      const { data: existingSlides, error: fetchError } = await supabase
        .from('hero_slides')
        .select('slide_order')
        .eq('section_id', sectionId)
        .order('slide_order', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      const nextOrder = existingSlides && existingSlides.length > 0 
        ? (existingSlides[0].slide_order || 0) + 1 
        : 0;

      const sectionName = HERO_SECTIONS.find(s => s.id === sectionId)?.name || 'Section';
      
      const { error } = await supabase
        .from('hero_slides')
        .insert({
          section_id: sectionId,
          media_type: 'image',
          title: `New ${sectionName} Slide`,
          description: 'Edit this slide to customize your hero section content and appearance.',
          text_position: 'center',
          text_alignment: 'center',
          visible: false,
          slide_order: nextOrder
        });

      if (error) throw error;
      
      toast.success(`Quick slide created for ${sectionName}`);
      await fetchSectionStats();
    } catch (error) {
      console.error("Error creating quick slide:", error);
      toast.error("Failed to create quick slide");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAllSlidesVisibility = async (sectionId: string, visible: boolean) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('hero_slides')
        .update({ visible })
        .eq('section_id', sectionId);

      if (error) throw error;
      
      const sectionName = HERO_SECTIONS.find(s => s.id === sectionId)?.name || 'Section';
      toast.success(`All slides ${visible ? 'enabled' : 'disabled'} for ${sectionName}`);
      await fetchSectionStats();
    } catch (error) {
      console.error("Error toggling slides visibility:", error);
      toast.error("Failed to update slide visibility");
    } finally {
      setIsLoading(false);
    }
  };

  const getSectionDisplayName = (sectionId: string) => {
    const section = HERO_SECTIONS.find(s => s.id === sectionId);
    return section?.name || sectionId;
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
            Create, edit, and organize hero slides for different pages and sections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Hero Sections Overview</h3>
                <Button 
                  onClick={fetchSectionStats} 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Refreshing..." : "Refresh Stats"}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {HERO_SECTIONS.map((section) => {
                  const slideCount = sectionStats[section.id] || 0;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <Card 
                      key={section.id} 
                      className={`cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? 'ring-2 ring-primary bg-primary/5 shadow-md' 
                          : 'hover:bg-muted/50 hover:shadow-sm'
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{section.name}</h4>
                          <Badge 
                            variant={slideCount > 0 ? "default" : "secondary"} 
                            className="text-xs"
                          >
                            {slideCount} slide{slideCount !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{section.description}</p>
                        <p className="text-xs text-muted-foreground font-mono mb-3">{section.location}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          <Button 
                            size="sm" 
                            variant={isActive ? "default" : "outline"}
                            className="text-xs h-7 px-2 flex-1"
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
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                          
                          {slideCount > 0 && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-7 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAllSlidesVisibility(section.id, true);
                                }}
                                disabled={isLoading}
                                title="Enable all slides"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-7 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAllSlidesVisibility(section.id, false);
                                }}
                                disabled={isLoading}
                                title="Disable all slides"
                              >
                                <EyeOff className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
              {HERO_SECTIONS.map((section) => (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id}
                  className="text-xs relative"
                >
                  <div className="flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    <span className="hidden sm:inline truncate">
                      {section.name.split(' ')[0]}
                    </span>
                    {sectionStats[section.id] > 0 && (
                      <Badge variant="secondary" className="text-xs ml-1 h-4 px-1">
                        {sectionStats[section.id]}
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {HERO_SECTIONS.map((section) => (
              <TabsContent key={section.id} value={section.id} className="space-y-6">
                <div className="border-l-4 border-primary pl-4 mb-6 bg-muted/30 p-4 rounded-r-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{section.name}</h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        Location: {section.location}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => createQuickSlide(section.id)}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Quick Add Slide
                      </Button>
                    </div>
                  </div>
                </div>
                
                <HeroSlidesManager 
                  sectionId={section.id} 
                  sectionName={section.name}
                  onUpdate={fetchSectionStats}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <HeroGlobalSettings />
    </div>
  );
}
