import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchUserPermissions } from "@/utils/supabase/permissions";
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  userId: z.string().min(1, {
    message: "User ID is required.",
  }),
});

export default function DeveloperTools() {
  const { session } = useAuth();
  const [userId, setUserId] = useState('');
  const [userPermissions, setUserPermissions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
      form.setValue("userId", session.user.id);
    }
  }, [session?.user?.id, form]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    form.setValue("userId", e.target.value);
  };

  const getUserPermissions = async (userId: string) => {
    setIsLoading(true);
    try {
      const permissions = await fetchUserPermissions(userId);
      setUserPermissions(permissions);
      toast.success("User permissions fetched successfully!");
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      toast.error("Failed to fetch user permissions.");
      setUserPermissions(null);
    } finally {
      setIsLoading(false);
    }
  };

  const syncUserWithRoles = async (userId: string) => {
    setIsLoading(true);
    try {
      // Call the Supabase function
      const { data, error } = await supabase.functions.invoke('sync-user-roles', {
        body: { user_id: userId },
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Function response:", data);
      toast.success("User roles synced successfully!");
    } catch (error) {
      console.error("Error syncing user roles:", error);
      toast.error("Failed to sync user roles.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Developer Tools</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => getUserPermissions(userId))} className="space-y-4">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter User ID"
                    {...field}
                    value={userId}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Get User Permissions"}
          </Button>
        </form>
      </Form>

      <div className="mt-4">
        {userPermissions ? (
          <div>
            <h2 className="text-lg font-semibold">User Permissions:</h2>
            <pre>{JSON.stringify(userPermissions, null, 2)}</pre>
          </div>
        ) : (
          <p>No user permissions fetched.</p>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Sync User Roles</h2>
        <p className="text-sm text-muted-foreground">
          This will sync the user's roles with the database.
        </p>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={(e) => {
            e.preventDefault();
            syncUserWithRoles(userId);
          }}
        >
          Sync User Roles
        </Button>
      </div>
    </div>
  );
}
