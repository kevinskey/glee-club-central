
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Music, AlertCircle } from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";

const adminRegisterSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Please confirm your password.",
  }),
  adminCode: z.string().min(1, {
    message: "Admin registration code is required.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;

// This admin code would ideally be stored in environment variables or a secure database
// For this example, we're using a hardcoded value
const ADMIN_CODE = "GleeAdmin2025";

export default function AdminRegistrationPage() {
  const { signUp, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const { sendEmail } = useMessaging();
  
  // Initialize the form with useForm hook
  const form = useForm<AdminRegisterFormValues>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      adminCode: "",
    },
  });

  // Check for existing authenticated user
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const sendWelcomeEmail = async (email: string, firstName: string) => {
    try {
      console.log("Sending admin welcome email to:", email);
      const emailResult = await sendEmail(
        email,
        "Welcome to Glee World Admin - Please Verify Your Email",
        `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6d28d9; text-align: center;">Welcome to Glee World Admin!</h2>
          <p>Hello ${firstName},</p>
          <p>Thank you for registering as an administrator with Glee World, the central hub for the Spelman College Glee Club.</p>
          <p>To complete your registration, please verify your email address by clicking the verification link sent to you in a separate email.</p>
          <p>If you don't see the verification email in your inbox, please check your spam or junk folder.</p>
          <p>Best regards,<br>The Glee World Team</p>
        </div>
        `
      );
      
      if (emailResult.success) {
        console.log("Admin welcome email sent successfully");
      } else {
        console.error("Failed to send admin welcome email:", emailResult.error);
      }
    } catch (error) {
      console.error("Error sending admin welcome email:", error);
    }
  };

  const onSubmit = async (values: AdminRegisterFormValues) => {
    setIsSubmitting(true);
    setRegisterError(null);
    
    try {
      // Validate admin code
      if (values.adminCode !== ADMIN_CODE) {
        setRegisterError("Invalid admin registration code");
        toast.error("Invalid admin registration code");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Admin registration attempt for:", values.email);
      
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Try to sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Sign-out before registration failed, continuing anyway");
      }

      // Register the user with admin metadata
      const { error, data } = await signUp(
        values.email,
        values.password,
        values.firstName,
        values.lastName
      );

      if (error) {
        console.error("Admin registration error:", error);
        
        if (error.message?.includes("already registered")) {
          setRegisterError("This email is already registered. Please use a different email or try logging in.");
          toast.error("Email already registered");
        } else {
          setRegisterError(error.message || "Failed to register account");
          toast.error("Registration failed", { description: error.message });
        }
      } else {
        // Set the user as admin in the database
        try {
          const { error: roleError } = await supabase
            .from('profiles')
            .update({ 
              role: 'admin',
              is_super_admin: true
            })
            .eq('id', data?.user?.id);

          if (roleError) {
            console.error("Failed to set admin role:", roleError);
          }
        } catch (roleErr) {
          console.error("Error setting admin role:", roleErr);
        }

        toast.success("Admin registration successful!", {
          description: "Please check your email for a verification link"
        });
        
        await sendWelcomeEmail(values.email, values.firstName);
        
        navigate("/login", { 
          state: { 
            message: "Please check your email for a verification link to complete your admin registration." 
          } 
        });
      }
    } catch (error: any) {
      console.error("Unexpected error during admin registration:", error);
      setRegisterError(error.message || "An unexpected error occurred");
      toast.error("Registration failed", { description: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated && !isLoading) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4" 
         style={{ backgroundImage: "url('/lovable-uploads/b57ced8e-7ed7-405b-8302-41ab726303af.png')" }}>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-white dark:bg-black backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Music className="h-12 w-12 text-glee-purple" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
          <CardDescription>
            Create an administrator account for Glee World
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registerError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {registerError}
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
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
                  name="lastName"
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
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="jane.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adminCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Registration Code</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter admin code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-glee-spelman hover:bg-glee-spelman/90" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Registering...</span>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  "Register as Admin"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-glee-purple hover:underline">
              Log in
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Need a regular member account?{" "}
            <Link to="/register" className="text-glee-purple hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
