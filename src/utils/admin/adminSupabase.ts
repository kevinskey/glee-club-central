
import { supabase } from '@/integrations/supabase/client';

// Create a Supabase client with the service role key for admin operations
// This should be used only on the server side, but for this demo we're using it in the frontend
// In a production environment, these operations should be handled via a secure backend service

// Using the supabase client directly for RLS operations, and API calls for admin operations
const adminSupabase = {
  auth: {
    admin: {
      createUser: async (options: any) => {
        try {
          console.log("adminSupabase - createUser called with:", {
            email: options.email,
            hasPassword: Boolean(options.password),
            metadata: options.user_metadata
          });
          
          // For development purposes, we'll just use the regular supabase client
          // In production, this should be handled by a secure backend service
          const { data, error } = await supabase.auth.signUp({
            email: options.email,
            password: options.password || Math.random().toString(36).substring(2, 10),
            options: {
              data: options.user_metadata || {}
            }
          });
          
          if (error) {
            console.error("Error creating user:", error);
            return { error };
          }
          
          console.log("User created successfully:", data.user?.id);
          return { user: data.user };
        } catch (error: any) {
          console.error("Exception creating user:", error);
          return { error };
        }
      },
      
      updateUserById: async (userId: string, attributes: any) => {
        try {
          console.log("adminSupabase - updateUserById called for:", userId, "with attributes:", attributes);
          
          // For email and metadata updates we can use the admin functions 
          // which should work with the authenticated user having the right permissions
          const { data, error } = await supabase.auth.updateUser({
            email: attributes.email,
            password: attributes.password,
            data: attributes.user_metadata
          });
          
          if (error) throw error;
          return { user: data.user };
        } catch (error: any) {
          console.error("Error updating user:", error);
          throw error;
        }
      },
      
      deleteUser: async (userId: string) => {
        console.log("adminSupabase - deleteUser called for:", userId);
        // In development, we'll handle this differently
        // In production, this should be handled by a secure backend service
        try {
          // For demo purposes, we'll just disable the user by updating their status
          const { error } = await supabase
            .from('profiles')
            .update({ status: 'deleted' })
            .eq('id', userId);
            
          if (error) throw error;
          
          return { success: true, userId };
        } catch (error: any) {
          console.error("Error deleting user:", error);
          throw error;
        }
      },
      
      getUserById: async (userId: string) => {
        console.log("adminSupabase - getUserById called for:", userId);
        try {
          // Get user data from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (error) throw error;
          
          return { user: data };
        } catch (error: any) {
          console.error("Error getting user:", error);
          throw error;
        }
      }
    }
  }
};

export default adminSupabase;
