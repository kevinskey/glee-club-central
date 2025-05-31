
# Hook Import Alias Map

Quick reference for updating imports to use the centralized `@/hooks` pattern.

## Before → After Migration

### User Management
```typescript
// OLD IMPORTS
import { useUserManagement } from '@/hooks/user/useUserManagement';
import { User } from '@/hooks/user/types';
import { useUsers } from '@/hooks/user/useUsers';

// NEW IMPORTS  
import { useUserManagement, User, useUsers } from '@/hooks';
```

### Authentication
```typescript
// OLD IMPORTS
import { useAuth } from '@/hooks/useAuthState';
import { usePermissions } from '@/hooks/usePermissions';

// NEW IMPORTS
import { useAuth, usePermissions } from '@/hooks';
```

### Media & Content
```typescript
// OLD IMPORTS
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { useMediaUpload } from '@/hooks/useMediaUpload';

// NEW IMPORTS
import { useMediaLibrary, useMediaUpload } from '@/hooks';
```

### Events & Calendar
```typescript
// OLD IMPORTS
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useConcertEvents } from '@/hooks/useConcertEvents';

// NEW IMPORTS
import { useCalendarEvents, useConcertEvents } from '@/hooks';
```

## Search & Replace Patterns

Use these patterns in your IDE for bulk updates:

### Pattern 1: Single Hook Import
```regex
// Find:    import { (\w+) } from '@/hooks/[\w/]+';
// Replace: import { $1 } from '@/hooks';
```

### Pattern 2: Multiple Hook Imports
```regex
// Find:    import { ([\w, ]+) } from '@/hooks/[\w/]+';
// Replace: import { $1 } from '@/hooks';
```

### Pattern 3: Type Imports
```regex
// Find:    import { type (\w+) } from '@/hooks/[\w/]+';
// Replace: import { type $1 } from '@/hooks';
```

## Validation Commands

```bash
# Check for remaining deep imports
grep -r "from '@/hooks/" src/ --exclude-dir=hooks

# Validate all hooks are exported
npm run type-check

# Test hook imports
node -e "require('./src/hooks/validate-imports.ts')"
```
