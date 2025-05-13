
// This file is now a re-export of the refactored implementation
// for backward compatibility
import { useUserManagement as useRefactoredUserManagement } from './user/useUserManagement';
export type { User } from './user/types';

export const useUserManagement = useRefactoredUserManagement;
