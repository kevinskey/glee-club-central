export const rolePermissions = {
  "President": ["edit_events", "send_announcement", "manage_members", "edit_budget"],
  "Secretary": ["edit_attendance", "send_announcement"],
  "Treasurer": ["edit_budget", "view_budget", "manage_shop"],
  "Historian": ["upload_media", "archive_event"],
  "PR Coordinator": ["upload_media", "post_social", "edit_website"],
  "Tour Manager": ["edit_events", "upload_docs"],
  "Road Manager": ["edit_events", "upload_docs"],
  "Chaplain": ["send_affirmation"],
  "Librarian": ["upload_docs"],
  "Wardrobe Manager": ["edit_wardrobe"],
  "Merchandise Manager": ["manage_shop"]
};

// Helper function to get permissions for a specific role
export const getPermissionsForRole = (role) => {
  return rolePermissions[role] || [];
};

// Helper function to check if a role has a specific permission
export const hasPermission = (role, permission) => {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
};

// Helper function to get all available permissions
export const getAllPermissions = () => {
  const allPermissions = new Set();
  Object.values(rolePermissions).forEach(permissions => {
    permissions.forEach(permission => allPermissions.add(permission));
  });
  return Array.from(allPermissions).sort();
};

// Helper function to get all roles
export const getAllRoles = () => {
  return Object.keys(rolePermissions);
};
