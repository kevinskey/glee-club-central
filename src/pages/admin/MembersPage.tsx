
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * This component serves as a redirect to the consolidated admin member management page
 * We're keeping this file for backward compatibility with existing routes
 */
const AdminMembersRedirectPage = () => {
  console.log("Redirecting from legacy admin members page to consolidated dashboard");
  return <Navigate to="/dashboard/admin/members" replace />;
};

export default AdminMembersRedirectPage;
