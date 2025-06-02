
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  voice_part: string;
  class_year: string;
  bio?: string;
}

export default function UserSetupPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { profile, isLoading: profileLoading, updateUserProfile } = useProfile(); // Changed from updateProfile
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone: '',
    voice_part: '',
    class_year: '',
    bio: ''
  });

  useEffect(() => {
    if (!isLoading && !profileLoading && profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        voice_part: profile.voice_part || '',
        class_year: profile.class_year || '',
        bio: profile.notes || ''
      });
    }
  }, [profile, isLoading, profileLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        voice_part: formData.voice_part,
        class_year: formData.class_year,
        notes: formData.bio
      });

      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="voice_part">Voice Part</Label>
              <Select 
                value={formData.voice_part} 
                onValueChange={(value) => setFormData({...formData, voice_part: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your voice part" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soprano_1">Soprano 1</SelectItem>
                  <SelectItem value="soprano_2">Soprano 2</SelectItem>
                  <SelectItem value="alto_1">Alto 1</SelectItem>
                  <SelectItem value="alto_2">Alto 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="class_year">Class Year</Label>
              <Input
                id="class_year"
                value={formData.class_year}
                onChange={(e) => setFormData({...formData, class_year: e.target.value})}
                placeholder="e.g., 2025"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
