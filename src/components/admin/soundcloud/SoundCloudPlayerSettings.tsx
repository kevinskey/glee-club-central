import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Volume2,
  Palette,
  Clock,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function SoundCloudPlayerSettings() {
  const { settings, updateSetting, loading } = useSiteSettings();

  // SoundCloud player configuration state
  const [playerSettings, setPlayerSettings] = useState({
    autoPlay: settings.soundcloud_auto_play || false,
    showComments: settings.soundcloud_show_comments || true,
    showArtwork: settings.soundcloud_show_artwork || true,
    showUser: settings.soundcloud_show_user || true,
    showPlaycount: settings.soundcloud_show_playcount || true,
    color: settings.soundcloud_theme_color || "#ff7700",
    volume: settings.soundcloud_default_volume || 80,
    visualWaveform: settings.soundcloud_visual_waveform || true,
    shareButtons: settings.soundcloud_share_buttons || true,
    downloadEnabled: settings.soundcloud_download_enabled || false,
    likeButton: settings.soundcloud_like_button || true,
    shuffleMode: settings.soundcloud_shuffle_mode || false,
    repeatMode: settings.soundcloud_repeat_mode || "none",
    crossfade: settings.soundcloud_crossfade || 0,
    bufferTime: settings.soundcloud_buffer_time || 5000,
    trackSkipDelay: settings.soundcloud_skip_delay || 3000,
  });

  const [saving, setSaving] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setPlayerSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save all settings to the database
      const settingsToSave = [
        { key: "soundcloud_auto_play", value: playerSettings.autoPlay },
        { key: "soundcloud_show_comments", value: playerSettings.showComments },
        { key: "soundcloud_show_artwork", value: playerSettings.showArtwork },
        { key: "soundcloud_show_user", value: playerSettings.showUser },
        {
          key: "soundcloud_show_playcount",
          value: playerSettings.showPlaycount,
        },
        { key: "soundcloud_theme_color", value: playerSettings.color },
        { key: "soundcloud_default_volume", value: playerSettings.volume },
        {
          key: "soundcloud_visual_waveform",
          value: playerSettings.visualWaveform,
        },
        { key: "soundcloud_share_buttons", value: playerSettings.shareButtons },
        {
          key: "soundcloud_download_enabled",
          value: playerSettings.downloadEnabled,
        },
        { key: "soundcloud_like_button", value: playerSettings.likeButton },
        { key: "soundcloud_shuffle_mode", value: playerSettings.shuffleMode },
        { key: "soundcloud_repeat_mode", value: playerSettings.repeatMode },
        { key: "soundcloud_crossfade", value: playerSettings.crossfade },
        { key: "soundcloud_buffer_time", value: playerSettings.bufferTime },
        { key: "soundcloud_skip_delay", value: playerSettings.trackSkipDelay },
      ];

      for (const setting of settingsToSave) {
        await updateSetting(setting.key, setting.value);
      }

      toast.success("SoundCloud player settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    setPlayerSettings({
      autoPlay: false,
      showComments: true,
      showArtwork: true,
      showUser: true,
      showPlaycount: true,
      color: "#ff7700",
      volume: 80,
      visualWaveform: true,
      shareButtons: true,
      downloadEnabled: false,
      likeButton: true,
      shuffleMode: false,
      repeatMode: "none",
      crossfade: 0,
      bufferTime: 5000,
      trackSkipDelay: 3000,
    });
    toast.info("Settings reset to defaults");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Player Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Player Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="theme-color">Theme Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="theme-color"
                  type="color"
                  value={playerSettings.color}
                  onChange={(e) => handleSettingChange("color", e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={playerSettings.color}
                  onChange={(e) => handleSettingChange("color", e.target.value)}
                  placeholder="#ff7700"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-artwork">Show Artwork</Label>
                <Switch
                  id="show-artwork"
                  checked={playerSettings.showArtwork}
                  onCheckedChange={(checked) =>
                    handleSettingChange("showArtwork", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-comments">Show Comments</Label>
                <Switch
                  id="show-comments"
                  checked={playerSettings.showComments}
                  onCheckedChange={(checked) =>
                    handleSettingChange("showComments", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-user">Show User Info</Label>
                <Switch
                  id="show-user"
                  checked={playerSettings.showUser}
                  onCheckedChange={(checked) =>
                    handleSettingChange("showUser", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-playcount">Show Play Count</Label>
                <Switch
                  id="show-playcount"
                  checked={playerSettings.showPlaycount}
                  onCheckedChange={(checked) =>
                    handleSettingChange("showPlaycount", checked)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Behavior */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Player Behavior
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-play">Auto Play</Label>
                <Switch
                  id="auto-play"
                  checked={playerSettings.autoPlay}
                  onCheckedChange={(checked) =>
                    handleSettingChange("autoPlay", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="visual-waveform">Visual Waveform</Label>
                <Switch
                  id="visual-waveform"
                  checked={playerSettings.visualWaveform}
                  onCheckedChange={(checked) =>
                    handleSettingChange("visualWaveform", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="shuffle-mode">Shuffle Mode</Label>
                <Switch
                  id="shuffle-mode"
                  checked={playerSettings.shuffleMode}
                  onCheckedChange={(checked) =>
                    handleSettingChange("shuffleMode", checked)
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repeat-mode">Repeat Mode</Label>
                <Select
                  value={playerSettings.repeatMode}
                  onValueChange={(value) =>
                    handleSettingChange("repeatMode", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Repeat</SelectItem>
                    <SelectItem value="one">Repeat One</SelectItem>
                    <SelectItem value="all">Repeat All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Audio Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-volume">
                Default Volume: {playerSettings.volume}%
              </Label>
              <Slider
                id="default-volume"
                min={0}
                max={100}
                step={5}
                value={[playerSettings.volume]}
                onValueChange={(value) =>
                  handleSettingChange("volume", value[0])
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crossfade">
                Crossfade Duration: {playerSettings.crossfade}ms
              </Label>
              <Slider
                id="crossfade"
                min={0}
                max={5000}
                step={100}
                value={[playerSettings.crossfade]}
                onValueChange={(value) =>
                  handleSettingChange("crossfade", value[0])
                }
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Performance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="buffer-time">Buffer Time (ms)</Label>
              <Input
                id="buffer-time"
                type="number"
                min={1000}
                max={30000}
                step={1000}
                value={playerSettings.bufferTime}
                onChange={(e) =>
                  handleSettingChange("bufferTime", parseInt(e.target.value))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skip-delay">Track Skip Delay (ms)</Label>
              <Input
                id="skip-delay"
                type="number"
                min={0}
                max={10000}
                step={500}
                value={playerSettings.trackSkipDelay}
                onChange={(e) =>
                  handleSettingChange(
                    "trackSkipDelay",
                    parseInt(e.target.value),
                  )
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Features */}
      <Card>
        <CardHeader>
          <CardTitle>Social Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="share-buttons">Share Buttons</Label>
            <Switch
              id="share-buttons"
              checked={playerSettings.shareButtons}
              onCheckedChange={(checked) =>
                handleSettingChange("shareButtons", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="like-button">Like Button</Label>
            <Switch
              id="like-button"
              checked={playerSettings.likeButton}
              onCheckedChange={(checked) =>
                handleSettingChange("likeButton", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="download-enabled">Download Enabled</Label>
            <Switch
              id="download-enabled"
              checked={playerSettings.downloadEnabled}
              onCheckedChange={(checked) =>
                handleSettingChange("downloadEnabled", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleResetToDefaults}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>

        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
