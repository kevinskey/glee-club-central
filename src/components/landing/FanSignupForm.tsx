
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Heart } from "lucide-react";

interface FanSignupFormProps {
  className?: string;
}

export function FanSignupForm({ className = "" }: FanSignupFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    favoriteMemory: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('fans')
        .insert({
          full_name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          favorite_memory: formData.favoriteMemory.trim() || null
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error("This email is already registered as a fan!");
        } else {
          throw error;
        }
        return;
      }

      // Success
      setShowSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        favoriteMemory: ""
      });
      
      toast.success("Welcome to the GleeWorld fan family! 🎶");
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error: any) {
      console.error('Error submitting fan signup:', error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <section className={`py-12 md:py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-8">
              <div className="flex justify-center mb-4">
                <Heart className="h-12 w-12 text-glee-spelman fill-current" />
              </div>
              <h3 className="text-2xl font-playfair font-bold mb-4 text-glee-spelman">
                Thank You for Joining GleeWorld! 🎶
              </h3>
              <p className="text-muted-foreground mb-4">
                You're now part of the Spelman Glee Club fan family! Stay tuned for updates about our upcoming performances, recordings, and special events.
              </p>
              <p className="text-sm text-muted-foreground">
                We'll never spam you, and you can unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 md:py-16 bg-muted/50 ${className}`}>
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-playfair font-bold text-glee-spelman">
              🎶 Become a GleeWorld Fan!
            </CardTitle>
            <CardDescription className="text-lg">
              Join our community and stay connected with the Spelman College Glee Club. 
              Get updates on performances, new recordings, and special events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="favoriteMemory">
                  Favorite Song or Memory (Optional)
                </Label>
                <Textarea
                  id="favoriteMemory"
                  name="favoriteMemory"
                  value={formData.favoriteMemory}
                  onChange={handleInputChange}
                  placeholder="Share a favorite Glee Club song or memory..."
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-glee-spelman hover:bg-glee-spelman/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining GleeWorld...
                  </>
                ) : (
                  "Join the GleeWorld Fan Family"
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                By signing up, you agree to receive updates from the Spelman College Glee Club. 
                We respect your privacy and will never share your information.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
