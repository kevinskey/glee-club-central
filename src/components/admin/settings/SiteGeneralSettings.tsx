
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';

export const SiteGeneralSettings: React.FC = () => {
  const { settings, updateSetting, loading } = useSiteSettings();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      siteName: settings.site_name || 'Spelman College Glee Club',
      siteDescription: settings.site_description || '',
      contactEmail: settings.contact_email || '',
      maintenanceMode: settings.maintenance_mode || false,
      allowRegistration: settings.allow_registration || true,
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await Promise.all([
        updateSetting('site_name', data.siteName),
        updateSetting('site_description', data.siteDescription),
        updateSetting('contact_email', data.contactEmail),
        updateSetting('maintenance_mode', data.maintenanceMode),
        updateSetting('allow_registration', data.allowRegistration),
      ]);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  React.useEffect(() => {
    if (settings) {
      setValue('siteName', settings.site_name || 'Spelman College Glee Club');
      setValue('siteDescription', settings.site_description || '');
      setValue('contactEmail', settings.contact_email || '');
      setValue('maintenanceMode', settings.maintenance_mode || false);
      setValue('allowRegistration', settings.allow_registration || true);
    }
  }, [settings, setValue]);

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            {...register('siteName')}
            placeholder="Enter site name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            {...register('contactEmail')}
            placeholder="admin@spelmangleeclub.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="siteDescription">Site Description</Label>
        <Textarea
          id="siteDescription"
          {...register('siteDescription')}
          placeholder="Enter site description"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, only admins can access the site
            </p>
          </div>
          <Switch
            id="maintenanceMode"
            checked={watch('maintenanceMode')}
            onCheckedChange={(checked) => setValue('maintenanceMode', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allowRegistration">Allow Registration</Label>
            <p className="text-sm text-muted-foreground">
              Allow new users to register for accounts
            </p>
          </div>
          <Switch
            id="allowRegistration"
            checked={watch('allowRegistration')}
            onCheckedChange={(checked) => setValue('allowRegistration', checked)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full md:w-auto">
        Save General Settings
      </Button>
    </form>
  );
};
