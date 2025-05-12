
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component now serves as a redirect to the consolidated member management page
const MembersPage = () => {
  return <Navigate to="/dashboard/admin/members" replace />;
};

export default MembersPage;
