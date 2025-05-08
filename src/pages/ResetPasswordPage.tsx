
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound, LockKeyhole, ArrowLeft } from "lucide-react";

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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [validResetLink, setValidResetLink] = useState<boolean | null>(null);
  
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check if the URL contains the necessary reset token parameters
    const hash = window.location.hash;
    const query = window.location.search;
    
    if ((!hash && !query) || (!hash.includes('access_token') && !query.includes('code'))) {
      setValidResetLink(false);
    } else {
      setValidResetLink(true);
    }
  }, []);

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      
      if (error) throw error;
      
      toast.success("Password has been reset successfully");
      
      // Redirect to login page after successful password reset
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  }

  // Loading state
  if (validResetLink === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Invalid link state
  if (validResetLink === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md border-orange-200 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-red-100 p-3">
                <LockKeyhole className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Invalid Link</CardTitle>
            <CardDescription className="text-base">
              The password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-4">
            <p className="mb-6 text-gray-600">
              Please try to reset your password again using the forgot password page.
            </p>
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
              <Link to="/forgot-password">Try Again</Link>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Link to="/login" className="text-sm text-orange-600 hover:underline flex items-center">
              <ArrowLeft className="mr-1 h-3 w-3" /> Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Valid link - show password reset form
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md border-orange-200 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <div className="rounded-full bg-orange-100 p-3">
              <KeyRound className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Create New Password</CardTitle>
          <CardDescription className="text-base">
            Please enter a strong password to secure your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Create a strong password" 
                        className="bg-gray-50" 
                        {...field} 
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground mt-2">
                      Password must contain at least 8 characters, including uppercase, lowercase, and a number
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Confirm New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm your password" 
                        className="bg-gray-50" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600 mt-4 h-11" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Resetting Password...</span>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-orange-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
