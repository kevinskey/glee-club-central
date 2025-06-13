
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SlideDesignManager } from './slideDesign/SlideDesignManager';
import { Layout, Sparkles } from 'lucide-react';

export function UnifiedSlideManager() {
  const [activeTab, setActiveTab] = useState('design-studio');

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-orange-500">
                  <Layout className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  Advanced Slide Design Studio
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional slide design tools with advanced features and templates
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 bg-slate-100 dark:bg-slate-700">
              <TabsTrigger value="design-studio" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Design Studio
                <Badge variant="outline" className="ml-1 text-xs">
                  Advanced
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="design-studio" className="mt-6">
              <SlideDesignManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
