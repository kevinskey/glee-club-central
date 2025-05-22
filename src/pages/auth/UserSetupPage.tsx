
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserSetupFormData {
  firstName: string;
  lastName: string;
  voicePart?: string; // Optional for member setup
}

export default function UserSetupPage() {
  const { isLoading, profile, supabaseClient } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserSetupFormData>({
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      voicePart: profile?.voice_part || '',
    }
  });

  const onSubmit = async (data: UserSetupFormData) => {
    if (!profile?.id) {
      toast.error("User profile not found");
      return;
    }
    
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          voice_part: data.voicePart || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Profile updated successfully");
      navigate('/role-dashboard');
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
            <CardDescription className="text-center">Set up your account details</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName"
                  {...register("firstName", { required: "First name is required" })}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName"
                  {...register("lastName", { required: "Last name is required" })}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voicePart">Voice Part (Optional)</Label>
                <Select onValueChange={(value) => register("voicePart").onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your voice part" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S1">Soprano 1</SelectItem>
                    <SelectItem value="S2">Soprano 2</SelectItem>
                    <SelectItem value="A1">Alto 1</SelectItem>
                    <SelectItem value="A2">Alto 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Saving...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
