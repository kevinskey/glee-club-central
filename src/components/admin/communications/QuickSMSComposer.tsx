
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Send, Plus, X } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { toast } from 'sonner';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export function QuickSMSComposer() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [content, setContent] = useState('');
  const [customNumbers, setCustomNumbers] = useState<string[]>([]);
  const { sendSMS, isSending } = useMessaging();

  const validatePhoneNumber = (number: string): boolean => {
    try {
      return isValidPhoneNumber(number, 'US'); // Default to US, could be made configurable
    } catch {
      return false;
    }
  };

  const formatPhoneNumber = (number: string): string => {
    try {
      const parsed = parsePhoneNumber(number, 'US');
      return parsed.formatInternational();
    } catch {
      return number;
    }
  };

  const addCustomNumber = () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    const formatted = formatPhoneNumber(phoneNumber);
    
    if (customNumbers.includes(formatted)) {
      toast.error('This number is already in the list');
      return;
    }

    setCustomNumbers(prev => [...prev, formatted]);
    setPhoneNumber('');
    toast.success('Phone number added');
  };

  const removeCustomNumber = (numberToRemove: string) => {
    setCustomNumbers(prev => prev.filter(num => num !== numberToRemove));
  };

  const handleSendSingle = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const formatted = formatPhoneNumber(phoneNumber);
    const result = await sendSMS(formatted, content);
    
    if (result.success) {
      setPhoneNumber('');
      setContent('');
    }
  };

  const handleSendBulk = async () => {
    if (customNumbers.length === 0) {
      toast.error('Please add at least one phone number');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const number of customNumbers) {
      const result = await sendSMS(number, content);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully sent ${successCount} message(s)`);
    }
    
    if (failCount > 0) {
      toast.error(`Failed to send ${failCount} message(s)`);
    }

    if (successCount === customNumbers.length) {
      setContent('');
      setCustomNumbers([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Single SMS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Send Quick SMS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCustomNumber}
                  className="px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +1 for US)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your message..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {content.length}/160 characters
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSendSingle}
              disabled={isSending || !phoneNumber.trim() || !content.trim()}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Send SMS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk SMS to Custom Numbers */}
      {customNumbers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Bulk SMS ({customNumbers.length} numbers)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Custom Numbers List */}
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {customNumbers.map((number, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <span className="text-sm font-mono">{number}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomNumber(number)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCustomNumbers([])}
                disabled={isSending}
              >
                Clear All
              </Button>
              <Button 
                onClick={handleSendBulk}
                disabled={isSending || customNumbers.length === 0 || !content.trim()}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Sending...' : `Send to ${customNumbers.length} Numbers`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
