
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { UnifiedText } from '@/components/ui/unified-text';
import { useHeroSystem } from '@/hooks/useHeroSystem';
import { Eye, EyeOff, Settings, Plus } from 'lucide-react';

interface HeroManagerProps {
  sectionId?: string;
  showControls?: boolean;
}

export function HeroManager({ 
  sectionId = 'homepage-main', 
  showControls = false 
}: HeroManagerProps) {
  const { slides, loading, config, updateConfig, hasSlides, isUsingFallback } = useHeroSystem(sectionId);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Hero System Status
          </CardTitle>
          {isUsingFallback && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Using Fallback
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <UnifiedText variant="h4" className="text-2xl font-bold">
              {slides.length}
            </UnifiedText>
            <UnifiedText variant="small" color="muted">Total Slides</UnifiedText>
          </div>
          
          <div className="text-center">
            <UnifiedText variant="h4" className="text-2xl font-bold text-green-600">
              {slides.filter(s => s.visible).length}
            </UnifiedText>
            <UnifiedText variant="small" color="muted">Active</UnifiedText>
          </div>
          
          <div className="text-center">
            <UnifiedText variant="h4" className="text-2xl font-bold">
              {config.interval / 1000}s
            </UnifiedText>
            <UnifiedText variant="small" color="muted">Interval</UnifiedText>
          </div>
          
          <div className="text-center">
            <Badge variant={config.autoAdvance ? "default" : "secondary"}>
              {config.autoAdvance ? "Auto" : "Manual"}
            </Badge>
            <UnifiedText variant="small" color="muted">Mode</UnifiedText>
          </div>
        </div>

        {showControls && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <UnifiedText variant="body">Auto Advance</UnifiedText>
              <Switch
                checked={config.autoAdvance}
                onCheckedChange={(checked) => updateConfig({ autoAdvance: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <UnifiedText variant="body">Show Indicators</UnifiedText>
              <Switch
                checked={config.showIndicators}
                onCheckedChange={(checked) => updateConfig({ showIndicators: checked })}
              />
            </div>
          </div>
        )}

        {!hasSlides && (
          <div className="text-center py-4 border-t">
            <UnifiedText variant="body" color="muted" className="mb-3">
              No active slides found. Using fallback content.
            </UnifiedText>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Hero Slides
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
