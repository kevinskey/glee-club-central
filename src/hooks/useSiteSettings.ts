
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SiteSettings {
  [key: string]: any;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;

      const settingsObj: SiteSettings = {};
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });

      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load site settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => ({
        ...prev,
        [key]: value
      }));

      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
      return false;
    }
  };

  return {
    settings,
    updateSetting,
    loading,
    refetch: fetchSettings
  };
};
