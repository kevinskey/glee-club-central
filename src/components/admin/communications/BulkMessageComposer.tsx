import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Send, Users, Mail, Phone } from 'lucide-react';
import { useAdvancedMessaging } from '@/hooks/useAdvancedMessaging';
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

export function BulkMessageComposer() {
  const [messageType, setMessageType] = useState<"email" | "sms" | "both">("email");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterVoicePart, setFilterVoicePart] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const { sendBulkMessage, isSending } = useAdvancedMessaging();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      // Join profiles with auth.users to get email addresses
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          first_name, 
          last_name, 
          phone, 
          role, 
          voice_part,
          user_id,
          users:user_id (email)
        `)
        .eq('status', 'active')
        .order('last_name');

      if (error) throw error;
      
      // Transform the data to flatten the email from the joined users table
      const transformedData = data?.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: Array.isArray(profile.users) && profile.users.length > 0 ? profile.users[0].email : '',
        phone: profile.phone,
        role: profile.role,
        voice_part: profile.voice_part
      })) || [];

      setMembers(transformedData);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    if (filterRole !== "all" && member.role !== filterRole) return false;
    if (filterVoicePart !== "all" && member.voice_part !== filterVoicePart) return false;
    
    // Filter by message type capabilities
    if (messageType === "email" && !member.email) return false;
    if (messageType === "sms" && !member.phone) return false;
    if (messageType === "both" && (!member.email || !member.phone)) return false;
    
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

  const handleSend = async () => {
    if (!content.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    if (messageType === "email" && !subject.trim()) {
      toast.error("Please enter an email subject");
      return;
    }

    const recipients = members
      .filter(m => selectedMembers.includes(m.id))
      .map(m => ({
        id: m.id,
        email: m.email,
        phone: m.phone,
        first_name: m.first_name,
        last_name: m.last_name
      }));

    const result = await sendBulkMessage({
      type: messageType,
      recipients,
      subject,
      content
    });

    if (result.success) {
      setContent("");
      setSubject("");
      setSelectedMembers([]);
    }
  };

  if (isLoading) {
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
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Deselect All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
                    {member.voice_part && <span>• {member.voice_part}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No members match the current filters</p>
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
          <Send className="w-4 h-4" />
          {isSending ? "Sending..." : `Send to ${selectedMembers.length} Recipients`}
        </Button>
      </div>
    </div>
  );
}
