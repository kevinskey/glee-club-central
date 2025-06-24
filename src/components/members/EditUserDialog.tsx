
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { UserFormValues } from './form/userFormSchema';
import { toast } from 'sonner';

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: UserFormValues) => Promise<void>;
  isSubmitting: boolean;
  user: any;
}

// These values must match exactly what's in the database constraint
const VOICE_PARTS = [
  { value: 'soprano_1', label: 'Soprano 1' },
  { value: 'soprano_2', label: 'Soprano 2' },
  { value: 'alto_1', label: 'Alto 1' },
  { value: 'alto_2', label: 'Alto 2' },
  { value: 'tenor', label: 'Tenor' },
  { value: 'bass', label: 'Bass' },
  { value: 'director', label: 'Director' }
];

const ROLES = [
  { value: 'member', label: 'Member' },
  { value: 'section_leader', label: 'Section Leader' },
  { value: 'admin', label: 'Admin' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'alumni', label: 'Alumni' }
];

export function EditUserDialog({
  isOpen,
  onOpenChange,
  onSave,
  isSubmitting,
  user
}: EditUserDialogProps) {
  const [formData, setFormData] = useState<UserFormValues>({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    voice_part: undefined,
    role: 'member',
    status: 'active',
    class_year: '',
    notes: '',
    join_date: '',
    dues_paid: false,
    is_admin: false,
    skip_email_confirmation: true
  });

  const [emailUpdateRequested, setEmailUpdateRequested] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        voice_part: user.voice_part || undefined,
        role: user.role || 'member',
        status: user.status || 'active',
        class_year: user.class_year || '',
        notes: user.notes || '',
        join_date: user.join_date || '',
        dues_paid: user.dues_paid || false,
        is_admin: user.is_super_admin || user.is_admin || false,
        skip_email_confirmation: true
      });
      setEmailUpdateRequested(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting form data:', formData);
    
    // Validate required fields
    if (!formData.first_name?.trim()) {
      console.error('First name is required');
      toast.error('First name is required');
      return;
    }
    
    if (!formData.last_name?.trim()) {
      console.error('Last name is required');
      toast.error('Last name is required');
      return;
    }

    // Clean up the data before sending
    const cleanData = {
      ...formData,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone?.trim() || undefined,
      class_year: formData.class_year?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
      // Only include voice_part if it's actually selected
      voice_part: formData.voice_part || undefined,
      // Include email update flag
      email_update_requested: emailUpdateRequested
    };

    console.log('Clean data being sent:', cleanData);

    try {
      await onSave(cleanData);
      setEmailUpdateRequested(false);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleFieldChange = (field: keyof UserFormValues, value: any) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailChange = (value: string) => {
    handleFieldChange('email', value);
    // Mark that an email update was requested if the email changed
    if (value !== user?.email) {
      setEmailUpdateRequested(true);
    } else {
      setEmailUpdateRequested(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleFieldChange('first_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleFieldChange('last_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
                {emailUpdateRequested && (
                  <p className="text-xs text-amber-600">
                    ⚠️ Email change requested - user will need to confirm via email
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Music Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Music Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="voice_part">Voice Part</Label>
              <Select 
                value={formData.voice_part || 'none'} 
                onValueChange={(value) => handleFieldChange('voice_part', value === 'none' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select voice part" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {VOICE_PARTS.map((part) => (
                    <SelectItem key={part.value} value={part.value}>
                      {part.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Dues Paid</Label>
                <p className="text-sm text-muted-foreground">
                  Has this member paid their dues?
                </p>
              </div>
              <Switch
                checked={formData.dues_paid}
                onCheckedChange={(checked) => handleFieldChange('dues_paid', checked)}
              />
            </div>
          </div>

          {/* Administrative */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Administrative</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleFieldChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleFieldChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class_year">Class Year</Label>
                <Input
                  id="class_year"
                  value={formData.class_year}
                  onChange={(e) => handleFieldChange('class_year', e.target.value)}
                  placeholder="e.g., 2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="join_date">Join Date</Label>
                <Input
                  id="join_date"
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => handleFieldChange('join_date', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Admin Privileges</Label>
                <p className="text-sm text-muted-foreground">
                  Grant administrative access
                </p>
              </div>
              <Switch
                checked={formData.is_admin}
                onCheckedChange={(checked) => handleFieldChange('is_admin', checked)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              placeholder="Additional notes about this member..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-glee-spelman hover:bg-glee-spelman/90"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
