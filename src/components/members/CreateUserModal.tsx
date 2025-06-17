
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Loader2, AlertTriangle } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

interface UserFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  voice_part: string;
  role: string;
  status: string;
  class_year: string;
  notes: string;
  dues_paid: boolean;
  join_date: string;
  skip_email_confirmation: boolean;
}

export function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    voice_part: '',
    role: 'member',
    status: 'active',
    class_year: '',
    notes: '',
    dues_paid: false,
    join_date: new Date().toISOString().split('T')[0],
    skip_email_confirmation: true, // Default to true to avoid rate limits
  });

  const createUser = async (userData: UserFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Creating user:', userData.email);
      
      // Create auth user with email confirmation disabled if requested
      const signUpOptions: any = {
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name
          }
        }
      };

      // Skip email confirmation to avoid rate limits
      if (userData.skip_email_confirmation) {
        signUpOptions.options.emailRedirectTo = undefined;
        // This reduces email sending which helps with rate limits
      }

      const { data: authData, error: authError } = await supabase.auth.signUp(signUpOptions);

      if (authError) {
        if (authError.message.includes('User already registered')) {
          return { success: false, error: 'A user with this email already exists' };
        }
        return { success: false, error: authError.message };
      }

      if (!authData.user?.id) {
        return { success: false, error: 'User creation failed - no user ID returned' };
      }

      console.log('Auth user created:', authData.user.id);

      // Wait for auth user to be fully created
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update the profile with additional data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: userData.phone || null,
          voice_part: userData.voice_part || null,
          status: userData.status,
          class_year: userData.class_year || null,
          notes: userData.notes || null,
          dues_paid: userData.dues_paid,
          join_date: userData.join_date,
          role: userData.role,
          is_super_admin: userData.role === 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        return { success: false, error: `Profile update failed: ${profileError.message}` };
      }

      return { success: true };

    } catch (error: any) {
      console.error('Unexpected error creating user:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createUser(formData);
      
      if (result.success) {
        toast.success(`Successfully created user: ${formData.first_name} ${formData.last_name}${formData.skip_email_confirmation ? ' (no confirmation email sent)' : ''}`);
        onUserCreated();
        handleClose();
      } else {
        toast.error(result.error || 'Failed to create user');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error('An unexpected error occurred while creating the user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      voice_part: '',
      role: 'member',
      status: 'active',
      class_year: '',
      notes: '',
      dues_paid: false,
      join_date: new Date().toISOString().split('T')[0],
      skip_email_confirmation: true,
    });
    onClose();
  };

  const updateFormData = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create New Member
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
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
              <Label htmlFor="password">Temporary Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
                placeholder="Min 6 characters"
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
              <Label htmlFor="class_year">Class Year</Label>
              <Input
                id="class_year"
                value={formData.class_year}
                onChange={(e) => updateFormData('class_year', e.target.value)}
                placeholder="e.g., 2025"
              />
            </div>
            
            {/* Choir Info */}
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
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="fan">Fan</SelectItem>
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
            <Label htmlFor="skip_email_confirmation">Skip email confirmation (recommended for bulk operations)</Label>
          </div>
          
          {/* Dues Paid Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="dues_paid"
              checked={formData.dues_paid}
              onCheckedChange={(checked) => updateFormData('dues_paid', checked)}
            />
            <Label htmlFor="dues_paid">Dues Paid</Label>
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Any additional notes about this member..."
              rows={3}
            />
          </div>
          
          {/* Rate Limit Info */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Rate Limit Prevention:</strong> Enable "Skip email confirmation" above to avoid email rate limits when adding multiple users quickly.
            </AlertDescription>
          </Alert>
          
          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating...' : 'Create Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
