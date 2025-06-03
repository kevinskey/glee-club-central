import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { HeroSlidesManager } from "./HeroSlidesManager";
import { HeroGlobalSettings } from "./HeroGlobalSettings";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Image, Layout, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
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
      console.log('🎯 UniversalHeroManager: Fetching section stats...');
      
      const stats: Record<string, number> = {};
      
      for (const section of HERO_SECTIONS) {
        const { count, error } = await supabase
          .from('hero_slides')
          .select('*', { count: 'exact', head: true })
          .eq('section_id', section.id)
          .eq('visible', true);

        if (error) {
          console.error(`🎯 Error fetching stats for ${section.id}:`, error);
          stats[section.id] = 0;
        } else {
          stats[section.id] = count || 0;
          console.log(`🎯 Section ${section.id}: ${count} visible slides`);
        }
      }
      
      setSectionStats(stats);
      console.log('🎯 UniversalHeroManager: Final stats:', stats);
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
      
      // Get the next order number for this section
      const { data: existingSlides, error: fetchError } = await supabase
        .from('hero_slides')
        .select('slide_order')
        .eq('section_id', sectionId)
        .order('slide_order', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error(`🎯 Error fetching existing slides for ${sectionId}:`, fetchError);
        throw fetchError;
      }

      const nextOrder = existingSlides && existingSlides.length > 0 
        ? (existingSlides[0].slide_order || 0) + 1 
        : 0;

      const sectionName = HERO_SECTIONS.find(s => s.id === sectionId)?.name || 'Section';
      
      console.log(`🎯 Creating slide with order ${nextOrder} for ${sectionName}`);
      
      const slideData = {
        section_id: sectionId,
        media_type: 'image',
        title: `New ${sectionName} Slide`,
        description: 'Edit this slide to customize your hero section content and appearance.',
        text_position: 'center',
        text_alignment: 'center',
        visible: true, // Make slides visible by default
        slide_order: nextOrder
      };
      
      console.log(`🎯 Inserting slide data:`, slideData);

      const { data: newSlide, error } = await supabase
        .from('hero_slides')
        .insert(slideData)
        .select()
        .single();

      if (error) {
        console.error(`🎯 Error inserting slide for ${sectionId}:`, error);
        throw error;
      }
      
      console.log(`🎯 Successfully created new slide:`, newSlide);
      toast.success(`Quick slide created for ${sectionName}`);
      
      // Force refresh stats
      await fetchSectionStats();
      
      // If this is the currently active section, trigger a refresh in the slides manager
      if (sectionId === activeSection) {
        console.log(`🎯 Triggering refresh for active section: ${sectionId}`);
        // This will trigger a re-render of the HeroSlidesManager component
        setActiveSection('');
        setTimeout(() => setActiveSection(sectionId), 100);
      }
      
    } catch (error) {
      console.error("🎯 Error creating quick slide:", error);
      toast.error(`Failed to create quick slide: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAllSlidesVisibility = async (sectionId: string, visible: boolean) => {
    try {
      setIsLoading(true);
      console.log(`🎯 Setting all slides visibility to ${visible} for section: ${sectionId}`);
      
      const { error } = await supabase
        .from('hero_slides')
        .update({ visible })
        .eq('section_id', sectionId);

      if (error) throw error;
      
      const sectionName = HERO_SECTIONS.find(s => s.id === sectionId)?.name || 'Section';
      toast.success(`All slides ${visible ? 'enabled' : 'disabled'} for ${sectionName}`);
      await fetchSectionStats();
    } catch (error) {
      console.error("🎯 Error toggling slides visibility:", error);
      toast.error("Failed to update slide visibility");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSection = (sectionId: string) => {
    console.log(`🎯 Switching to manage section: ${sectionId}`);
    setActiveSection(sectionId);
    const sectionName = HERO_SECTIONS.find(s => s.id === sectionId)?.name || 'section';
    toast.success(`Switched to ${sectionName} management`);
  };

  const getSectionDisplayName = (sectionId: string) => {
    const section = HERO_SECTIONS.find(s => s.id === sectionId);
    return section?.name || sectionId;
  };

  const debugSection = async (sectionId: string) => {
    try {
      console.log(`🔍 DEBUGGING SECTION: ${sectionId}`);
      
      // Fetch all slides for this section (including hidden ones)
      const { data: allSlides, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('section_id', sectionId)
        .order('slide_order');

      if (slidesError) {
        console.error('🔍 Error fetching slides:', slidesError);
        return;
      }

      console.log(`🔍 Total slides in ${sectionId}:`, allSlides?.length || 0);
      allSlides?.forEach((slide, index) => {
        console.log(`🔍 Slide ${index + 1}:`, {
          id: slide.id,
          title: slide.title,
          visible: slide.visible,
          media_id: slide.media_id,
          slide_order: slide.slide_order,
          section_id: slide.section_id
        });
      });

      // Check media library
      const { data: mediaFiles, error: mediaError } = await supabase
        .from('media_library')
        .select('id, title, file_url, is_public')
        .eq('is_public', true);

      if (mediaError) {
        console.error('🔍 Error fetching media:', mediaError);
      } else {
        console.log(`🔍 Public media files available:`, mediaFiles?.length || 0);
      }

      // Check hero_settings table
      const { data: settings, error: settingsError } = await supabase
        .from('hero_settings')
        .select('*')
        .limit(1);

      if (settingsError) {
        console.error('🔍 Error fetching hero settings:', settingsError);
      } else {
        console.log(`🔍 Hero settings:`, settings);
      }

      toast.info(`Debug info logged to console for ${getSectionDisplayName(sectionId)}`);
    } catch (error) {
      console.error('🔍 Debug error:', error);
    }
  };

  if (isLoading && Object.keys(sectionStats).length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading hero manager...</span>
      </div>
    );
  }

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
          <Tabs defaultValue="slides" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="slides" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Manage Slides
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Global Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="slides" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
                {/* Left Column - Hero Sections List */}
                <div className="lg:col-span-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Hero Sections</h3>
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
                    {HERO_SECTIONS.map((section) => {
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
                          onClick={() => handleManageSection(section.id)}
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
                              
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs px-2 py-1 h-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  debugSection(section.id);
                                }}
                                disabled={isLoading}
                              >
                                🔍
                              </Button>
                              
                              {slideCount > 0 && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs px-2 py-1 h-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleAllSlidesVisibility(section.id, true);
                                    }}
                                    disabled={isLoading}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs px-2 py-1 h-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleAllSlidesVisibility(section.id, false);
                                    }}
                                    disabled={isLoading}
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

                {/* Right Column - Slides Manager */}
                <div className="lg:col-span-2">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">
                      {getSectionDisplayName(activeSection)} Slides
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Manage slides for the selected hero section. Changes will be reflected on the live website.
                    </p>
                  </div>
                  
                  {activeSection && (
                    <HeroSlidesManager 
                      key={activeSection} // Force re-render when section changes
                      sectionId={activeSection}
                      sectionName={getSectionDisplayName(activeSection)}
                      onUpdate={fetchSectionStats}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <HeroGlobalSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
