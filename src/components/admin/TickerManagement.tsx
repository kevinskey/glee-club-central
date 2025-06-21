import React, { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { NewsTickerItem } from "@/components/landing/news/NewsTickerItem";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { Rss, Settings, Eye, EyeOff, RotateCcw } from "lucide-react";

export function TickerManagement() {
  const { settings, updateSetting, loading } = useSiteSettings();
  const [previewItems, setPreviewItems] = useState<string[]>([]);
  const [isTestingFeed, setIsTestingFeed] = useState(false);

  // Default settings
  const tickerSettings = settings.ticker_settings || {
    enabled: true,
    source: "google_news_hbcu",
    query: "HBCU",
    max_items: 5,
    scroll_speed: "fast",
    auto_hide: false,
    hide_after: 8000,
  };

  const sourceOptions = [
    { value: "google_news_hbcu", label: "Google News - HBCU" },
    { value: "google_news_spelman", label: "Google News - Spelman College" },
    { value: "google_news_music", label: "Google News - Choral Music" },
    { value: "custom", label: "Custom RSS Feed" },
  ];

  const speedOptions = [
    { value: "slow", label: "Slow (30s)" },
    { value: "normal", label: "Normal (25s)" },
    { value: "fast", label: "Fast (20s)" },
  ];

  const testNewsFeed = async () => {
    setIsTestingFeed(true);
    try {
      let rssUrl = "";

      switch (tickerSettings.source) {
        case "google_news_hbcu":
          rssUrl =
            "https://news.google.com/rss/search?q=HBCU&hl=en-US&gl=US&ceid=US:en";
          break;
        case "google_news_spelman":
          rssUrl =
            "https://news.google.com/rss/search?q=Spelman%20College&hl=en-US&gl=US&ceid=US:en";
          break;
        case "google_news_music":
          rssUrl =
            "https://news.google.com/rss/search?q=choral%20music&hl=en-US&gl=US&ceid=US:en";
          break;
        default:
          rssUrl = tickerSettings.custom_url || "";
      }

      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
      );

      if (!response.ok) throw new Error("Failed to fetch news");

      const data = await response.json();

      if (data.status === "ok" && data.items) {
        const headlines = data.items
          .slice(0, tickerSettings.max_items)
          .map((item: any) => item.title)
          .filter((title: string) => title && title.length > 0);

        setPreviewItems(headlines);
        toast.success("News feed tested successfully");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error testing news feed:", error);
      toast.error("Failed to test news feed");
      setPreviewItems([
        "Sample news item 1",
        "Sample news item 2",
        "Sample news item 3",
      ]);
    } finally {
      setIsTestingFeed(false);
    }
  };

  const handleSettingUpdate = async (key: string, value: any) => {
    const updatedSettings = {
      ...tickerSettings,
      [key]: value,
    };

    try {
      await updateSetting("ticker_settings", updatedSettings);
      toast.success("Ticker settings updated");
    } catch (error) {
      toast.error("Failed to update ticker settings");
    }
  };

  const resetToDefaults = async () => {
    const defaultSettings = {
      enabled: true,
      source: "google_news_hbcu",
      query: "HBCU",
      max_items: 5,
      scroll_speed: "fast",
      auto_hide: false,
      hide_after: 8000,
    };

    try {
      await updateSetting("ticker_settings", defaultSettings);
      toast.success("Ticker settings reset to defaults");
    } catch (error) {
      toast.error("Failed to reset ticker settings");
    }
  };

  useEffect(() => {
    if (tickerSettings.enabled) {
      testNewsFeed();
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5 text-glee-columbia" />
            News Ticker Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Ticker */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="ticker-enabled">Enable News Ticker</Label>
              <p className="text-sm text-muted-foreground">
                Show the news ticker on the homepage
              </p>
            </div>
            <Switch
              id="ticker-enabled"
              checked={tickerSettings.enabled}
              onCheckedChange={(checked) =>
                handleSettingUpdate("enabled", checked)
              }
            />
          </div>

          <Separator />

          {/* News Source Selection */}
          <div className="space-y-3">
            <Label>News Source</Label>
            <Select
              value={tickerSettings.source}
              onValueChange={(value) => handleSettingUpdate("source", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select news source" />
              </SelectTrigger>
              <SelectContent>
                {sourceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom RSS URL (if custom source selected) */}
          {tickerSettings.source === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom-url">Custom RSS Feed URL</Label>
              <Input
                id="custom-url"
                type="url"
                placeholder="https://example.com/rss"
                value={tickerSettings.custom_url || ""}
                onChange={(e) =>
                  handleSettingUpdate("custom_url", e.target.value)
                }
              />
            </div>
          )}

          {/* Maximum Items */}
          <div className="space-y-2">
            <Label htmlFor="max-items">Maximum News Items</Label>
            <Input
              id="max-items"
              type="number"
              min="1"
              max="10"
              value={tickerSettings.max_items}
              onChange={(e) =>
                handleSettingUpdate("max_items", parseInt(e.target.value))
              }
            />
          </div>

          {/* Scroll Speed */}
          <div className="space-y-3">
            <Label>Scroll Speed</Label>
            <Select
              value={tickerSettings.scroll_speed}
              onValueChange={(value) =>
                handleSettingUpdate("scroll_speed", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scroll speed" />
              </SelectTrigger>
              <SelectContent>
                {speedOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Auto Hide Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-hide">Auto Hide Ticker</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically hide ticker after specified time
                </p>
              </div>
              <Switch
                id="auto-hide"
                checked={tickerSettings.auto_hide}
                onCheckedChange={(checked) =>
                  handleSettingUpdate("auto_hide", checked)
                }
              />
            </div>

            {tickerSettings.auto_hide && (
              <div className="space-y-2">
                <Label htmlFor="hide-after">Hide After (milliseconds)</Label>
                <Input
                  id="hide-after"
                  type="number"
                  min="1000"
                  step="1000"
                  value={tickerSettings.hide_after}
                  onChange={(e) =>
                    handleSettingUpdate("hide_after", parseInt(e.target.value))
                  }
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={testNewsFeed}
              disabled={isTestingFeed}
              variant="outline"
            >
              {isTestingFeed ? (
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Test Feed
            </Button>

            <Button onClick={resetToDefaults} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {previewItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-glee-columbia" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-glee-columbia text-white py-1 relative">
                <div className="container flex items-center justify-center text-sm">
                  <div className="flex-1 overflow-hidden flex items-center">
                    <div
                      className={`flex whitespace-nowrap animate-marquee-${tickerSettings.scroll_speed}`}
                    >
                      {previewItems.map((headline, index) => (
                        <span key={index} className="mx-6">
                          📰 {headline}
                        </span>
                      ))}
                      {/* Repeat for continuous scroll */}
                      {previewItems.map((headline, index) => (
                        <span key={`repeat-${index}`} className="mx-6">
                          📰 {headline}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This preview shows how the ticker will appear on the homepage
            </p>
          </CardContent>
        </Card>
      )}

      {/* Status Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="mt-1">
                <Badge
                  variant={tickerSettings.enabled ? "success" : "secondary"}
                >
                  {tickerSettings.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">News Source</Label>
              <p className="text-sm mt-1">
                {
                  sourceOptions.find(
                    (opt) => opt.value === tickerSettings.source,
                  )?.label
                }
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Items Displayed</Label>
              <p className="text-sm mt-1">{tickerSettings.max_items} items</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Scroll Speed</Label>
              <p className="text-sm mt-1">
                {
                  speedOptions.find(
                    (opt) => opt.value === tickerSettings.scroll_speed,
                  )?.label
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
