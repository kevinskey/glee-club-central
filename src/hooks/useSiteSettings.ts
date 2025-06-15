import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SiteSettings {
  [key: string]: any;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    // General settings - activated
    site_name: 'Spelman College Glee Club',
    site_description: 'To Amaze and Inspire - The official home of the Spelman College Glee Club',
    contact_email: 'admin@spelmangleeclub.com',
    maintenance_mode: false,
    allow_registration: true,
    
    // User management - activated
    require_email_verification: true,
    default_user_role: 'member',
    auto_approve_users: false,
    allow_profile_updates: true,
    
    // Security settings - activated
    enable_two_factor: true,
    session_timeout: 24,
    max_login_attempts: 5,
    password_min_length: 8,
    require_password_complexity: true,
    enable_audit_logging: true,
    
    // System settings - activated
    enable_debug_mode: false,
    enable_caching: true,
    cache_expiry: 3600,
    backup_frequency: 'daily',
    enable_performance_monitoring: true,
    max_file_upload_size: 10,
    
    // News ticker - activated
    ticker_settings: {
      enabled: true,
      source: 'google_news_hbcu',
      query: 'HBCU',
      max_items: 5,
      scroll_speed: 'fast',
      auto_hide: false,
      hide_after: 8000
    }
  });
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

      const settingsObj: SiteSettings = { ...settings }; // Start with defaults
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });

      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load site settings');
      // Keep default activated settings if fetch fails
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

      toast.success(`${key.replace(/_/g, ' ')} setting updated`);
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
