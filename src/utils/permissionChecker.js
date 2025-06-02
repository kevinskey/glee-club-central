
import { rolePermissions } from './permissionsMap.js';

/**
 * Checks if a user has the necessary permission based on their role_tags
 * @param {Object} user - The user object containing role_tags
 * @param {string} action - The permission/action to check for
 * @returns {boolean} - True if the user has permission, false otherwise
 */
export const hasPermission = (user, action) => {
  // Return false if user is null/undefined
  if (!user) {
    return false;
  }

  // Return false if action is not provided
  if (!action) {
    return false;
  }

  // Basic view permissions for all members (even without role_tags)
  const basicMemberPermissions = [
    'view_sheet_music',
    'view_calendar', 
    'view_announcements'
  ];

  // If user has role 'member' or 'Member' and is requesting basic permissions
  if ((user.role === 'member' || user.role === 'Member') && basicMemberPermissions.includes(action)) {
    return true;
  }

  // If user has no role_tags, deny all edit-level permissions
  if (!user.role_tags || !Array.isArray(user.role_tags) || user.role_tags.length === 0) {
    return false;
  }

  // Check if any of the user's role_tags grant the requested permission
  return user.role_tags.some(role => {
    const permissions = rolePermissions[role] || [];
    return permissions.includes(action);
  });
};

/**
 * Gets all permissions for a user based on their role_tags
 * @param {Object} user - The user object containing role_tags
 * @returns {string[]} - Array of all permissions the user has
 */
export const getUserPermissions = (user) => {
  if (!user || !user.role_tags || !Array.isArray(user.role_tags)) {
    return [];
  }

  const allPermissions = new Set();
  
  user.role_tags.forEach(role => {
    const permissions = rolePermissions[role] || [];
    permissions.forEach(permission => allPermissions.add(permission));
  });

  return Array.from(allPermissions).sort();
};

/**
 * Checks if a user has any of the specified permissions
 * @param {Object} user - The user object containing role_tags
 * @param {string[]} actions - Array of permissions/actions to check for
 * @returns {boolean} - True if the user has at least one of the permissions
 */
export const hasAnyPermission = (user, actions) => {
  if (!Array.isArray(actions)) {
    return false;
  }

  return actions.some(action => hasPermission(user, action));
};

/**
 * Checks if a user has all of the specified permissions
 * @param {Object} user - The user object containing role_tags
 * @param {string[]} actions - Array of permissions/actions to check for
 * @returns {boolean} - True if the user has all of the permissions
 */
export const hasAllPermissions = (user, actions) => {
  if (!Array.isArray(actions)) {
    return false;
  }

  return actions.every(action => hasPermission(user, action));
};
