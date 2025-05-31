
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';

export const UserManagementSettings: React.FC = () => {
  const { settings, updateSetting, loading } = useSiteSettings();
  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      requireEmailVerification: settings.require_email_verification || true,
      defaultUserRole: settings.default_user_role || 'member',
      autoApproveUsers: settings.auto_approve_users || false,
      allowProfileUpdates: settings.allow_profile_updates || true,
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await Promise.all([
        updateSetting('require_email_verification', data.requireEmailVerification),
        updateSetting('default_user_role', data.defaultUserRole),
        updateSetting('auto_approve_users', data.autoApproveUsers),
        updateSetting('allow_profile_updates', data.allowProfileUpdates),
      ]);
      toast.success('User management settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  React.useEffect(() => {
    if (settings) {
      setValue('requireEmailVerification', settings.require_email_verification || true);
      setValue('defaultUserRole', settings.default_user_role || 'member');
      setValue('autoApproveUsers', settings.auto_approve_users || false);
      setValue('allowProfileUpdates', settings.allow_profile_updates || true);
    }
  }, [settings, setValue]);

  if (loading) {
    return <div>Loading user settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
            <p className="text-sm text-muted-foreground">
              Users must verify their email before accessing the platform
            </p>
          </div>
          <Switch
            id="requireEmailVerification"
            checked={watch('requireEmailVerification')}
            onCheckedChange={(checked) => setValue('requireEmailVerification', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoApproveUsers">Auto-approve New Users</Label>
            <p className="text-sm text-muted-foreground">
              Automatically approve new user registrations
            </p>
          </div>
          <Switch
            id="autoApproveUsers"
            checked={watch('autoApproveUsers')}
            onCheckedChange={(checked) => setValue('autoApproveUsers', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allowProfileUpdates">Allow Profile Updates</Label>
            <p className="text-sm text-muted-foreground">
              Users can update their own profile information
            </p>
          </div>
          <Switch
            id="allowProfileUpdates"
            checked={watch('allowProfileUpdates')}
            onCheckedChange={(checked) => setValue('allowProfileUpdates', checked)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="defaultUserRole">Default User Role</Label>
        <Select
          value={watch('defaultUserRole')}
          onValueChange={(value) => setValue('defaultUserRole', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select default role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="singer">Singer</SelectItem>
            <SelectItem value="section_leader">Section Leader</SelectItem>
            <SelectItem value="administrator">Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full md:w-auto">
        Save User Settings
      </Button>
    </form>
  );
};
