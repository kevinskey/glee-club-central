import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  FileText,
  BarChart3,
  Send,
  Download,
  Upload,
  RefreshCw,
  Eye,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ElasticEmailStats {
  accountInfo: any;
  statistics: any;
  contactLists: any[];
  templates: any[];
  campaigns: any[];
}

export function ElasticEmailIntegration() {
  const [stats, setStats] = useState<ElasticEmailStats>({
    accountInfo: null,
    statistics: null,
    contactLists: [],
    templates: [],
    campaigns: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeSync, setActiveSync] = useState<string | null>(null);

  useEffect(() => {
    loadElasticEmailData();
  }, []);

  const loadElasticEmailData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "elastic-email-sync",
        {
          body: { action: "load_all" },
        },
      );

      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error("Error loading Elastic Email data:", error);
      toast.error("Failed to load Elastic Email data");
    } finally {
      setIsLoading(false);
    }
  };

  const syncData = async (type: string) => {
    setActiveSync(type);
    try {
      const { data, error } = await supabase.functions.invoke(
        "elastic-email-sync",
        {
          body: { action: `sync_${type}` },
        },
      );

      if (error) throw error;

      toast.success(`${type} synced successfully`);
      await loadElasticEmailData();
    } catch (error) {
      console.error(`Error syncing ${type}:`, error);
      toast.error(`Failed to sync ${type}`);
    } finally {
      setActiveSync(null);
    }
  };

  const exportToElasticEmail = async (type: string) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "elastic-email-sync",
        {
          body: { action: `export_${type}` },
        },
      );

      if (error) throw error;
      toast.success(`${type} exported to Elastic Email successfully`);
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      toast.error(`Failed to export ${type}`);
    }
  };

  if (isLoading && !stats.accountInfo) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Elastic Email Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.accountInfo?.credits || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Credits Remaining
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.statistics?.sent || 0}
              </div>
              <div className="text-sm text-muted-foreground">Emails Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.contactLists?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Contact Lists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.templates?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="audiences" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audiences" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audiences
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audiences">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contact Lists & Audiences</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => syncData("contacts")}
                    disabled={activeSync === "contacts"}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {activeSync === "contacts"
                      ? "Syncing..."
                      : "Sync from Elastic Email"}
                  </Button>
                  <Button
                    onClick={() => exportToElasticEmail("members")}
                    variant="outline"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Export Members
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.contactLists.map((list: any) => (
                  <div
                    key={list.listid}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{list.listname}</h3>
                      <p className="text-sm text-muted-foreground">
                        {list.count} contacts • Created{" "}
                        {new Date(list.datecreated).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          list.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {list.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Email Templates</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => syncData("templates")}
                    disabled={activeSync === "templates"}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {activeSync === "templates"
                      ? "Syncing..."
                      : "Import Templates"}
                  </Button>
                  <Button
                    onClick={() => exportToElasticEmail("templates")}
                    variant="outline"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Export Templates
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.templates.map((template: any) => (
                  <div
                    key={template.templateid}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{template.templatetype}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Created{" "}
                          {new Date(template.datecreated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.campaigns.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No campaigns found</p>
                    <p className="text-sm">
                      Create campaigns through the Communications Center
                    </p>
                  </div>
                ) : (
                  stats.campaigns.map((campaign: any) => (
                    <div
                      key={campaign.campaignid}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {campaign.subject}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs">Sent: {campaign.sent}</span>
                          <span className="text-xs">
                            Delivered: {campaign.delivered}
                          </span>
                          <span className="text-xs">
                            Opened: {campaign.opened}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          campaign.status === "Completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Email Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Delivery Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Sent</span>
                      <span className="font-medium">
                        {stats.statistics?.sent || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivered</span>
                      <span className="font-medium text-green-600">
                        {stats.statistics?.delivered || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bounced</span>
                      <span className="font-medium text-red-600">
                        {stats.statistics?.bounced || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complaints</span>
                      <span className="font-medium text-orange-600">
                        {stats.statistics?.complaints || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Engagement Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Opened</span>
                      <span className="font-medium">
                        {stats.statistics?.opened || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clicked</span>
                      <span className="font-medium">
                        {stats.statistics?.clicked || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unsubscribed</span>
                      <span className="font-medium">
                        {stats.statistics?.unsubscribed || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
