
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "@/components/landing/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Music, AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  password: z.string().min(1, {
    message: "Password is required."
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(
    location.state?.message || null
  );
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize the form with useForm hook
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const returnTo = new URLSearchParams(location.search).get('returnTo');
      navigate(returnTo || "/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate, location.search]);

  const handleResendVerification = async (email: string) => {
    try {
      setIsSubmitting(true);
      console.log("Resending verification email to:", email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (error) {
        toast.error("Failed to resend verification email");
        console.error("Error resending verification:", error);
      } else {
        toast.success("Verification email sent", {
          description: "Please check your inbox and spam folder"
        });
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error("Failed to resend verification email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: LoginFormValues) => {
    console.log("Login attempt with:", values.email);
    setIsSubmitting(true);
    setLoginError(null);

    try {
      // Clean up any existing auth state first to prevent conflicts
      cleanupAuthState();
      
      // Attempt sign in
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        console.error("Login error:", error);
        
        // Check for specific error messages related to email verification
        if (error.message?.includes("Email not confirmed") || 
            error.message?.toLowerCase().includes("email not verified") ||
            error.message?.toLowerCase().includes("not confirmed")) {
          
          setLoginError("Please verify your email address before logging in. Check your inbox and spam folder for a verification email.");
          toast.error("Email not verified", {
            description: "Check your inbox for a verification email",
            action: {
              label: "Resend",
              onClick: () => handleResendVerification(values.email),
            },
          });
        } else {
          setLoginError(error.message || "Invalid login credentials");
          toast.error(error.message || "Login failed");
        }
      } else {
        toast.success("Login successful!");
        // Navigate is now handled by the auth state change in AuthContext
      }
    } catch (error: any) {
      console.error("Unexpected error during login:", error);
      setLoginError(error.message || "An unexpected error occurred");
      toast.error("Login failed", {
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already authenticated and not loading, don't render the login form
  if (isAuthenticated && !isLoading) {
    return null; // Will redirect in the useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Member Login</h1>
          
          <Card className="w-full bg-white dark:bg-black dark:bg-opacity-80 bg-opacity-90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Music className="h-12 w-12 text-glee-purple" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Log in to access the Spelman College Glee Club portal
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {loginError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              
              {statusMessage && (
                <Alert className="mb-4">
                  <AlertDescription className="ml-2">
                    {statusMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
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
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Enter your password"
                              {...field} 
                            />
                            <button 
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                              tabIndex={-1} // Prevent tab focus for better accessibility
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Logging in...</span>
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" /> Log In
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex flex-col items-center space-y-2">
              <Link to="/reset-password" className="text-sm text-muted-foreground hover:underline">
                Forgot password?
              </Link>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-glee-purple hover:underline">
                  Create one
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
