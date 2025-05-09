
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormValues, userFormSchema } from "./form/userFormSchema";

interface AddMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberAdd: (data: UserFormValues) => Promise<void>;
  isSubmitting?: boolean;
  initialValues?: UserFormValues;
  isEditing?: boolean;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  isOpen,
  onOpenChange,
  onMemberAdd,
  isSubmitting = false,
  initialValues,
  isEditing = false
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialValues || {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "singer",
      voice_part: "soprano_1",
      status: "pending",
      password: ""
    }
  });

  // Reset form when dialog opens or initialValues change
  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        form.reset(initialValues);
      } else {
        form.reset({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          role: "singer",
          voice_part: "soprano_1",
          status: "pending",
          password: ""
        });
      }
    }
  }, [isOpen, initialValues, form]);

  const onSubmit = async (data: UserFormValues) => {
    console.log(`${isEditing ? "Edit" : "Add"}MemberDialog - Submit with data:`, data);
    try {
      await onMemberAdd(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add New"} Member</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update member information in the Glee Club."
              : "Add a new member to the Glee Club with their primary information."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
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
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Email Address" 
                        {...field} 
                        disabled={isEditing} // Email can't be changed if editing
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Role and Voice Part */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="singer">Singer</SelectItem>
                        <SelectItem value="section_leader">Section Leader</SelectItem>
                        <SelectItem value="student_conductor">Student Conductor</SelectItem>
                        <SelectItem value="accompanist">Accompanist</SelectItem>
                        <SelectItem value="non_singer">Non-Singer</SelectItem>
                        <SelectItem value="administrator">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Password and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEditing ? "New Password" : "Initial Password"}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={isEditing ? "Leave blank to keep current" : "Set initial password"} 
                        {...field} 
                      />
                    </FormControl>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="sm:justify-between flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => !isSubmitting && onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Member" : "Add Member")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
