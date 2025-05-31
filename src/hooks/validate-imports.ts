
/**
 * Build-time import validation utility
 * This file imports the main hooks index to catch any broken exports at build time
 * Run this during CI/CD or development to ensure all hook imports are valid
 */

// Import everything from the main index to validate exports
import * as hooks from './index';

// Type check that ensures main hooks are exported
const validateCoreHooks = () => {
  // Core hooks that should always be available
  const requiredHooks = [
    'useUserManagement',
    'useAuth', 
    'usePermissions',
    'useMediaLibrary',
    'useCalendarEvents'
  ] as const;

  const missingHooks: string[] = [];
  
  requiredHooks.forEach(hookName => {
    if (!(hookName in hooks)) {
      missingHooks.push(hookName);
    }
  });

  if (missingHooks.length > 0) {
    throw new Error(`Missing required hooks: ${missingHooks.join(', ')}`);
  }

  console.log('✅ All core hooks are properly exported');
  return true;
};

// Export validation function for use in tests or build scripts
export { validateCoreHooks };

// Run validation immediately when this file is imported
if (process.env.NODE_ENV === 'development') {
  validateCoreHooks();
}
