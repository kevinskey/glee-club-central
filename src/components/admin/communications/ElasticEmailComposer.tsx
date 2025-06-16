
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Send, 
  FileText, 
  Users, 
  Eye, 
  RefreshCw,
  Mail,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedUserManagement } from '@/hooks/user/useUnifiedUserManagement';
import { toast } from 'sonner';

interface ElasticTemplate {
  templateid: string;
  name: string;
  subject: string;
  body: string;
  templatetype: string;
  datecreated: string;
}

interface Recipient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  selected: boolean;
}

export function ElasticEmailComposer() {
  const [templates, setTemplates] = useState<ElasticTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ElasticTemplate | null>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'unknown'>('unknown');
  const [debugInfo, setDebugInfo] = useState<string>('');

  const { filteredUsers } = useUnifiedUserManagement();

  useEffect(() => {
    loadTemplates();
    loadRecipients();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    setConnectionStatus('checking');
    
    try {
      console.log('🔄 Fetching templates from Elastic Email...');
      
      const { data, error } = await supabase.functions.invoke('elastic-email-sync', {
        body: { action: 'sync_templates' }
      });

      console.log('📧 Elastic Email Response:', { data, error });

      if (error) {
        console.error('❌ Supabase Function Error:', error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      // Check if the response indicates success or failure
      if (data?.success === false) {
        console.error('❌ Elastic Email API Error:', data.error);
        setConnectionStatus('error');
        setDebugInfo(`❌ API Error: ${data.error}`);
        setError(`Elastic Email API Error: ${data.error}`);
        toast.error(`Connection failed: ${data.error}`);
        return;
      }
      
      // Ensure templates is always an array
      const templatesData = data?.templates || [];
      console.log('📝 Templates received:', templatesData);
      
      if (Array.isArray(templatesData)) {
        setTemplates(templatesData);
        setConnectionStatus('connected');
        setDebugInfo(`✅ Successfully connected! Found ${templatesData.length} templates`);
        
        if (templatesData.length === 0) {
          toast.info('Connected to Elastic Email, but no templates found');
        } else {
          toast.success(`Connected! Loaded ${templatesData.length} templates`);
        }
      } else {
        console.warn('⚠️ Templates data is not an array:', templatesData);
        setTemplates([]);
        setConnectionStatus('connected'); // Still connected, just no templates
        setDebugInfo('✅ Connected to Elastic Email (no templates found)');
        toast.info('Connected to Elastic Email, but no templates available');
      }
    } catch (error: any) {
      console.error('💥 Error loading templates:', error);
      setError('Failed to connect to Elastic Email');
      setTemplates([]);
      setConnectionStatus('error');
      setDebugInfo(`❌ Connection failed: ${error.message || 'Unknown error'}`);
      toast.error('Failed to connect to Elastic Email - check your API key');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecipients = () => {
    try {
      const memberRecipients: Recipient[] = filteredUsers
        .filter(user => user.email)
        .map(user => ({
          id: user.id,
          first_name: user.first_name || 'Unknown',
          last_name: user.last_name || 'User',
          email: user.email!,
          selected: false
        }));
      
      setRecipients(memberRecipients);
    } catch (error) {
      console.error('Error loading recipients:', error);
      setRecipients([]);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.templateid === templateId);
    if (template) {
      setSelectedTemplate(template);
      setSubject(template.subject);
      setContent(template.body);
    }
  };

  const handleRecipientToggle = (recipientId: string) => {
    setSelectedRecipients(prev => 
      prev.includes(recipientId) 
        ? prev.filter(id => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const handleSelectAllRecipients = () => {
    if (selectedRecipients.length === recipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(recipients.map(r => r.id));
    }
  };

  const previewEmail = () => {
    const selectedRecipientsData = recipients.filter(r => 
      selectedRecipients.includes(r.id)
    );

    if (selectedRecipientsData.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    // Open preview in new window/modal
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      const recipientsList = selectedRecipientsData.map(r => `${r.first_name} ${r.last_name} (${r.email})`).join(', ');
      
      previewWindow.document.write(`
        <html>
          <head><title>Email Preview</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Email Preview</h2>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Recipients:</strong> ${selectedRecipientsData.length} members</p>
            <p><strong>Recipient List:</strong> ${recipientsList}</p>
            <hr>
            <div style="border: 1px solid #ddd; padding: 20px; margin-top: 20px;">
              ${content}
            </div>
          </body>
        </html>
      `);
    }
  };

  const sendEmail = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error('Please fill in subject and content');
      return;
    }

    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    setIsSending(true);
    try {
      const selectedRecipientsData = recipients.filter(r => 
        selectedRecipients.includes(r.id)
      );

      for (const recipient of selectedRecipientsData) {
        const personalizedContent = content
          .replace(/{{first_name}}/g, recipient.first_name)
          .replace(/{{last_name}}/g, recipient.last_name)
          .replace(/{{email}}/g, recipient.email);

        const { error } = await supabase.functions.invoke('send-email', {
          body: {
            to: recipient.email,
            subject: subject,
            content: personalizedContent,
            userId: recipient.id
          }
        });

        if (error) throw error;
      }

      toast.success(`Email sent to ${selectedRecipientsData.length} recipients`);
      
      // Reset form
      setSubject('');
      setContent('');
      setSelectedRecipients([]);
      setSelectedTemplate(null);
      
    } catch (error) {
      console.error('Error sending emails:', error);
      toast.error('Failed to send emails');
    } finally {
      setIsSending(false);
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'checking':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (error && connectionStatus === 'error') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Connection Failed</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{error}</p>
          {debugInfo && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
              <strong>Details:</strong> {debugInfo}
            </div>
          )}
          <div className="mt-4 space-y-2">
            <Button onClick={loadTemplates} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Make sure your Elastic Email API key is valid and has the correct permissions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Elastic Email Composer
            <div className="flex items-center gap-2 ml-auto">
              {getConnectionStatusIcon()}
              <span className={`text-sm font-medium ${getConnectionStatusColor()}`}>
                {connectionStatus === 'connected' && 'Connected'}
                {connectionStatus === 'checking' && 'Connecting...'}
                {connectionStatus === 'error' && 'Connection Error'}
                {connectionStatus === 'unknown' && 'Not Connected'}
              </span>
            </div>
          </CardTitle>
          {debugInfo && (
            <div className={`mt-2 p-3 rounded text-sm border ${
              connectionStatus === 'connected' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : connectionStatus === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <strong>Status:</strong> {debugInfo}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="recipients">Recipients ({selectedRecipients.length})</TabsTrigger>
              <TabsTrigger value="templates">
                Templates ({templates.length})
                {connectionStatus === 'connected' && templates.length === 0 && (
                  <Badge variant="outline" className="ml-2">Empty</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-2">
                <Label>Choose Template (Optional)</Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.templateid} value={template.templateid}>
                        {template.name} - {template.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <Badge variant="outline">
                    Using: {selectedTemplate.name}
                  </Badge>
                )}
              </div>

              {/* Email Content */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Email Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    placeholder="Enter your email content here... You can use {{first_name}}, {{last_name}}, {{email}} for personalization."
                  />
                  <p className="text-sm text-muted-foreground">
                    Use personalization tags: {`{{first_name}}, {{last_name}}, {{email}}`}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  onClick={previewEmail}
                  variant="outline"
                  disabled={!subject || !content || selectedRecipients.length === 0}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  onClick={sendEmail}
                  disabled={isSending || !subject || !content || selectedRecipients.length === 0}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSending ? 'Sending...' : `Send to ${selectedRecipients.length} Recipients`}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="recipients" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Select Recipients</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllRecipients}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {selectedRecipients.length === recipients.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center space-x-2 p-2 border rounded-lg"
                  >
                    <Checkbox
                      checked={selectedRecipients.includes(recipient.id)}
                      onCheckedChange={() => handleRecipientToggle(recipient.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        {recipient.first_name} {recipient.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {recipient.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Available Templates</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadTemplates}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {templates.length === 0 && connectionStatus === 'connected' ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No templates found in your Elastic Email account</p>
                  <p className="text-sm">Create templates in Elastic Email to use them here</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {templates.map((template) => (
                    <Card key={template.templateid} className="cursor-pointer hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {template.subject}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{template.templatetype}</Badge>
                              <span className="text-xs text-muted-foreground">
                                Created {new Date(template.datecreated).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTemplateSelect(template.templateid)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
