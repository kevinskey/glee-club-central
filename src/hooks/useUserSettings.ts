
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserSettings {
  email_opt_in: boolean;
  sms_opt_in: boolean;
  newsletter_opt_in: boolean;
  event_reminders: boolean;
  order_confirmations: boolean;
}

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    email_opt_in: true,
    sms_opt_in: false,
    newsletter_opt_in: true,
    event_reminders: true,
    order_confirmations: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          email_opt_in: data.email_opt_in,
          sms_opt_in: data.sms_opt_in,
          newsletter_opt_in: data.newsletter_opt_in,
          event_reminders: data.event_reminders,
          order_confirmations: data.order_confirmations,
        });
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      setSaving(true);
      const updatedSettings = { ...settings, ...newSettings };

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings,
        });

      if (error) throw error;

      setSettings(updatedSettings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return {
    settings,
    loading,
    saving,
    updateSettings,
    refetch: fetchSettings,
  };
};
