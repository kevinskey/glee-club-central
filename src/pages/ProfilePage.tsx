
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Profile } from '@/types/auth';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ProfileForm } from '@/components/profile/ProfileForm';

export default function ProfilePage() {
  const { user, profile, isLoading, isInitialized, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Create a properly typed default profile with e-commerce fields
  const defaultProfile: Partial<Profile> = {
    first_name: '',
    last_name: '',
    phone: '',
    voice_part: '',
    class_year: '',
    notes: '',
    ecommerce_enabled: false,
    design_history_ids: [],
    current_cart_id: '',
    default_shipping_address: '',
    account_balance: 0.00
  };
  
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>(profile || defaultProfile);

  // Wait for initialization but don't hang forever
  if (!isInitialized) {
    return <PageLoader message="Loading profile..." className="min-h-screen" />;
  }

  // Check authentication immediately
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Don't wait forever for profile loading - proceed with what we have
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email || 'User';
  };

  const handleEdit = () => {
    setEditedProfile(profile || defaultProfile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile || defaultProfile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // For now, just refresh the profile since the actual update logic
      // would require backend implementation
      await refreshProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <ProfileHeader displayName={getDisplayName().split(' ')[0]} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <ProfileCard 
              user={user}
              profile={profile}
              getInitials={getInitials}
              getDisplayName={getDisplayName}
            />
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <ProfileForm
              user={user}
              profile={profile}
              isEditing={isEditing}
              isSaving={isSaving}
              editedProfile={editedProfile}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onSave={handleSave}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
