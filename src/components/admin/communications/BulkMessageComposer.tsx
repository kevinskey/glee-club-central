import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Send, Users, Mail, Phone, Search } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  voice_part?: string;
}

interface AuthUser {
  id: string;
  email?: string;
}

export function BulkMessageComposer() {
  const [messageType, setMessageType] = useState<"email" | "sms" | "both">("email");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterVoicePart, setFilterVoicePart] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const { sendEmail, sendSMS } = useMessaging();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      console.log('Loading members for bulk messaging...');
      
      // Get current user first to check permissions
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to access this feature');
        return;
      }

      // Get profiles data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, role, voice_part')
        .eq('status', 'active')
        .order('last_name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      if (!profilesData || profilesData.length === 0) {
        console.log('No profiles found');
        setMembers([]);
        return;
      }

      console.log('Profiles loaded:', profilesData.length);

      // Try to get user emails from auth admin (will work for admin users)
      let emailMap = new Map<string, string>();
      try {
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authUsers?.users && !authError) {
          (authUsers.users as AuthUser[]).forEach((authUser: AuthUser) => {
            if (authUser.email && authUser.id) {
              emailMap.set(authUser.id, authUser.email);
            }
          });
        } else {
          console.warn('Could not fetch auth users, using current user email only');
          // Fall back to current user's email for their own profile
          if (user.email) {
            emailMap.set(user.id, user.email);
          }
        }
      } catch (authError) {
        console.warn('Auth admin access failed, using fallback:', authError);
        if (user.email) {
          emailMap.set(user.id, user.email);
        }
      }

      // Combine profile data with emails
      const transformedData: Member[] = profilesData.map(profile => ({
        id: profile.id,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: emailMap.get(profile.id) || '',
        phone: profile.phone || '',
        role: profile.role || 'member',
        voice_part: profile.voice_part
      }));

      console.log('Members processed:', transformedData.length);
      console.log('Members with phone numbers:', transformedData.filter(m => m.phone).length);
      console.log('Members with emails:', transformedData.filter(m => m.email).length);
      
      setMembers(transformedData);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    // Apply role filter
    if (filterRole !== "all" && member.role !== filterRole) return false;
    
    // Apply voice part filter  
    if (filterVoicePart !== "all" && member.voice_part !== filterVoicePart) return false;
    
    // Apply message type filter - this was the main issue!
    if (messageType === "email" && !member.email) return false;
    if (messageType === "sms" && !member.phone) return false;
    if (messageType === "both" && (!member.email || !member.phone)) return false;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
      const email = member.email?.toLowerCase() || '';
      return fullName.includes(query) || email.includes(query);
    }
    
    return true;
  });

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    setSelectedMembers(filteredMembers.map(m => m.id));
  };

  const handleDeselectAll = () => {
    setSelectedMembers([]);
  };

  const sendBulkEmails = async (recipients: Member[]) => {
    let successCount = 0;
    let failCount = 0;

    for (const recipient of recipients) {
      if (!recipient.email) continue;

      // Personalize content
      const personalizedContent = content
        .replace(/{{first_name}}/g, recipient.first_name)
        .replace(/{{last_name}}/g, recipient.last_name);

      const result = await sendEmail(recipient.email, subject, personalizedContent);
      
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }

      // Small delay to avoid overwhelming the email service
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return { successCount, failCount };
  };

  const sendBulkSMS = async (recipients: Member[]) => {
    let successCount = 0;
    let failCount = 0;

    for (const recipient of recipients) {
      if (!recipient.phone) continue;

      // Personalize content
      const personalizedContent = content
        .replace(/{{first_name}}/g, recipient.first_name)
        .replace(/{{last_name}}/g, recipient.last_name);

      const result = await sendSMS(recipient.phone, personalizedContent);
      
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }

      // Small delay to avoid overwhelming the SMS service
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return { successCount, failCount };
  };

  const handleSend = async () => {
    if (!content.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    if ((messageType === "email" || messageType === "both") && !subject.trim()) {
      toast.error("Please enter an email subject");
      return;
    }

    const recipients = members.filter(m => selectedMembers.includes(m.id));
    setIsSending(true);

    try {
      if (messageType === "both") {
        // Send both email and SMS
        const emailRecipients = recipients.filter(r => r.email);
        const smsRecipients = recipients.filter(r => r.phone);

        let totalSuccess = 0;
        let totalFail = 0;

        if (emailRecipients.length > 0) {
          const emailResults = await sendBulkEmails(emailRecipients);
          totalSuccess += emailResults.successCount;
          totalFail += emailResults.failCount;
        }

        if (smsRecipients.length > 0) {
          const smsResults = await sendBulkSMS(smsRecipients);
          totalSuccess += smsResults.successCount;
          totalFail += smsResults.failCount;
        }

        if (totalSuccess > 0) {
          toast.success(`Successfully sent ${totalSuccess} message(s)`);
        }
        if (totalFail > 0) {
          toast.error(`Failed to send ${totalFail} message(s)`);
        }
      } else if (messageType === "email") {
        const emailRecipients = recipients.filter(r => r.email);
        const results = await sendBulkEmails(emailRecipients);
        
        if (results.successCount > 0) {
          toast.success(`Successfully sent ${results.successCount} email(s)`);
        }
        if (results.failCount > 0) {
          toast.error(`Failed to send ${results.failCount} email(s)`);
        }
      } else if (messageType === "sms") {
        const smsRecipients = recipients.filter(r => r.phone);
        const results = await sendBulkSMS(smsRecipients);
        
        if (results.successCount > 0) {
          toast.success(`Successfully sent ${results.successCount} SMS message(s)`);
        }
        if (results.failCount > 0) {
          toast.error(`Failed to send ${results.failCount} SMS message(s)`);
        }
      }

      // Reset form on success
      setContent("");
      setSubject("");
      setSelectedMembers([]);
    } catch (error) {
      console.error('Error sending messages:', error);
      toast.error('Failed to send messages');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-2">Loading members...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Compose Bulk Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message Type Selection */}
          <div className="space-y-2">
            <Label>Message Type</Label>
            <Select value={messageType} onValueChange={(value: any) => setMessageType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Only
                  </div>
                </SelectItem>
                <SelectItem value="sms">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    SMS Only
                  </div>
                </SelectItem>
                <SelectItem value="both">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <Phone className="w-4 h-4" />
                    Both Email & SMS
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject (for email) */}
          {(messageType === "email" || messageType === "both") && (
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
              />
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Message Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your message... You can use {{first_name}} and {{last_name}} for personalization."
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              Use {`{{first_name}}`} and {`{{last_name}}`} for personalization
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recipient Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Recipients ({selectedMembers.length} selected)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All ({filteredMembers.length})
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Deselect All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Field */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Recipients</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Filter by Role</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="member">Members</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                  <SelectItem value="director">Directors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filter by Voice Part</Label>
              <Select value={filterVoicePart} onValueChange={setFilterVoicePart}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Voice Parts</SelectItem>
                  <SelectItem value="soprano_1">Soprano 1</SelectItem>
                  <SelectItem value="soprano_2">Soprano 2</SelectItem>
                  <SelectItem value="alto_1">Alto 1</SelectItem>
                  <SelectItem value="alto_2">Alto 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {members.length} members
            {messageType === "sms" && ` (${filteredMembers.filter(m => m.phone).length} with phone numbers)`}
            {messageType === "email" && ` (${filteredMembers.filter(m => m.email).length} with email addresses)`}
            {messageType === "both" && ` (${filteredMembers.filter(m => m.email && m.phone).length} with both email and phone)`}
          </div>

          {/* Member List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleMemberToggle(member.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">
                    {member.first_name} {member.last_name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {member.email && (
                      <Badge variant="outline" className="text-xs">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Badge>
                    )}
                    {member.phone && (
                      <Badge variant="outline" className="text-xs">
                        <Phone className="w-3 h-3 mr-1" />
                        SMS
                      </Badge>
                    )}
                    <span>{member.role}</span>
                    {member.voice_part && <span>• {member.voice_part.replace('_', ' ')}</span>}
                  </div>
                  {member.email && <p className="text-xs text-muted-foreground">{member.email}</p>}
                  {member.phone && <p className="text-xs text-muted-foreground">{member.phone}</p>}
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No members match the current filters</p>
              {messageType === "sms" && (
                <p className="text-sm mt-2">
                  Make sure members have phone numbers in their profiles for SMS messaging
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSend} 
          disabled={isSending || selectedMembers.length === 0 || !content.trim()}
          size="lg"
          className="gap-2"
        >
          <Send className="w-4 w-4" />
          {isSending ? "Sending..." : `Send to ${selectedMembers.length} Recipients`}
        </Button>
      </div>
    </div>
  );
}
