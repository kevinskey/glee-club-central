import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SpacingSettings {
  topPadding: number;
  bottomPadding: number;
  leftPadding: number;
  rightPadding: number;
  topMargin: number;
  bottomMargin: number;
  minHeight: number;
  maxHeight: number;
}

const defaultSettings: SpacingSettings = {
  topPadding: 0,
  bottomPadding: 0,
  leftPadding: 0,
  rightPadding: 0,
  topMargin: 0,
  bottomMargin: 0,
  minHeight: 60,
  maxHeight: 100,
};

export function SliderSpacingControls() {
  const [settings, setSettings] = useState<SpacingSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSpacingSettings();
  }, []);

  const loadSpacingSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_settings")
        .select("spacing_settings")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading spacing settings:", error);
        return;
      }

      if (data?.spacing_settings) {
        const loadedSettings = { ...defaultSettings, ...data.spacing_settings };
        setSettings(loadedSettings);
        console.log("Loaded spacing settings:", loadedSettings);
      }
    } catch (error) {
      console.error("Error loading spacing settings:", error);
    }
  };

  const saveSpacingSettings = async () => {
    setIsLoading(true);
    try {
      const { data: existing } = await supabase
        .from("hero_settings")
        .select("id")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("hero_settings")
          .update({
            spacing_settings: settings,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("hero_settings").insert([
          {
            spacing_settings: settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
      }

      setHasChanges(false);
      toast.success(
        "Spacing settings saved successfully! Refresh the page to see changes on the slider.",
      );
      console.log("Saved spacing settings:", settings);
    } catch (error) {
      console.error("Error saving spacing settings:", error);
      toast.error("Failed to save spacing settings");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.info('Settings reset to defaults. Click "Save Changes" to apply.');
  };

  const updateSetting = (key: keyof SpacingSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Slider Spacing Controls</CardTitle>
        <p className="text-sm text-gray-600">
          Adjust the spacing and dimensions of the hero slider. Changes will
          apply after saving and refreshing the page.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Padding Controls */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold">Padding (px)</Label>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Top: {settings.topPadding}px</Label>
              <Slider
                value={[settings.topPadding]}
                onValueChange={([value]) => updateSetting("topPadding", value)}
                max={100}
                step={4}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">
                Bottom: {settings.bottomPadding}px
              </Label>
              <Slider
                value={[settings.bottomPadding]}
                onValueChange={([value]) =>
                  updateSetting("bottomPadding", value)
                }
                max={100}
                step={4}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Left: {settings.leftPadding}px</Label>
              <Slider
                value={[settings.leftPadding]}
                onValueChange={([value]) => updateSetting("leftPadding", value)}
                max={100}
                step={4}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">
                Right: {settings.rightPadding}px
              </Label>
              <Slider
                value={[settings.rightPadding]}
                onValueChange={([value]) =>
                  updateSetting("rightPadding", value)
                }
                max={100}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Margin Controls */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold">Margin (px)</Label>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Top: {settings.topMargin}px</Label>
              <Slider
                value={[settings.topMargin]}
                onValueChange={([value]) => updateSetting("topMargin", value)}
                max={100}
                step={4}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">
                Bottom: {settings.bottomMargin}px
              </Label>
              <Slider
                value={[settings.bottomMargin]}
                onValueChange={([value]) =>
                  updateSetting("bottomMargin", value)
                }
                max={100}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Height Controls */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold">Height (vh)</Label>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">
                Min Height: {settings.minHeight}vh
              </Label>
              <Slider
                value={[settings.minHeight]}
                onValueChange={([value]) => updateSetting("minHeight", value)}
                min={30}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">
                Max Height: {settings.maxHeight}vh
              </Label>
              <Slider
                value={[settings.maxHeight]}
                onValueChange={([value]) => updateSetting("maxHeight", value)}
                min={50}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={saveSpacingSettings}
            disabled={isLoading || !hasChanges}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>

          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>

          <Button variant="outline" onClick={loadSpacingSettings}>
            Reload Settings
          </Button>
        </div>

        {hasChanges && (
          <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
            You have unsaved changes. Click "Save Changes" to apply them.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
