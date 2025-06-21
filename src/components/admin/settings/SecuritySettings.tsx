import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";

export const SecuritySettings: React.FC = () => {
  const { settings, updateSetting, loading } = useSiteSettings();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      enableTwoFactor: settings.enable_two_factor || false,
      sessionTimeout: settings.session_timeout || 24,
      maxLoginAttempts: settings.max_login_attempts || 5,
      passwordMinLength: settings.password_min_length || 8,
      requirePasswordComplexity: settings.require_password_complexity || true,
      enableAuditLogging: settings.enable_audit_logging || true,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await Promise.all([
        updateSetting("enable_two_factor", data.enableTwoFactor),
        updateSetting("session_timeout", data.sessionTimeout),
        updateSetting("max_login_attempts", data.maxLoginAttempts),
        updateSetting("password_min_length", data.passwordMinLength),
        updateSetting(
          "require_password_complexity",
          data.requirePasswordComplexity,
        ),
        updateSetting("enable_audit_logging", data.enableAuditLogging),
      ]);
      toast.success("Security settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  React.useEffect(() => {
    if (settings) {
      setValue("enableTwoFactor", settings.enable_two_factor || false);
      setValue("sessionTimeout", settings.session_timeout || 24);
      setValue("maxLoginAttempts", settings.max_login_attempts || 5);
      setValue("passwordMinLength", settings.password_min_length || 8);
      setValue(
        "requirePasswordComplexity",
        settings.require_password_complexity || true,
      );
      setValue("enableAuditLogging", settings.enable_audit_logging || true);
    }
  }, [settings, setValue]);

  if (loading) {
    return <div>Loading security settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableTwoFactor">Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Require 2FA for admin accounts
            </p>
          </div>
          <Switch
            id="enableTwoFactor"
            checked={watch("enableTwoFactor")}
            onCheckedChange={(checked) => setValue("enableTwoFactor", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="requirePasswordComplexity">
              Password Complexity
            </Label>
            <p className="text-sm text-muted-foreground">
              Require complex passwords with special characters
            </p>
          </div>
          <Switch
            id="requirePasswordComplexity"
            checked={watch("requirePasswordComplexity")}
            onCheckedChange={(checked) =>
              setValue("requirePasswordComplexity", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableAuditLogging">Audit Logging</Label>
            <p className="text-sm text-muted-foreground">
              Log all admin actions for security auditing
            </p>
          </div>
          <Switch
            id="enableAuditLogging"
            checked={watch("enableAuditLogging")}
            onCheckedChange={(checked) =>
              setValue("enableAuditLogging", checked)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
          <Input
            id="sessionTimeout"
            type="number"
            {...register("sessionTimeout", { valueAsNumber: true })}
            min="1"
            max="168"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
          <Input
            id="maxLoginAttempts"
            type="number"
            {...register("maxLoginAttempts", { valueAsNumber: true })}
            min="3"
            max="10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passwordMinLength">Min Password Length</Label>
          <Input
            id="passwordMinLength"
            type="number"
            {...register("passwordMinLength", { valueAsNumber: true })}
            min="6"
            max="20"
          />
        </div>
      </div>

      <Button type="submit" className="w-full md:w-auto">
        Save Security Settings
      </Button>
    </form>
  );
};
