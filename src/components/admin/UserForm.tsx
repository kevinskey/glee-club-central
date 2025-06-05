
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { userFormSchema, UserFormValues } from '@/components/members/form/userFormSchema';
import { User } from '@/hooks/user/types';
import { z } from 'zod';
import { Upload, X, Plus } from 'lucide-react';
import { getAllRoles } from '@/utils/permissionsMap';

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  title: string;
}

export function UserForm({ user, onSubmit, onCancel, title }: UserFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar_url || '');
  const [selectedRoleTags, setSelectedRoleTags] = useState<string[]>(user?.role_tags || []);
  const [newRoleTag, setNewRoleTag] = useState('');

  // Get all available executive roles
  const availableRoles = getAllRoles();

  // Create a schema that makes password and email optional for editing
  const editUserSchema = userFormSchema.extend({
    password: user ? z.string().optional() : z.string().min(6, "Password must be at least 6 characters"),
    email: user ? z.string().email("Invalid email address").optional() : z.string().email("Invalid email address")
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<UserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: user ? {
      title: user.title || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      voice_part: (user.voice_part as "soprano_1" | "soprano_2" | "alto_1" | "alto_2" | "tenor" | "bass" | "director" | null) || null,
      role: (user.role === 'admin' ? 'admin' : user.role === 'section_leader' ? 'section_leader' : 'member') as 'admin' | 'member' | 'section_leader',
      status: (user.status as "active" | "pending" | "inactive" | "alumni") || 'active',
      class_year: user.class_year || '',
      notes: user.notes || '',
      dues_paid: user.dues_paid || false,
      is_admin: user.is_super_admin || user.role === 'admin',
      join_date: user.join_date || new Date().toISOString().split('T')[0],
      avatar_url: user.avatar_url || '',
      ecommerce_enabled: user.ecommerce_enabled || false,
      account_balance: user.account_balance || 0,
      default_shipping_address: user.default_shipping_address || '',
      design_history_ids: user.design_history_ids || [],
      current_cart_id: user.current_cart_id || '',
      password: '' // Password not required for editing
    } : {
      title: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      voice_part: null,
      role: 'member' as 'admin' | 'member' | 'section_leader',
      status: 'active' as "active" | "pending" | "inactive" | "alumni",
      class_year: '',
      notes: '',
      dues_paid: false,
      is_admin: false,
      join_date: new Date().toISOString().split('T')[0],
      avatar_url: '',
      ecommerce_enabled: false,
      account_balance: 0,
      default_shipping_address: '',
      design_history_ids: [],
      current_cart_id: '',
      password: ''
    }
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setValue('avatar_url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleFormSubmit = (data: UserFormValues) => {
    // Include role tags in the submission
    const dataWithRoleTags = {
      ...data,
      role_tags: selectedRoleTags
    };

    // If editing and password is empty, remove it from the data
    if (user && !data.password) {
      const { password, ...dataWithoutPassword } = dataWithRoleTags;
      onSubmit(dataWithoutPassword as UserFormValues);
    } else {
      onSubmit(dataWithRoleTags);
    }
  };

  const addRoleTag = () => {
    if (newRoleTag.trim() && !selectedRoleTags.includes(newRoleTag.trim())) {
      setSelectedRoleTags(prev => [...prev, newRoleTag.trim()]);
      setNewRoleTag('');
    }
  };

  const removeRoleTag = (tagToRemove: string) => {
    setSelectedRoleTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const toggleExecutiveRole = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoleTags(prev => [...prev, role]);
    } else {
      setSelectedRoleTags(prev => prev.filter(tag => tag !== role));
    }
  };

  const firstName = watch('first_name') || '';
  const lastName = watch('last_name') || '';

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview} alt="User avatar" />
              <AvatarFallback className="text-lg">
                {getInitials(firstName, lastName) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('avatar')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...register('first_name')}
              />
              {errors.first_name && (
                <p className="text-sm text-red-600">{errors.first_name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...register('last_name')}
              />
              {errors.last_name && (
                <p className="text-sm text-red-600">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email {!user && '*'}</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voice_part">Voice Part</Label>
              <Select
                value={watch('voice_part') || ''}
                onValueChange={(value: "soprano_1" | "soprano_2" | "alto_1" | "alto_2" | "tenor" | "bass" | "director") => setValue('voice_part', value)}
              >
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
              <Label htmlFor="class_year">Class Year</Label>
              <Input
                id="class_year"
                {...register('class_year')}
                placeholder="e.g., 2025"
              />
            </div>
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">System Role</Label>
              <Select
                value={watch('role')}
                onValueChange={(value: 'admin' | 'member' | 'section_leader') => setValue('role', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="section_leader">Section Leader</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value: "active" | "pending" | "inactive" | "alumni") => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Executive Board Roles */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Executive Board Roles</Label>
              <p className="text-sm text-muted-foreground">Select which executive positions this member holds</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableRoles.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={selectedRoleTags.includes(role)}
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

            {/* Custom Role Tags */}
            <div className="space-y-2">
              <Label>Additional Roles</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedRoleTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeRoleTag(tag)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newRoleTag}
                  onChange={(e) => setNewRoleTag(e.target.value)}
                  placeholder="Add custom role..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRoleTag())}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="join_date">Join Date</Label>
            <Input
              id="join_date"
              type="date"
              {...register('join_date')}
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={watch('dues_paid')}
                onCheckedChange={(checked) => setValue('dues_paid', checked)}
              />
              <Label>Dues Paid</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={watch('is_admin')}
                onCheckedChange={(checked) => setValue('is_admin', checked)}
              />
              <Label>Super Admin Privileges</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={watch('ecommerce_enabled')}
                onCheckedChange={(checked) => setValue('ecommerce_enabled', checked)}
              />
              <Label>E-commerce Access</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_balance">Account Balance</Label>
            <Input
              id="account_balance"
              type="number"
              step="0.01"
              {...register('account_balance', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_shipping_address">Default Shipping Address</Label>
            <Textarea
              id="default_shipping_address"
              {...register('default_shipping_address')}
              placeholder="Enter default shipping address..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about this member..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Add User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
