
import React, { useState } from "react";
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
import { Music, Mail } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  
  // Get return URL from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(provider: 'google' | 'apple') {
    setSocialLoading(provider);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'apple') {
        await signInWithApple();
      }
      // No need to navigate here as it will be handled by the auth state change
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.error(error.message || `${provider} login failed.`);
    } finally {
      setSocialLoading(null);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Music className="h-12 w-12 text-glee-purple" />
          </div>
          <CardTitle className="text-2xl font-bold">Member Login</CardTitle>
          <CardDescription>
            Access the Glee World digital choir platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.32 9.76c.58-.99 1.01-2.35.85-3.72-1.05.08-2.28.7-3.02 1.5-.66.77-1.29 2.01-1.05 3.34 1.13.09 2.25-.56 3.22-1.12zM20.27 16.68C20.72 15.58 21 14.38 21 13.11c0-1.09-.19-2.1-.52-3.03-1.17-.3-2.31.16-2.92.68-.65.55-1.12 1.29-1.44 1.98-.28.61-.46 1.23-.5 1.78-.04.51.02.99.15 1.42.17.54.49 1.02.93 1.38.5.41 1.13.62 1.88.62.4 0 .78-.08 1.12-.24.24-.11.46-.23.65-.38.19-.14.39-.32.58-.54.19-.21.38-.46.55-.72.1-.16.21-.33.3-.5z" />
                    <path d="M12.3 21.5c1.14 0 2.37-.53 3.1-1.71-1.47-.45-2.46-1.76-2.46-3.18 0-1.62 1.24-2.78 3.57-4.5 0 0-2.23-3.2-5.34-3.2-1.32 0-2.66.45-3.6 1.23-1.16.96-2.05 2.38-2.46 4.06.17 1.23.55 2.55 1.15 3.72.6 1.16 1.37 2.13 2.17 2.78.81.65 1.56 1 2.41 1h1.46z"/>
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
                  className="text-sm text-glee-purple hover:underline"
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
            <Link to="/register" className="text-glee-purple hover:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
