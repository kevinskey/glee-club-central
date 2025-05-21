
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UserIcon, LockIcon, LogIn, UserPlus } from "lucide-react";
import { cleanupAuthState } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { signIn, signUp, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract return URL and intent from query params if available
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/dashboard";
  const intent = searchParams.get("intent");

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      try {
        // If the intent is recording, redirect to recording studio
        if (intent === "recording") {
          navigate("/dashboard/recording-studio");
          toast("Success! You're now signed in. Welcome to the Recording Studio!");
        } else {
          navigate(returnTo);
        }
      } catch (error) {
        console.error("Navigation error:", error);
        // Fallback to window.location if navigate fails
        window.location.href = intent === "recording" ? "/dashboard/recording-studio" : returnTo;
      }
    }
  }, [isAuthenticated, navigate, returnTo, intent]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Please enter both email and password.");
      return;
    }

    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      const { error } = await signIn(email, password);
      if (error) {
        toast(error.message);
      } else {
        toast("Signed in successfully!");
        // Let the useEffect handle navigation
      }
    } catch (error: any) {
      toast(error.message || "An unexpected error occurred.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast("Please fill in all fields.");
      return;
    }

    try {
      // Clean up existing auth state first
      cleanupAuthState();
      
      const { error } = await signUp(email, password, firstName, lastName);
      if (error) {
        toast(error.message);
      } else {
        toast("Signed up successfully! Please check your email to verify your account.");
        // Let the useEffect handle navigation after successful sign-up
      }
    } catch (error: any) {
      toast(error.message || "An unexpected error occurred.");
    }
  };

  const tabs = [
    {
      value: "signin",
      label: "Sign In",
      icon: <LogIn className="h-4 w-4 mr-2" />,
      content: (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              placeholder="m@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <Input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background"
            />
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            variant="spelman" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="mr-2 h-4 w-4 animate-spin">⌛</span>
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            Sign In
          </Button>
        </form>
      )
    },
    {
      value: "signup",
      label: "Sign Up",
      icon: <UserPlus className="h-4 w-4 mr-2" />,
      content: (
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signup-firstName">First Name</Label>
              <Input
                id="signup-firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-lastName">Last Name</Label>
              <Input
                id="signup-lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              placeholder="m@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            variant="spelman" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="mr-2 h-4 w-4 animate-spin">⌛</span>
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Sign Up
          </Button>
        </form>
      )
    }
  ];

  if (isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  // Show a special message if the intent is recording
  const loginMessage = intent === "recording" 
    ? "Sign in to use the Recording Studio"
    : "Enter your details to access the member dashboard";

  return (
    <div className="container relative min-h-[800px] flex items-center justify-center py-12 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        to="/"
        className="absolute right-4 top-4 md:right-8 md:top-8 text-foreground hover:text-primary transition-colors"
      >
        Back to Home
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-glee-spelman" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <UserIcon className="mr-2 h-6 w-6" /> Glee Club Portal
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This portal has transformed our Glee Club's organization.
              It's now easier than ever to manage members, music, and events.&rdquo;
            </p>
            <footer className="text-sm">Spelman Glee Club</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <div className="flex flex-col space-y-2 text-center">
            <UserIcon className="mx-auto h-6 w-6 text-glee-spelman" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to the Glee Club Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              {loginMessage}
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} className="flex items-center">
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value} className="mt-6">
                    {tab.content}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link
              to="/terms"
              className="hover:text-foreground underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="hover:text-foreground underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
