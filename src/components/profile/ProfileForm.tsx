
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, Edit, Save, X, ShoppingCart, CreditCard } from 'lucide-react';
import { AuthUser, Profile } from '@/types/auth';

interface ProfileFormProps {
  user: AuthUser;
  profile: Profile | null;
  isEditing: boolean;
  isSaving: boolean;
  editedProfile: Partial<Profile>;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onInputChange: (field: string, value: string | boolean | number) => void;
}

export function ProfileForm({
  user,
  profile,
  isEditing,
  isSaving,
  editedProfile,
  onEdit,
  onCancel,
  onSave,
  onInputChange
}: ProfileFormProps) {
  const voicePartOptions = [
    { value: 'soprano_1', label: 'Soprano 1' },
    { value: 'soprano_2', label: 'Soprano 2' },
    { value: 'alto_1', label: 'Alto 1' },
    { value: 'alto_2', label: 'Alto 2' },
    { value: 'tenor', label: 'Tenor' },
    { value: 'bass', label: 'Bass' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                {isEditing ? 'Edit your profile information' : 'View your profile details'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={onCancel} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={onSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              {isEditing ? (
                <Input
                  id="first_name"
                  value={editedProfile.first_name || ''}
                  onChange={(e) => onInputChange('first_name', e.target.value)}
                  placeholder="Enter first name"
                />
              ) : (
                <div className="py-2 px-3 bg-muted rounded text-sm">
                  {profile?.first_name || 'Not provided'}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              {isEditing ? (
                <Input
                  id="last_name"
                  value={editedProfile.last_name || ''}
                  onChange={(e) => onInputChange('last_name', e.target.value)}
                  placeholder="Enter last name"
                />
              ) : (
                <div className="py-2 px-3 bg-muted rounded text-sm">
                  {profile?.last_name || 'Not provided'}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="py-2 px-3 bg-muted rounded text-sm">
              {user?.email || 'Not provided'}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={editedProfile.phone || ''}
                onChange={(e) => onInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            ) : (
              <div className="py-2 px-3 bg-muted rounded text-sm">
                {profile?.phone || 'Not provided'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice_part">Voice Part</Label>
            {isEditing ? (
              <Select
                value={editedProfile.voice_part || ''}
                onValueChange={(value) => onInputChange('voice_part', value)}
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
            ) : (
              <div className="py-2 px-3 bg-muted rounded text-sm">
                {voicePartOptions.find(opt => opt.value === profile?.voice_part)?.label || profile?.voice_part || 'Not assigned'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="class_year">Class Year</Label>
            {isEditing ? (
              <Input
                id="class_year"
                value={editedProfile.class_year || ''}
                onChange={(e) => onInputChange('class_year', e.target.value)}
                placeholder="Enter class year (e.g., 2025)"
              />
            ) : (
              <div className="py-2 px-3 bg-muted rounded text-sm">
                {profile?.class_year || 'Not provided'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                value={editedProfile.notes || ''}
                onChange={(e) => onInputChange('notes', e.target.value)}
                rows={3}
                placeholder="Add any additional notes..."
              />
            ) : (
              <div className="py-2 px-3 bg-muted rounded text-sm min-h-[80px]">
                {profile?.notes || 'No notes'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* E-commerce Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            E-commerce Settings
          </CardTitle>
          <CardDescription>
            Manage your store and design access settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ecommerce_enabled">E-commerce Access</Label>
              <p className="text-sm text-muted-foreground">
                Enable access to the design studio and store features
              </p>
            </div>
            {isEditing ? (
              <Switch
                id="ecommerce_enabled"
                checked={editedProfile.ecommerce_enabled || false}
                onCheckedChange={(checked) => onInputChange('ecommerce_enabled', checked)}
              />
            ) : (
              <div className="py-2 px-3 bg-muted rounded text-sm">
                {profile?.ecommerce_enabled ? 'Enabled' : 'Disabled'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_balance" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Account Balance
            </Label>
            {isEditing ? (
              <Input
                id="account_balance"
                type="number"
                step="0.01"
                min="0"
                value={editedProfile.account_balance || 0}
                onChange={(e) => onInputChange('account_balance', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            ) : (
              <div className="py-2 px-3 bg-muted rounded text-sm">
                ${(profile?.account_balance || 0).toFixed(2)}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_shipping_address">Default Shipping Address</Label>
            {isEditing ? (
              <Textarea
                id="default_shipping_address"
                value={editedProfile.default_shipping_address || ''}
                onChange={(e) => onInputChange('default_shipping_address', e.target.value)}
                rows={3}
                placeholder="Enter your default shipping address..."
              />
            ) : (
              <div className="py-2 px-3 bg-muted rounded text-sm min-h-[80px]">
                {profile?.default_shipping_address || 'No default address set'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Design History</Label>
            <div className="py-2 px-3 bg-muted rounded text-sm">
              {profile?.design_history_ids?.length ? 
                `${profile.design_history_ids.length} saved designs` : 
                'No saved designs'
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
