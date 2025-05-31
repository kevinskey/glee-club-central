
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { useUserSettings, UserSettings } from '@/hooks/useUserSettings';

export function NotificationPreferences() {
  const { settings, loading, saving, updateSettings } = useUserSettings();

  const handleToggle = (key: keyof UserSettings, value: boolean) => {
    updateSettings({ [key]: value });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading preferences...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-muted-foreground">
                  General email notifications and updates
                </p>
              </div>
            </div>
            <Switch
              checked={settings.email_opt_in}
              onCheckedChange={(checked) => handleToggle('email_opt_in', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Urgent notifications via text message
                </p>
              </div>
            </div>
            <Switch
              checked={settings.sms_opt_in}
              onCheckedChange={(checked) => handleToggle('sms_opt_in', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-muted-foreground">
                  Monthly newsletters and announcements
                </p>
              </div>
            </div>
            <Switch
              checked={settings.newsletter_opt_in}
              onCheckedChange={(checked) => handleToggle('newsletter_opt_in', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Event Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Reminders for upcoming events and performances
                </p>
              </div>
            </div>
            <Switch
              checked={settings.event_reminders}
              onCheckedChange={(checked) => handleToggle('event_reminders', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Order Confirmations</p>
                <p className="text-sm text-muted-foreground">
                  Confirmations for store purchases and orders
                </p>
              </div>
            </div>
            <Switch
              checked={settings.order_confirmations}
              onCheckedChange={(checked) => handleToggle('order_confirmations', checked)}
              disabled={saving}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
