import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";

export const NotificationSettings: React.FC = () => {
  const { settings, updateSetting, loading } = useSiteSettings();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      enableEmailNotifications: settings.enable_email_notifications || true,
      enableSmsNotifications: settings.enable_sms_notifications || false,
      emailFromAddress: settings.email_from_address || "",
      emailFromName: settings.email_from_name || "Spelman Glee Club",
      enableEventReminders: settings.enable_event_reminders || true,
      enableWelcomeEmails: settings.enable_welcome_emails || true,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await Promise.all([
        updateSetting(
          "enable_email_notifications",
          data.enableEmailNotifications,
        ),
        updateSetting("enable_sms_notifications", data.enableSmsNotifications),
        updateSetting("email_from_address", data.emailFromAddress),
        updateSetting("email_from_name", data.emailFromName),
        updateSetting("enable_event_reminders", data.enableEventReminders),
        updateSetting("enable_welcome_emails", data.enableWelcomeEmails),
      ]);
      toast.success("Notification settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  React.useEffect(() => {
    if (settings) {
      setValue(
        "enableEmailNotifications",
        settings.enable_email_notifications || true,
      );
      setValue(
        "enableSmsNotifications",
        settings.enable_sms_notifications || false,
      );
      setValue("emailFromAddress", settings.email_from_address || "");
      setValue(
        "emailFromName",
        settings.email_from_name || "Spelman Glee Club",
      );
      setValue("enableEventReminders", settings.enable_event_reminders || true);
      setValue("enableWelcomeEmails", settings.enable_welcome_emails || true);
    }
  }, [settings, setValue]);

  if (loading) {
    return <div>Loading notification settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableEmailNotifications">
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Enable system-wide email notifications
            </p>
          </div>
          <Switch
            id="enableEmailNotifications"
            checked={watch("enableEmailNotifications")}
            onCheckedChange={(checked) =>
              setValue("enableEmailNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableSmsNotifications">SMS Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Enable SMS notifications (requires SMS service configuration)
            </p>
          </div>
          <Switch
            id="enableSmsNotifications"
            checked={watch("enableSmsNotifications")}
            onCheckedChange={(checked) =>
              setValue("enableSmsNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableEventReminders">Event Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Send automatic reminders for upcoming events
            </p>
          </div>
          <Switch
            id="enableEventReminders"
            checked={watch("enableEventReminders")}
            onCheckedChange={(checked) =>
              setValue("enableEventReminders", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableWelcomeEmails">Welcome Emails</Label>
            <p className="text-sm text-muted-foreground">
              Send welcome emails to new users
            </p>
          </div>
          <Switch
            id="enableWelcomeEmails"
            checked={watch("enableWelcomeEmails")}
            onCheckedChange={(checked) =>
              setValue("enableWelcomeEmails", checked)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="emailFromName">Email From Name</Label>
          <Input
            id="emailFromName"
            {...register("emailFromName")}
            placeholder="Spelman Glee Club"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailFromAddress">Email From Address</Label>
          <Input
            id="emailFromAddress"
            type="email"
            {...register("emailFromAddress")}
            placeholder="noreply@spelmangleeclub.com"
          />
        </div>
      </div>

      <Button type="submit" className="w-full md:w-auto">
        Save Notification Settings
      </Button>
    </form>
  );
};
