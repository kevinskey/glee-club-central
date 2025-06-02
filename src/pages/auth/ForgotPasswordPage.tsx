import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Music } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await resetPassword(email);
      
      if (error) {
        console.error("Reset password error:", error);
        toast.error(error.message || "An error occurred while processing your request.");
      } else {
        setIsSubmitted(true);
        toast.success("If your email is registered, you'll receive password reset instructions shortly.");
      }
    } catch (error: any) {
      console.error("Error requesting password reset:", error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center animate-fade-in"
      style={{
        backgroundImage: `url('/lovable-uploads/5d6ba7fa-4ea7-42ac-872e-940fb620a273.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 z-0" />
      
      {/* Forgot password form container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-white/20 dark:border-white/10">
          <Card className="w-full border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-1 text-center px-0">
              <div className="flex justify-center mb-4">
                <Music className="h-12 w-12 text-glee-purple" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Forgot Your Password?
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-0">
              {isSubmitted ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    If an account exists for <strong>{email}</strong>, you'll receive an email with
                    instructions on how to reset your password.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">Please check your email and follow the instructions.</p>
                  <Button variant="outline" asChild className="mt-4">
                    <Link to="/login">Return to Login</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-glee-spelman hover:bg-glee-spelman/90 text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Link 
                      to="/login" 
                      className="text-sm text-glee-purple hover:underline"
                    >
                      Return to Login
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
