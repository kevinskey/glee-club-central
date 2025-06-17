
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, AlertTriangle } from 'lucide-react';
import { UserFormValues } from './form/userFormSchema';

interface AddMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberAdd: (data: UserFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function AddMemberDialog({ isOpen, onOpenChange, onMemberAdd, isSubmitting }: AddMemberDialogProps) {
  const [formData, setFormData] = useState<UserFormValues>({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    voice_part: '',
    status: 'active',
    class_year: '',
    notes: '',
    join_date: new Date().toISOString().split('T')[0],
    dues_paid: false,
    is_admin: false,
    skip_email_confirmation: true, // Default to true for rate limit prevention
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onMemberAdd(formData);
      // Reset form on success
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        voice_part: '',
        status: 'active',
        class_year: '',
        notes: '',
        join_date: new Date().toISOString().split('T')[0],
        dues_paid: false,
        is_admin: false,
        skip_email_confirmation: true,
      });
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const updateFormData = (field: keyof UserFormValues, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Member
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => updateFormData('first_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => updateFormData('last_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="voice_part">Voice Part</Label>
              <Select value={formData.voice_part} onValueChange={(value) => updateFormData('voice_part', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice part" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soprano_1">Soprano 1</SelectItem>
                  <SelectItem value="soprano_2">Soprano 2</SelectItem>
                  <SelectItem value="alto_1">Alto 1</SelectItem>
                  <SelectItem value="alto_2">Alto 2</SelectItem>
                  <SelectItem value="tenor">Tenor</SelectItem>
                  <SelectItem value="bass">Bass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class_year">Class Year</Label>
              <Input
                id="class_year"
                value={formData.class_year}
                onChange={(e) => updateFormData('class_year', e.target.value)}
                placeholder="e.g., 2025"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="join_date">Join Date</Label>
              <Input
                id="join_date"
                type="date"
                value={formData.join_date}
                onChange={(e) => updateFormData('join_date', e.target.value)}
              />
            </div>
          </div>
          
          {/* Email Confirmation Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="skip_email_confirmation"
              checked={formData.skip_email_confirmation}
              onCheckedChange={(checked) => updateFormData('skip_email_confirmation', checked)}
            />
            <Label htmlFor="skip_email_confirmation">Skip email confirmation (recommended to avoid rate limits)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="dues_paid"
              checked={formData.dues_paid}
              onCheckedChange={(checked) => updateFormData('dues_paid', checked)}
            />
            <Label htmlFor="dues_paid">Dues Paid</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_admin"
              checked={formData.is_admin}
              onCheckedChange={(checked) => updateFormData('is_admin', checked)}
            />
            <Label htmlFor="is_admin">Admin Role</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Any additional notes..."
            />
          </div>
          
          {/* Rate Limit Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Rate Limit Prevention:</strong> "Skip email confirmation" is enabled by default to prevent email rate limits when adding multiple users.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
