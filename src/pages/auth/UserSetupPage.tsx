import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Music } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export default function UserSetupPage() {
  const { user, isLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('member'); // Default role
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setBio(profile.bio || '');
      setRole(profile.role || 'member');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSubmit = async () => {
    // Basic validation
    if (!firstName || !lastName) {
      alert('Please enter your first and last name.');
      return;
    }

    // Prepare the update object
    const updates = {
      id: user?.id,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      address: address,
      bio: bio,
      role: role,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    // Call the Supabase function to update the profile
    try {
      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
      alert('Profile updated successfully!');
      navigate('/dashboard'); // Redirect to dashboard after setup
    } catch (error: any) {
      console.error('Profile update error:', error.message);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  if (!user) {
    return <Alert variant="destructive">
      <AlertDescription>
        You must be logged in to view this page.
      </AlertDescription>
    </Alert>;
  }

  if (isLoading || profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-4 bg-white dark:bg-gray-800 shadow-md rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            <User className="mr-2 h-5 w-5 inline-block align-middle" />
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="mb-4">
            <AlertDescription>
              Welcome! Please provide some additional information to complete your profile.
            </AlertDescription>
          </Alert>

          <div className="grid gap-2">
            <Label htmlFor="firstName">
              <User className="mr-2 h-4 w-4 inline-block align-middle" />
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lastName">
              <User className="mr-2 h-4 w-4 inline-block align-middle" />
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">
              <Mail className="mr-2 h-4 w-4 inline-block align-middle" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              value={user?.email || ''}
              disabled
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">
              <Phone className="mr-2 h-4 w-4 inline-block align-middle" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">
              <MapPin className="mr-2 h-4 w-4 inline-block align-middle" />
              Address
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">
              <Music className="mr-2 h-4 w-4 inline-block align-middle" />
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">
              <Calendar className="mr-2 h-4 w-4 inline-block align-middle" />
              Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="fan">Fan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()
