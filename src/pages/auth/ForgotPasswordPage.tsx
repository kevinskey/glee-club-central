
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast("Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);
      
      if (auth.resetPassword) {
        const result = await auth.resetPassword(email);
        
        // Check if result exists and has an error property
        if (result && 'error' in result && result.error) {
          throw result.error;
        }
        
        setIsSubmitted(true);
        toast("If your email is registered, you'll receive password reset instructions shortly.");
      } else {
        throw new Error("Password reset functionality not available");
      }
    } catch (error: any) {
      console.error("Error requesting password reset:", error);
      toast(error.message || "An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-glee-spelman">
            Forgot Your Password?
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Password Reset</CardTitle>
            <CardDescription className="text-center">
              Get a link to create a new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <p>
                  If an account exists for <strong>{email}</strong>, you'll receive an email with
                  instructions on how to reset your password.
                </p>
                <p>Please check your email and follow the instructions.</p>
                <Button variant="outline" asChild className="mt-4">
                  <Link to="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="spelman" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                
                <div className="text-center mt-4">
                  <Link 
                    to="/login" 
                    className="text-sm text-primary hover:underline"
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
  );
}
