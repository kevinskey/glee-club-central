
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Layout, Settings, Sliders, Eye, TestTube } from 'lucide-react';
import { SlideDesignManager } from './slideDesign/SlideDesignManager';
import { TopSliderManager } from './TopSliderManager';
import { SliderTestPreview } from './SliderTestPreview';

export function SliderAdminConsole() {
  const [activeTab, setActiveTab] = useState('designs');
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Slider Management Console
            <Badge variant="secondary" className="ml-2">Admin Only</Badge>
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Comprehensive slider management for the entire website
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
              <TabsList className="grid w-full grid-cols-3">
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
