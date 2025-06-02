import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsTickerSettingsPage() {
  const { user, isLoading } = useAuth();
  const [settings, setSettings] = useState({
    enabled: true,
    message: '',
    speed: 50,
    color: '#000000'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching existing ticker text from a database or API
    const fetchSettings = async () => {
      // Replace this with your actual data fetching logic
      await new Promise(resolve => setTimeout(resolve, 500));
      setSettings({
        enabled: true,
        message: 'Breaking News: Glee Club wins national award!',
        speed: 50,
        color: '#000000'
      });
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'news_ticker',
          value: settings,
          updated_by: user?.id
        });

      if (error) throw error;
      toast.success('News ticker settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            News Ticker Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
            />
            <Label htmlFor="enabled">Enable News Ticker</Label>
          </div>

          <div>
            <Label htmlFor="message">Ticker Message</Label>
            <Textarea
              id="message"
              value={settings.message}
              onChange={(e) => setSettings({...settings, message: e.target.value})}
              placeholder="Enter the news ticker message"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="speed">Speed (pixels per second)</Label>
            <Input
              id="speed"
              type="number"
              value={settings.speed}
              onChange={(e) => setSettings({...settings, speed: parseInt(e.target.value)})}
              min="10"
              max="200"
            />
          </div>

          <div>
            <Label htmlFor="color">Text Color</Label>
            <Input
              id="color"
              type="color"
              value={settings.color}
              onChange={(e) => setSettings({...settings, color: e.target.value})}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
