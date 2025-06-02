
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HeroSettings {
  id: string;
  animation_style: 'fade' | 'slide' | 'zoom' | 'none';
  scroll_interval: number;
  pause_on_hover: boolean;
  loop: boolean;
}

export function HeroGlobalSettings() {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('hero_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching hero settings:', error);
      toast.error('Failed to load hero settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('hero_settings')
        .update({
          animation_style: settings.animation_style,
          scroll_interval: settings.scroll_interval,
          pause_on_hover: settings.pause_on_hover,
          loop: settings.loop,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast.success('Hero settings saved successfully');
    } catch (error) {
      console.error('Error saving hero settings:', error);
      toast.error('Failed to save hero settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Hero Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Global Hero Settings
        </CardTitle>
        <CardDescription>
          Configure slideshow behavior and animation settings for all hero slides.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Animation Style</Label>
            <Select 
              value={settings.animation_style} 
              onValueChange={(value) => setSettings(prev => prev ? { ...prev, animation_style: value as any } : null)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scroll_interval">Scroll Interval (milliseconds)</Label>
            <Input
              id="scroll_interval"
              type="number"
              min="1000"
              max="30000"
              step="500"
              value={settings.scroll_interval}
              onChange={(e) => setSettings(prev => prev ? { ...prev, scroll_interval: parseInt(e.target.value) || 5000 } : null)}
            />
            <p className="text-xs text-muted-foreground">
              Time between automatic slide transitions (1000-30000ms)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Pause on Hover</Label>
              <div className="text-sm text-muted-foreground">
                Pause slideshow when user hovers over it
              </div>
            </div>
            <Switch
              checked={settings.pause_on_hover}
              onCheckedChange={(checked) => setSettings(prev => prev ? { ...prev, pause_on_hover: checked } : null)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Loop Slideshow</Label>
              <div className="text-sm text-muted-foreground">
                Restart from first slide after reaching the end
              </div>
            </div>
            <Switch
              checked={settings.loop}
              onCheckedChange={(checked) => setSettings(prev => prev ? { ...prev, loop: checked } : null)}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
