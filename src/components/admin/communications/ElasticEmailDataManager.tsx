
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  Check,
  AlertCircle,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedUserManagement } from '@/hooks/user/useUnifiedUserManagement';
import { toast } from 'sonner';

interface SyncStatus {
  contacts: 'idle' | 'syncing' | 'success' | 'error';
  templates: 'idle' | 'syncing' | 'success' | 'error';
  campaigns: 'idle' | 'syncing' | 'success' | 'error';
}

interface ElasticEmailData {
  accountInfo: any;
  statistics: any;
  contactLists: any[];
  templates: any[];
  campaigns: any[];
}

export function ElasticEmailDataManager() {
  const [data, setData] = useState<ElasticEmailData>({
    accountInfo: null,
    statistics: null,
    contactLists: [],
    templates: [],
    campaigns: []
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    contacts: 'idle',
    templates: 'idle',
    campaigns: 'idle'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const { filteredUsers } = useUnifiedUserManagement();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    setSyncProgress(10);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('elastic-email-sync', {
        body: { action: 'load_all' }
      });

      if (error) throw error;
      
      setData(response);
      setSyncProgress(100);
      toast.success('Elastic Email data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load Elastic Email data');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSyncProgress(0), 1000);
    }
  };

  const syncToElasticEmail = async (type: 'contacts' | 'templates') => {
    setSyncStatus(prev => ({ ...prev, [type]: 'syncing' }));
    
    try {
      let payload = {};
      
      if (type === 'contacts') {
        // Prepare member data for export
        payload = {
          action: 'export_members',
          data: {
            members: filteredUsers.filter(user => user.email).map(user => ({
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              voicePart: user.voice_part,
              role: user.role,
              status: user.status
            }))
          }
        };
      } else {
        payload = { action: 'export_templates' };
      }

      const { error } = await supabase.functions.invoke('elastic-email-sync', {
        body: payload
      });

      if (error) throw error;
      
      setSyncStatus(prev => ({ ...prev, [type]: 'success' }));
      toast.success(`${type} synced to Elastic Email successfully`);
      
      // Reload data after sync
      await loadAllData();
    } catch (error) {
      console.error(`Error syncing ${type}:`, error);
      setSyncStatus(prev => ({ ...prev, [type]: 'error' }));
      toast.error(`Failed to sync ${type}`);
    }
  };

  const syncFromElasticEmail = async (type: 'contacts' | 'templates') => {
    setSyncStatus(prev => ({ ...prev, [type]: 'syncing' }));
    
    try {
      const { data: response, error } = await supabase.functions.invoke('elastic-email-sync', {
        body: { action: `sync_${type}` }
      });

      if (error) throw error;
      
      setSyncStatus(prev => ({ ...prev, [type]: 'success' }));
      toast.success(`${type} synced from Elastic Email successfully`);
      
      // Update local data
      if (type === 'contacts' && response.data) {
        setData(prev => ({ ...prev, contactLists: response.data }));
      } else if (type === 'templates' && response.data) {
        setData(prev => ({ ...prev, templates: response.data }));
      }
    } catch (error) {
      console.error(`Error syncing ${type}:`, error);
      setSyncStatus(prev => ({ ...prev, [type]: 'error' }));
      toast.error(`Failed to sync ${type}`);
    }
  };

  const getSyncIcon = (status: SyncStatus[keyof SyncStatus]) => {
    switch (status) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sync Progress */}
      {syncProgress > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Syncing data...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Elastic Email Data Management
            </CardTitle>
            <Button
              onClick={loadAllData}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.accountInfo?.credits || 0}
              </div>
              <div className="text-sm text-muted-foreground">Credits Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.contactLists?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Contact Lists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data.templates?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {data.campaigns?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Campaigns</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => syncToElasticEmail('contacts')}
                  disabled={syncStatus.contacts === 'syncing'}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Export Members to Elastic Email
                  {getSyncIcon(syncStatus.contacts)}
                </Button>
                <Button
                  onClick={() => syncFromElasticEmail('contacts')}
                  disabled={syncStatus.contacts === 'syncing'}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Import from Elastic Email
                  {getSyncIcon(syncStatus.contacts)}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Local Members:</strong> {filteredUsers.filter(u => u.email).length} with email addresses</p>
                <p><strong>Elastic Email Lists:</strong> {data.contactLists.length} contact lists</p>
              </div>

              {data.contactLists.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Contact Lists in Elastic Email:</h4>
                  {data.contactLists.map((list: any) => (
                    <div key={list.listid} className="flex justify-between items-center p-2 border rounded">
                      <span>{list.listname}</span>
                      <Badge variant="outline">{list.count} contacts</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Template Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => syncFromElasticEmail('templates')}
                  disabled={syncStatus.templates === 'syncing'}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Import Templates from Elastic Email
                  {getSyncIcon(syncStatus.templates)}
                </Button>
                <Button
                  onClick={() => syncToElasticEmail('templates')}
                  disabled={syncStatus.templates === 'syncing'}
                  variant="outline"
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Export Templates to Elastic Email
                  {getSyncIcon(syncStatus.templates)}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Available Templates:</strong> {data.templates.length} templates in Elastic Email</p>
              </div>

              {data.templates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Available Templates:</h4>
                  {data.templates.slice(0, 5).map((template: any) => (
                    <div key={template.templateid} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <span className="font-medium">{template.name}</span>
                        <p className="text-sm text-muted-foreground">{template.subject}</p>
                      </div>
                      <Badge variant="outline">{template.templatetype}</Badge>
                    </div>
                  ))}
                  {data.templates.length > 5 && (
                    <p className="text-sm text-muted-foreground">
                      ...and {data.templates.length - 5} more templates
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Email Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Delivery Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Sent</span>
                      <span className="font-medium">{data.statistics?.sent || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivered</span>
                      <span className="font-medium text-green-600">{data.statistics?.delivered || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bounced</span>
                      <span className="font-medium text-red-600">{data.statistics?.bounced || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Engagement Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Opened</span>
                      <span className="font-medium">{data.statistics?.opened || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clicked</span>
                      <span className="font-medium">{data.statistics?.clicked || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unsubscribed</span>
                      <span className="font-medium">{data.statistics?.unsubscribed || 0}</span>
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
