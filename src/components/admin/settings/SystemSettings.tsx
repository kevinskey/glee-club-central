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
import { AlertTriangle, Database, Download } from "lucide-react";

export const SystemSettings: React.FC = () => {
  const { settings, updateSetting, loading } = useSiteSettings();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      enableDebugMode: settings.enable_debug_mode || false,
      enableCaching: settings.enable_caching || true,
      cacheExpiry: settings.cache_expiry || 3600,
      backupFrequency: settings.backup_frequency || "daily",
      enablePerformanceMonitoring:
        settings.enable_performance_monitoring || true,
      maxFileUploadSize: settings.max_file_upload_size || 10,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await Promise.all([
        updateSetting("enable_debug_mode", data.enableDebugMode),
        updateSetting("enable_caching", data.enableCaching),
        updateSetting("cache_expiry", data.cacheExpiry),
        updateSetting("backup_frequency", data.backupFrequency),
        updateSetting(
          "enable_performance_monitoring",
          data.enablePerformanceMonitoring,
        ),
        updateSetting("max_file_upload_size", data.maxFileUploadSize),
      ]);
      toast.success("System settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  React.useEffect(() => {
    if (settings) {
      setValue("enableDebugMode", settings.enable_debug_mode || false);
      setValue("enableCaching", settings.enable_caching || true);
      setValue("cacheExpiry", settings.cache_expiry || 3600);
      setValue("backupFrequency", settings.backup_frequency || "daily");
      setValue(
        "enablePerformanceMonitoring",
        settings.enable_performance_monitoring || true,
      );
      setValue("maxFileUploadSize", settings.max_file_upload_size || 10);
    }
  }, [settings, setValue]);

  if (loading) {
    return <div>Loading system settings...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableDebugMode">Debug Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable detailed error logging and debugging
              </p>
            </div>
            <Switch
              id="enableDebugMode"
              checked={watch("enableDebugMode")}
              onCheckedChange={(checked) =>
                setValue("enableDebugMode", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableCaching">Enable Caching</Label>
              <p className="text-sm text-muted-foreground">
                Cache frequently accessed data for better performance
              </p>
            </div>
            <Switch
              id="enableCaching"
              checked={watch("enableCaching")}
              onCheckedChange={(checked) => setValue("enableCaching", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enablePerformanceMonitoring">
                Performance Monitoring
              </Label>
              <p className="text-sm text-muted-foreground">
                Monitor system performance and response times
              </p>
            </div>
            <Switch
              id="enablePerformanceMonitoring"
              checked={watch("enablePerformanceMonitoring")}
              onCheckedChange={(checked) =>
                setValue("enablePerformanceMonitoring", checked)
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cacheExpiry">Cache Expiry (seconds)</Label>
            <Input
              id="cacheExpiry"
              type="number"
              {...register("cacheExpiry", { valueAsNumber: true })}
              min="300"
              max="86400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxFileUploadSize">Max Upload Size (MB)</Label>
            <Input
              id="maxFileUploadSize"
              type="number"
              {...register("maxFileUploadSize", { valueAsNumber: true })}
              min="1"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backupFrequency">Backup Frequency</Label>
            <Select
              value={watch("backupFrequency")}
              onValueChange={(value) => setValue("backupFrequency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Save System Settings
        </Button>
      </form>

      {/* System Actions */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">System Maintenance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Clear Cache
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>

          <Button variant="destructive" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reset System
          </Button>
        </div>
      </div>
    </div>
  );
};
