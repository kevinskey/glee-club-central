
import React from 'react';
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
import { userFormSchema, UserFormValues } from '@/components/members/form/userFormSchema';
import { User } from '@/hooks/user/types';
import { z } from 'zod';

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  title: string;
}

export function UserForm({ user, onSubmit, onCancel, title }: UserFormProps) {
  // Create a schema that makes password optional for editing
  const editUserSchema = userFormSchema.extend({
    password: user ? z.string().optional() : z.string().min(6, "Password must be at least 6 characters")
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
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      voice_part: user.voice_part || '',
      role: (user.role === 'admin' ? 'admin' : user.role === 'section_leader' ? 'section_leader' : 'member') as 'admin' | 'member' | 'section_leader',
      status: user.status || 'active',
      class_year: user.class_year || '',
      notes: user.notes || '',
      dues_paid: user.dues_paid || false,
      is_admin: user.is_super_admin || user.role === 'admin',
      join_date: user.join_date || new Date().toISOString().split('T')[0],
      password: '' // Password not required for editing
    } : {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      voice_part: '',
      role: 'member' as 'admin' | 'member' | 'section_leader',
      status: 'active',
      class_year: '',
      notes: '',
      dues_paid: false,
      is_admin: false,
      join_date: new Date().toISOString().split('T')[0],
      password: ''
    }
  });

  const handleFormSubmit = (data: UserFormValues) => {
    // If editing and password is empty, remove it from the data
    if (user && !data.password) {
      const { password, ...dataWithoutPassword } = data;
      onSubmit(dataWithoutPassword as UserFormValues);
    } else {
      onSubmit(data);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
            <Label htmlFor="email">Email *</Label>
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
                value={watch('voice_part')}
                onValueChange={(value) => setValue('voice_part', value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={watch('role')}
                onValueChange={(value: 'admin' | 'member' | 'section_leader') => setValue('role', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="section_leader">Section Leader</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value)}
              >
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="join_date">Join Date</Label>
            <Input
              id="join_date"
              type="date"
              {...register('join_date')}
            />
          </div>

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
            <Label>Admin Privileges</Label>
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
