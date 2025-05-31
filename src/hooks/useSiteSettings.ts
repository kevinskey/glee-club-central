
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  updated_by?: string;
  updated_at: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }

      // Convert array to key-value object
      const settingsMap = (data || []).reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);

      setSettings(settingsMap);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(errorMessage);
      toast.error(errorMessage);
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

      if (error) {
        console.error('Error updating setting:', error);
        throw error;
      }

      setSettings(prev => ({ ...prev, [key]: value }));
      toast.success('Setting updated successfully');
      
      return { success: true };
    } catch (err) {
      console.error('Error updating setting:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update setting';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSetting,
    refetch: fetchSettings
  };
};
