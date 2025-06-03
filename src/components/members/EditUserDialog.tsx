import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { UnifiedUser } from "@/hooks/user/useUnifiedUserManagement";
import { formatPhoneNumber } from "@/utils/formatters";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormValues, userFormSchema } from "@/components/members/form/userFormSchema";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ShoppingCart, CreditCard, Users, Crown, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: UserFormValues) => Promise<void>;
  isSubmitting: boolean;
  user: UnifiedUser | null;
}

export function EditUserDialog({
  isOpen,
  onOpenChange,
  onSave,
  isSubmitting,
  user
}: EditUserDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      voice_part: (user?.voice_part as "soprano_1" | "soprano_2" | "alto_1" | "alto_2" | "tenor" | "bass" | "director" | null) || null,
      status: (user?.status as "active" | "pending" | "inactive" | "alumni") || 'active',
      role: (user?.role as "admin" | "member" | "section_leader") || 'member',
      class_year: user?.class_year || '',
      notes: user?.notes || '',
      dues_paid: user?.dues_paid || false,
      is_admin: user?.is_super_admin || false,
      title: (user as any)?.title || '',
      join_date: (user as any)?.join_date || '',
      ecommerce_enabled: (user as any)?.ecommerce_enabled || false,
      account_balance: (user as any)?.account_balance || 0,
      default_shipping_address: (user as any)?.default_shipping_address || ''
    }
  });

  React.useEffect(() => {
    if (user && isOpen) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        voice_part: (user.voice_part as "soprano_1" | "soprano_2" | "alto_1" | "alto_2" | "tenor" | "bass" | "director" | null) || null,
        status: (user.status as "active" | "pending" | "inactive" | "alumni") || 'active',
        role: (user.role as "admin" | "member" | "section_leader") || 'member',
        class_year: user.class_year || '',
        notes: user.notes || '',
        dues_paid: user.dues_paid || false,
        is_admin: user.is_super_admin || false,
        title: (user as any)?.title || '',
        join_date: (user as any)?.join_date || '',
        ecommerce_enabled: (user as any)?.ecommerce_enabled || false,
        account_balance: (user as any)?.account_balance || 0,
        default_shipping_address: (user as any)?.default_shipping_address || ''
      });
    }
  }, [user, isOpen, form]);

  const onSubmit = async (data: UserFormValues) => {
    await onSave(data);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Edit Member Details
          </DialogTitle>
          <DialogDescription>
            Update member information for {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                      <Input 
                        type="tel" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(formatPhoneNumber(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Choir Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Choir Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="voice_part"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Part</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
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
                  name="class_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2025" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dues_paid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                      <p className="text-sm text-muted-foreground">
                        Member has paid their dues for this period
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Leadership & Executive Board Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Leadership & Executive Board
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
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
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="section_leader">Section Leader</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Executive Title</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select executive title" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">No Title</SelectItem>
                          <SelectItem value="President">President</SelectItem>
                          <SelectItem value="Vice President">Vice President</SelectItem>
                          <SelectItem value="Secretary">Secretary</SelectItem>
                          <SelectItem value="Treasurer">Treasurer</SelectItem>
                          <SelectItem value="Historian">Historian</SelectItem>
                          <SelectItem value="Librarian">Librarian</SelectItem>
                          <SelectItem value="Wardrobe Manager">Wardrobe Manager</SelectItem>
                          <SelectItem value="Social Chair">Social Chair</SelectItem>
                          <SelectItem value="Publicity Chair">Publicity Chair</SelectItem>
                          <SelectItem value="Chaplain">Chaplain</SelectItem>
                          <SelectItem value="Business Manager">Business Manager</SelectItem>
                          <SelectItem value="Assistant Director">Assistant Director</SelectItem>
                          <SelectItem value="Director">Director</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_admin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Administrator Privileges
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Grants full administrative access to the system
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* E-commerce Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                E-commerce Settings
              </h3>
              
              <FormField
                control={form.control}
                name="ecommerce_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Enable E-commerce Access
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Allows access to design studio and store features
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Account Balance ($)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        placeholder="0.00"
                        {...field}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="default_shipping_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Shipping Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ''} 
                        rows={3}
                        placeholder="Enter default shipping address..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ''} 
                        rows={3}
                        placeholder="Any additional notes about this member..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserDialog;
