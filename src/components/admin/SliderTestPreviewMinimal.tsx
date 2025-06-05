
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomSlideRenderer } from '@/components/landing/CustomSlideRenderer';
import { Eye, Settings } from 'lucide-react';

interface SliderTestPreviewMinimalProps {
  onExitPreview?: () => void;
}

export function SliderTestPreviewMinimal({ onExitPreview }: SliderTestPreviewMinimalProps) {
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Slider Preview Console
            </CardTitle>
            {onExitPreview && (
              <Button variant="outline" size="sm" onClick={onExitPreview}>
                <Settings className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Live Slider Preview</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                    >
                      Desktop
                    </Button>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                    >
                      Mobile
                    </Button>
                  </div>
                </div>
                
                <div className={`border rounded-lg overflow-hidden ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                  <div className="bg-muted p-2 text-center text-sm text-muted-foreground">
                    Preview Mode: {previewMode} | Live Data
                  </div>
                  <div className={previewMode === 'mobile' ? 'scale-75 origin-top' : ''}>
                    <CustomSlideRenderer />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
