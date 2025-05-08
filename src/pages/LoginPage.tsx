import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Mail, AlertCircle, Info, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const { signIn, signInWithGoogle, signInWithApple, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showConfigHelp, setShowConfigHelp] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    location.state?.message || null
  );
  
  // Get return URL from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signIn(values.email, values.password);
      toast.success("Login successful!");
      // Use navigate instead of window.location for smoother experience
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(error.message || "Login failed. Please check your credentials.");
      
      // Check for email verification errors
      if (error.message?.includes("Email not confirmed")) {
        setAuthError("Please verify your email address before logging in. Check your inbox for a verification link.");
      } else {
        toast.error(error.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(provider: 'google' | 'apple') {
    setSocialLoading(provider);
    setAuthError(null);
    
    try {
      if (provider === 'google' && signInWithGoogle) {
        console.log("Starting Google sign-in...");
        await signInWithGoogle();
        // Toast will be shown on successful redirect back
      } else if (provider === 'apple' && signInWithApple) {
        await signInWithApple();
      } else {
        throw new Error(`${provider} sign-in is not configured`);
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      
      // Handle connection refused error
      if (error.message?.includes("Network Error") || 
          error.message?.includes("refused to connect") ||
          error.message?.includes("Failed to fetch")) {
        setAuthError(`Unable to connect to ${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication service. This is likely due to a configuration issue.`);
        setShowConfigHelp(true);
      }
      // Handle redirect_uri_mismatch error specifically
      else if (error.message?.includes("redirect_uri_mismatch") || 
          error.message?.includes("invalid request") ||
          error.message?.includes("400")) {
        setAuthError(`${provider} login configuration error. Please check your Supabase URL configuration settings.`);
        setShowConfigHelp(true);
      } 
      else if (error.message?.includes("provider is not enabled")) {
        setAuthError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not enabled. Please enable it in the Supabase console.`);
        setShowConfigHelp(true);
      } 
      else if (error.message?.includes("403")) {
        setAuthError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed. Please check that ${provider} login is enabled in the Supabase console.`);
        setShowConfigHelp(true);
      }
      else {
        setAuthError(error.message || `${provider} login failed.`);
      }
      
      toast.error(error.message || `${provider} login failed.`);
      setSocialLoading(null);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <div className="mb-4 flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-glee-purple"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Music className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Member Login</CardTitle>
            <CardDescription>
              Access the Glee World digital choir platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {verificationMessage && (
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {verificationMessage}
                </AlertDescription>
              </Alert>
            )}

            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {authError}
                </AlertDescription>
              </Alert>
            )}
            
            {showConfigHelp && (
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Configuration Help</AlertTitle>
                <AlertDescription className="mt-2 text-sm">
                  <p>To fix social login issues:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Verify Google OAuth credentials in the Google Cloud Console.</li>
                    <li>Ensure your app's URL is added to Authorized JavaScript origins.</li>
                    <li>Add the Supabase redirect URL to Authorized redirect URIs.</li>
                    <li>Configure Site URL and Redirect URLs in Supabase Auth settings.</li>
                  </ol>
                  <p className="mt-2">Meanwhile, you can use email/password login below.</p>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={() => handleSocialLogin('google')}
                disabled={!!socialLoading}
              >
                {socialLoading === 'google' ? (
                  <>
                    <span className="mr-2">Connecting...</span>
                    <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={() => handleSocialLogin('apple')}
                disabled={!!socialLoading}
              >
                {socialLoading === 'apple' ? (
                  <>
                    <span className="mr-2">Connecting...</span>
                    <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                    </svg>
                    <span>Continue with Apple</span>
                  </>
                )}
              </Button>
            </div>
            
            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Email Login Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
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
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2">Logging in...</span>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Login with Email
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
