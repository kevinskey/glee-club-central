
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Layout, Settings, Sliders, Eye, TestTube, Plus } from 'lucide-react';
import { SlideDesignManager } from './slideDesign/SlideDesignManager';
import { TopSliderManager } from './TopSliderManager';
import { SliderTestPreview } from './SliderTestPreview';

export function SliderAdminConsole() {
  const [activeTab, setActiveTab] = useState('overview');
  const [previewMode, setPreviewMode] = useState(false);

  const handleCreateSlide = () => {
    setActiveTab('designs');
  };

  const handleManageTopSlider = () => {
    setActiveTab('top-slider');
  };

  const handleRunTests = () => {
    setActiveTab('test');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Unified Slider Management Console
            <Badge variant="secondary" className="ml-2">Admin Only</Badge>
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Complete slider management system for all website sections
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              {previewMode ? <Settings /> : <Eye />}
              {previewMode ? 'Admin Mode' : 'Preview Mode'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {previewMode ? (
        <SliderTestPreview onExitPreview={() => setPreviewMode(false)} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="designs" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Custom Designs
                </TabsTrigger>
                <TabsTrigger value="top-slider" className="flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  Top Slider
                </TabsTrigger>
                <TabsTrigger value="test" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Test & Preview
                </TabsTrigger>
              </TabsList>

              <Separator className="my-6" />

              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Slider Management Overview</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Centralized control for all slider components across your website. Manage custom slide designs, 
                      top slider content, and test functionality from one unified interface.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Custom Designs Card */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCreateSlide}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                            <Layout className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <CardTitle className="text-base">Custom Slide Designs</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                          Create and manage custom slide designs with advanced layout options, text elements, and media backgrounds.
                        </p>
                        <Button size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Design
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Top Slider Card */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleManageTopSlider}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                            <Sliders className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <Badge variant="secondary">Live</Badge>
                        </div>
                        <CardTitle className="text-base">Top Slider Items</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                          Manage the top slider items that appear on the homepage and other key sections of the website.
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Items
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Test & Preview Card */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleRunTests}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
                            <TestTube className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <Badge variant="outline">Testing</Badge>
                        </div>
                        <CardTitle className="text-base">Test & Preview</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                          Test all slider functionality and preview how they appear on the live site with real data.
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Run Tests
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">QUICK STATS</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Custom Designs</span>
                          <Badge variant="secondary">3</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Top Slider Items</span>
                          <Badge variant="secondary">5</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Test Run</span>
                          <span className="text-muted-foreground">2 hours ago</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">RECENT ACTIVITY</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-muted-foreground">Custom slide "Welcome" updated</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-muted-foreground">Top slider item added</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="text-muted-foreground">System tests passed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="designs" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Custom Slide Designs</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create and manage custom slide designs with advanced layout options, text elements, and media backgrounds.
                    </p>
                  </div>
                  <SlideDesignManager />
                </div>
              </TabsContent>

              <TabsContent value="top-slider" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Top Slider Items</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage the top slider items that appear on the homepage and other sections.
                    </p>
                  </div>
                  <TopSliderManager />
                </div>
              </TabsContent>

              <TabsContent value="test" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Test & Preview</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Test all slider functionality and preview how they appear on the live site.
                    </p>
                  </div>
                  <SliderTestPreview />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
