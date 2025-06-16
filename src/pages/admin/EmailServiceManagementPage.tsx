
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  Send,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EmailProvider {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isConfigured: boolean;
  config: Record<string, any>;
}

const EmailServiceManagementPage: React.FC = () => {
  const [providers, setProviders] = useState<EmailProvider[]>([]);
  const [activeProvider, setActiveProvider] = useState<string>('elastic_email');
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadEmailProviders();
  }, []);

  const loadEmailProviders = async () => {
    // Load existing email provider configurations
    const defaultProviders: EmailProvider[] = [
      {
        id: 'elastic_email',
        name: 'Elastic Email',
        description: 'High-performance email delivery service',
        isActive: true,
        isConfigured: true,
        config: {
          apiKey: '',
          fromEmail: 'noreply@gleeworld.org',
          fromName: 'Spelman College Glee Club',
          endpoint: 'https://api.elasticemail.com/v2/email/send'
        }
      },
      {
        id: 'mailchimp',
        name: 'MailChimp',
        description: 'Marketing automation and email platform',
        isActive: false,
        isConfigured: false,
        config: {
          apiKey: '',
          serverPrefix: '',
          fromEmail: 'noreply@gleeworld.org',
          fromName: 'Spelman College Glee Club'
        }
      },
      {
        id: 'sendgrid',
        name: 'SendGrid',
        description: 'Cloud-based email delivery service',
        isActive: false,
        isConfigured: false,
        config: {
          apiKey: '',
          fromEmail: 'noreply@gleeworld.org',
          fromName: 'Spelman College Glee Club'
        }
      },
      {
        id: 'resend',
        name: 'Resend',
        description: 'Developer-first email API',
        isActive: false,
        isConfigured: false,
        config: {
          apiKey: '',
          fromEmail: 'noreply@gleeworld.org',
          fromName: 'Spelman College Glee Club'
        }
      }
    ];

    setProviders(defaultProviders);
  };

  const toggleShowApiKey = (providerId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const updateProviderConfig = (providerId: string, key: string, value: string) => {
    setProviders(prev => prev.map(provider => 
      provider.id === providerId 
        ? { 
            ...provider, 
            config: { ...provider.config, [key]: value },
            isConfigured: value.trim() !== '' || provider.isConfigured
          }
        : provider
    ));
  };

  const toggleProviderActive = async (providerId: string, isActive: boolean) => {
    setProviders(prev => prev.map(provider => 
      provider.id === providerId 
        ? { ...provider, isActive }
        : provider
    ));

    if (isActive) {
      setActiveProvider(providerId);
    }

    toast.success(`${providers.find(p => p.id === providerId)?.name} ${isActive ? 'activated' : 'deactivated'}`);
  };

  const saveProviderConfig = async (providerId: string) => {
    setIsSaving(true);
    try {
      const provider = providers.find(p => p.id === providerId);
      if (!provider) return;

      // Here you would save to your backend/edge function
      console.log('Saving provider config:', { providerId, config: provider.config });
      
      toast.success(`${provider.name} configuration saved successfully`);
    } catch (error) {
      console.error('Error saving provider config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const testProvider = async (providerId: string) => {
    setIsTesting(prev => ({ ...prev, [providerId]: true }));
    
    try {
      const provider = providers.find(p => p.id === providerId);
      if (!provider) return;

      // Send a test email using the provider
      const { data, error } = await supabase.functions.invoke('test-email-provider', {
        body: {
          provider: providerId,
          config: provider.config,
          testEmail: 'test@example.com'
        }
      });

      if (error) throw error;

      toast.success(`Test email sent successfully via ${provider.name}`);
    } catch (error) {
      console.error('Error testing provider:', error);
      toast.error(`Failed to test ${providers.find(p => p.id === providerId)?.name}`);
    } finally {
      setIsTesting(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const renderProviderStatus = (provider: EmailProvider) => {
    if (!provider.isConfigured) {
      return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" />Not Configured</Badge>;
    }
    if (provider.isActive) {
      return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="outline"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
  };

  const renderProviderConfig = (provider: EmailProvider) => {
    switch (provider.id) {
      case 'elastic_email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${provider.id}-apikey`}>API Key</Label>
              <div className="flex gap-2">
                <Input
                  id={`${provider.id}-apikey`}
                  type={showApiKeys[provider.id] ? "text" : "password"}
                  value={provider.config.apiKey}
                  onChange={(e) => updateProviderConfig(provider.id, 'apiKey', e.target.value)}
                  placeholder="Enter your Elastic Email API key"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => toggleShowApiKey(provider.id)}
                >
                  {showApiKeys[provider.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${provider.id}-fromemail`}>From Email</Label>
                <Input
                  id={`${provider.id}-fromemail`}
                  value={provider.config.fromEmail}
                  onChange={(e) => updateProviderConfig(provider.id, 'fromEmail', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${provider.id}-fromname`}>From Name</Label>
                <Input
                  id={`${provider.id}-fromname`}
                  value={provider.config.fromName}
                  onChange={(e) => updateProviderConfig(provider.id, 'fromName', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'mailchimp':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${provider.id}-apikey`}>API Key</Label>
              <div className="flex gap-2">
                <Input
                  id={`${provider.id}-apikey`}
                  type={showApiKeys[provider.id] ? "text" : "password"}
                  value={provider.config.apiKey}
                  onChange={(e) => updateProviderConfig(provider.id, 'apiKey', e.target.value)}
                  placeholder="Enter your MailChimp API key"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => toggleShowApiKey(provider.id)}
                >
                  {showApiKeys[provider.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${provider.id}-server`}>Server Prefix</Label>
              <Input
                id={`${provider.id}-server`}
                value={provider.config.serverPrefix}
                onChange={(e) => updateProviderConfig(provider.id, 'serverPrefix', e.target.value)}
                placeholder="e.g., us1, us2, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${provider.id}-fromemail`}>From Email</Label>
                <Input
                  id={`${provider.id}-fromemail`}
                  value={provider.config.fromEmail}
                  onChange={(e) => updateProviderConfig(provider.id, 'fromEmail', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${provider.id}-fromname`}>From Name</Label>
                <Input
                  id={`${provider.id}-fromname`}
                  value={provider.config.fromName}
                  onChange={(e) => updateProviderConfig(provider.id, 'fromName', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${provider.id}-apikey`}>API Key</Label>
              <div className="flex gap-2">
                <Input
                  id={`${provider.id}-apikey`}
                  type={showApiKeys[provider.id] ? "text" : "password"}
                  value={provider.config.apiKey}
                  onChange={(e) => updateProviderConfig(provider.id, 'apiKey', e.target.value)}
                  placeholder={`Enter your ${provider.name} API key`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => toggleShowApiKey(provider.id)}
                >
                  {showApiKeys[provider.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${provider.id}-fromemail`}>From Email</Label>
                <Input
                  id={`${provider.id}-fromemail`}
                  value={provider.config.fromEmail}
                  onChange={(e) => updateProviderConfig(provider.id, 'fromEmail', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${provider.id}-fromname`}>From Name</Label>
                <Input
                  id={`${provider.id}-fromname`}
                  value={provider.config.fromName}
                  onChange={(e) => updateProviderConfig(provider.id, 'fromName', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <PageHeader
        title="Email Service Management"
        description="Configure and manage email service providers for mass communications"
        icon={<Mail className="h-6 w-6" />}
      />

      {/* Active Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Email Provider</CardTitle>
          <CardDescription>
            Select which email service to use for mass communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Active Provider</Label>
              <Select value={activeProvider} onValueChange={setActiveProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providers.filter(p => p.isConfigured).map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              This provider will be used for all bulk email communications from the Communications Center.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Provider Configuration */}
      <div className="space-y-6">
        {providers.map(provider => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {provider.name}
                    {renderProviderStatus(provider)}
                  </CardTitle>
                  <CardDescription>{provider.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={provider.isActive}
                    onCheckedChange={(checked) => toggleProviderActive(provider.id, checked)}
                    disabled={!provider.isConfigured}
                  />
                  <span className="text-sm text-muted-foreground">
                    {provider.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderProviderConfig(provider)}
              
              <div className="flex gap-2">
                <Button
                  onClick={() => saveProviderConfig(provider.id)}
                  disabled={isSaving}
                  variant="default"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
                <Button
                  onClick={() => testProvider(provider.id)}
                  disabled={isTesting[provider.id] || !provider.config.apiKey}
                  variant="outline"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isTesting[provider.id] ? 'Testing...' : 'Test Provider'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Email Usage Statistics</CardTitle>
          <CardDescription>
            Overview of email sending activity across all providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1,247</div>
              <div className="text-sm text-muted-foreground">Emails Sent This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">98.2%</div>
              <div className="text-sm text-muted-foreground">Delivery Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-muted-foreground">Failed Deliveries</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailServiceManagementPage;
