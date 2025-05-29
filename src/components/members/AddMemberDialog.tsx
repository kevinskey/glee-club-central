
import React, { useState } from 'react';
import { Loader2, Camera } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userFormSchema, UserFormValues } from './form/userFormSchema';
import { PhotoUploadModal } from './PhotoUploadModal';

interface AddMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberAdd: (data: UserFormValues) => void;
  isSubmitting: boolean;
  initialValues?: Partial<UserFormValues>;
  isEditing?: boolean;
}

const titleOptions = [
  'Dr.',
  'Prof.',
  'Rev.',
  'Mr.',
  'Mrs.',
  'Ms.',
  'Miss',
  'Sir',
  'Madam',
  'Lord',
  'Lady',
  'Hon.',
  'Capt.',
  'Col.',
  'Lt.',
  'Maj.',
  'Sgt.'
];

export function AddMemberDialog({
  isOpen,
  onOpenChange,
  onMemberAdd,
  isSubmitting,
  initialValues,
  isEditing = false
}: AddMemberDialogProps) {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(initialValues?.avatar_url || '');

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      title: initialValues?.title || '',
      first_name: initialValues?.first_name || '',
      last_name: initialValues?.last_name || '',
      email: initialValues?.email || '',
      password: '',
      phone: initialValues?.phone || '',
      role: initialValues?.role || 'student',
      voice_part: initialValues?.voice_part || 'soprano_1',
      status: initialValues?.status || 'active',
      join_date: initialValues?.join_date || format(new Date(), 'yyyy-MM-dd'),
      class_year: initialValues?.class_year || '',
      notes: initialValues?.notes || '',
      dues_paid: initialValues?.dues_paid || false,
      is_admin: initialValues?.is_admin || false,
      avatar_url: initialValues?.avatar_url || ''
    },
  });

  const onSubmit = (data: z.infer<typeof userFormSchema>) => {
    // Include the selected photo in the form data
    const formDataWithPhoto = {
      ...data,
      avatar_url: selectedPhoto
    };
    onMemberAdd(formDataWithPhoto);
  };

  const handlePhotoSelect = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    form.setValue('avatar_url', photoUrl);
  };

  const title = form.watch('title');
  const firstName = form.watch('first_name');
  const lastName = form.watch('last_name');
  const displayName = `${title ? title + ' ' : ''}${firstName} ${lastName}`.trim();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Member' : 'Add New Member'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update member information below.' : 'Enter the details for the new member below.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center space-y-3 p-4 border rounded-lg bg-muted/30">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedPhoto} alt="Profile photo" />
                  <AvatarFallback className="text-lg">
                    {displayName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {selectedPhoto ? 'Change Photo' : 'Add Photo'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {titleOptions.map((title) => (
                            <SelectItem key={title} value={title}>
                              {title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jane.doe@example.com" {...field} readOnly={isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {!isEditing && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="555-123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="voice_part"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Part</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select voice part" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="soprano_1">Soprano 1</SelectItem>
                          <SelectItem value="soprano_2">Soprano 2</SelectItem>
                          <SelectItem value="alto_1">Alto 1</SelectItem>
                          <SelectItem value="alto_2">Alto 2</SelectItem>
                          <SelectItem value="tenor">Tenor</SelectItem>
                          <SelectItem value="bass">Bass</SelectItem>
                          <SelectItem value="director">Director</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("is_admin", value === "admin");
                        }}
                        defaultValue={field.value || "student"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="section_leader">Section Leader</SelectItem>
                          <SelectItem value="student">Student Member</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="guest">Guest/Alumni</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="alumni">Alumni</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="join_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Join Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="class_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Year</FormLabel>
                      <FormControl>
                        <Input placeholder="2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dues_paid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Dues Paid
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes about this member..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-glee-spelman hover:bg-glee-spelman/90">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    isEditing ? 'Update Member' : 'Add Member'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onPhotoSelect={handlePhotoSelect}
        currentPhoto={selectedPhoto}
        userName={displayName}
      />
    </>
  );
}
