
# Hooks Directory Structure

This directory contains all custom React hooks for the GleeWorld application. **Always import from `@/hooks` instead of deep paths** to prevent import path drift.

## ✅ Correct Import Pattern
```typescript
import { useUserManagement, useAuth, useCalendarEvents } from '@/hooks';
```

## ❌ Avoid Deep Imports
```typescript
// Don't do this - creates path drift and maintenance issues
import { useUserManagement } from '@/hooks/user/useUserManagement';
import { useAuth } from '@/hooks/useAuthState';
```

## Directory Structure

### `/user/` - User Management
- `useUserManagement.ts` - Main user CRUD operations
- `useUsers.ts` - User fetching and listing
- `useUserCreate.ts` - User creation logic
- `useUserUpdate.ts` - User update operations
- `useUserDelete.ts` - User deletion logic
- `types.ts` - User-related TypeScript types

### `/auth/` (conceptual - files in root)
- `useAuthState.ts` - Authentication state management
- `usePermissions.ts` - Role-based permissions
- `useUserRole.ts` - User role utilities
- `useRoleLevels.ts` - Role hierarchy management

### `/events/` (conceptual - files in root)
- `useCalendarEvents.ts` - Calendar event management
- `useConcertEvents.ts` - Concert-specific events

### `/media/` (conceptual - files in root)
- `useMediaLibrary.ts` - Media file management
- `useMediaUpload.ts` - File upload handling
- `useAudioFiles.ts` - Audio file operations
- `useAudioRecorder.ts` - Audio recording functionality
- `useSiteImages.ts` - Site image management
- `useSiteImageManager.ts` - Advanced image management

### `/practice/` (conceptual - files in root)
- `usePracticeLogs.ts` - Practice session tracking
- `useBackingTracks.ts` - Backing track management
- `useMixedRecordings.ts` - Mixed recording operations
- `useRecordingSave.ts` - Recording save operations

### `/ui/` (utility hooks)
- `use-toast.ts` - Toast notification management
- `use-mobile.ts` - Mobile responsive utilities
- `use-sidebar.ts` - Sidebar state management
- `use-intersection.ts` - Intersection observer utilities

## Adding New Hooks

When adding new hooks:

1. **Create the hook file** in the appropriate conceptual directory
2. **Export it in `index.ts`** following the existing pattern
3. **Update this README** with the new hook description
4. **Use TypeScript** for all hooks with proper return types
5. **Include JSDoc comments** for complex hooks

### Example New Hook Addition

```typescript
// In src/hooks/useNewFeature.ts
export const useNewFeature = () => {
  // Hook implementation
  return { data, loading, error };
};

// Add to src/hooks/index.ts
export { useNewFeature } from './useNewFeature';

// Import in components
import { useNewFeature } from '@/hooks';
```

## Import Validation

The main `index.ts` file serves as a build-time validator for broken imports. If any hook file is missing or has export issues, the build will fail at this central location, making issues easy to identify and fix.

## Migration Guide

If you find existing imports using deep paths, update them:

```typescript
// Before
import { useUserManagement } from '@/hooks/user/useUserManagement';
import { useAuth } from '@/hooks/useAuthState';

// After
import { useUserManagement, useAuth } from '@/hooks';
```

## Best Practices

- **Single Responsibility**: Each hook should have one clear purpose
- **Consistent Naming**: Use descriptive names starting with 'use'
- **Type Safety**: Always include proper TypeScript types
- **Error Handling**: Include appropriate error states
- **Testing**: Hooks should be testable in isolation
- **Documentation**: Include JSDoc for complex hooks

## Maintenance Notes

- **DO NOT** delete this index file during refactors
- **ALWAYS** update exports when adding/removing hooks
- **VERIFY** imports after major refactoring
- **CONSOLIDATE** similar hooks to reduce duplication
