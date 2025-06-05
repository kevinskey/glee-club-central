
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AISettings {
  feature_name: string;
  enabled: boolean;
  settings: any;
}

export function useAISettings() {
  const [aiSettings, setAISettings] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAISettings();
  }, []);

  const fetchAISettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_settings')
        .select('feature_name, enabled');

      if (error) throw error;

      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.feature_name] = setting.enabled;
        return acc;
      }, {} as Record<string, boolean>) || {};

      setAISettings(settingsMap);
    } catch (error) {
      console.error('Error fetching AI settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAISetting = async (featureName: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('ai_settings')
        .upsert({ feature_name: featureName, enabled });

      if (error) throw error;

      setAISettings(prev => ({ ...prev, [featureName]: enabled }));
    } catch (error) {
      console.error('Error updating AI setting:', error);
    }
  };

  return {
    aiSettings,
    isLoading,
    updateAISetting,
    isFeatureEnabled: (featureName: string) => aiSettings[featureName] ?? true
  };
}
