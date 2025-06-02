import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';

export default function ProfilePage() {
  const { user, profile, isLoading, isInitialized, isAuthenticated } = useAuth();

  // Show loading during auth initialization
  if (!isInitialized || isLoading) {
    return <PageLoader message="Loading profile..." className="min-h-screen" />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1>Your Profile</h1>
      {profile ? (
        <>
          <p>First Name: {profile.first_name}</p>
          <p>Last Name: {profile.last_name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {profile.role}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

