
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract access token from URL or hash fragment
  useEffect(() => {
    // First check for token in hash (for old URLs)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashToken = hashParams.get("access_token");
    
    // Then check for token in search params (for new URLs)
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get("token");
    
    // Use whichever token is available
    setHash(hashToken || queryToken);
  }, [location]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      if (hash) {
        // If we have a hash/token, we need to verify it first
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: hash,
          type: 'recovery'
        });
        
        if (error) throw error;
      }
      
      if (updatePassword) {
        const { error } = await updatePassword(password);
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Your password has been updated successfully.",
        });
        navigate("/login");
      } else {
        throw new Error("Password update functionality not available");
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while resetting your password.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-glee-spelman">
            Reset Your Password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">New Password</CardTitle>
            <CardDescription className="text-center">
              Create a strong, secure password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                variant="spelman" 
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
