
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, Plus, Save, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getAllRoles } from '@/utils/permissionsMap';

interface DetailedProfileEditorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onSave: (userData: any) => Promise<void>;
  isSubmitting: boolean;
}

export function DetailedProfileEditor({ 
  isOpen, 
  onOpenChange, 
  user, 
  onSave, 
  isSubmitting 
}: DetailedProfileEditorProps) {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    voice_part: user?.voice_part || '',
    role: user?.role || 'member',
    status: user?.status || 'active',
    class_year: user?.class_year || '',
    notes: user?.notes || '',
    dues_paid: user?.dues_paid || false,
    join_date: user?.join_date ? new Date(user.join_date) : undefined,
    is_admin: user?.is_super_admin || false,
    role_tags: user?.role_tags || [],
    music_role: user?.music_role || 'student',
    special_roles: user?.special_roles || '',
    ecommerce_enabled: user?.ecommerce_enabled || false,
    account_balance: user?.account_balance || 0,
    default_shipping_address: user?.default_shipping_address || '',
    org: user?.org || 'default'
  });

  const [newRoleTag, setNewRoleTag] = useState('');
  const availableRoles = getAllRoles();

  const voicePartOptions = [
    { value: 'soprano_1', label: 'Soprano 1' },
    { value: 'soprano_2', label: 'Soprano 2' },
    { value: 'alto_1', label: 'Alto 1' },
    { value: 'alto_2', label: 'Alto 2' },
    { value: 'tenor', label: 'Tenor' },
    { value: 'bass', label: 'Bass' }
  ];

  const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'section_leader', label: 'Section Leader' },
    { value: 'admin', label: 'Admin' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'alumni', label: 'Alumni' }
  ];

  const musicRoleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'director', label: 'Director' },
    { value: 'accompanist', label: 'Accompanist' },
    { value: 'assistant_director', label: 'Assistant Director' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRoleTag = () => {
    if (newRoleTag.trim() && !formData.role_tags.includes(newRoleTag.trim())) {
      setFormData(prev => ({
        ...prev,
        role_tags: [...prev.role_tags, newRoleTag.trim()]
      }));
      setNewRoleTag('');
    }
  };

  const removeRoleTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      role_tags: prev.role_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const toggleExecutiveRole = (role: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        role_tags: [...prev.role_tags, role]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        role_tags: prev.role_tags.filter(tag => tag !== role)
      }));
    }
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile: {user?.first_name} {user?.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Enter last name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Music & Role Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Music & Role Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="voice_part">Voice Part</Label>
                <Select
                  value={formData.voice_part}
                  onValueChange={(value) => handleInputChange('voice_part', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice part" />
                  </SelectTrigger>
                  <SelectContent>
                    {voicePartOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">System Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="music_role">Music Role</Label>
                <Select
                  value={formData.music_role}
                  onValueChange={(value) => handleInputChange('music_role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select music role" />
                  </SelectTrigger>
                  <SelectContent>
                    {musicRoleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Executive Roles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Executive Board Roles</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableRoles.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={formData.role_tags.includes(role)}
                    onCheckedChange={(checked) => toggleExecutiveRole(role, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`role-${role}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {role}
                  </Label>
                </div>
              ))}
            </div>

            {/* Current Role Tags */}
            <div className="flex flex-wrap gap-2">
              {formData.role_tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => removeRoleTag(tag)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {/* Add Custom Role */}
            <div className="flex gap-2">
              <Input
                value={newRoleTag}
                onChange={(e) => setNewRoleTag(e.target.value)}
                placeholder="Add custom role..."
                onKeyPress={(e) => e.key === 'Enter' && addRoleTag()}
              />
              <Button
                type="button"
                onClick={addRoleTag}
                size="sm"
                disabled={!newRoleTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Membership Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Membership Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_year">Class Year</Label>
                <Input
                  id="class_year"
                  value={formData.class_year}
                  onChange={(e) => handleInputChange('class_year', e.target.value)}
                  placeholder="Enter class year (e.g., 2025)"
                />
              </div>

              <div className="space-y-2">
                <Label>Join Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.join_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.join_date ? format(formData.join_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.join_date}
                      onSelect={(date) => handleInputChange('join_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="special_roles">Special Roles</Label>
                <Input
                  id="special_roles"
                  value={formData.special_roles}
                  onChange={(e) => handleInputChange('special_roles', e.target.value)}
                  placeholder="Any special roles or titles"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dues_paid"
                  checked={formData.dues_paid}
                  onCheckedChange={(checked) => handleInputChange('dues_paid', checked)}
                />
                <Label htmlFor="dues_paid">Dues Paid</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_admin"
                  checked={formData.is_admin}
                  onCheckedChange={(checked) => handleInputChange('is_admin', checked)}
                />
                <Label htmlFor="is_admin">Super Admin</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ecommerce_enabled"
                  checked={formData.ecommerce_enabled}
                  onCheckedChange={(checked) => handleInputChange('ecommerce_enabled', checked)}
                />
                <Label htmlFor="ecommerce_enabled">E-commerce Enabled</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account_balance">Account Balance</Label>
                <Input
                  id="account_balance"
                  type="number"
                  step="0.01"
                  value={formData.account_balance}
                  onChange={(e) => handleInputChange('account_balance', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org">Organization</Label>
                <Input
                  id="org"
                  value={formData.org}
                  onChange={(e) => handleInputChange('org', e.target.value)}
                  placeholder="Organization"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_shipping_address">Default Shipping Address</Label>
              <Textarea
                id="default_shipping_address"
                value={formData.default_shipping_address}
                onChange={(e) => handleInputChange('default_shipping_address', e.target.value)}
                rows={3}
                placeholder="Enter default shipping address..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)} 
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
