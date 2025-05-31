
// Main hooks export index
// This file centralizes all hook exports to prevent import path drift
// Always import from @/hooks instead of deep paths like @/hooks/user/useUserManagement

// User Management Hooks
export * from './user/useUserManagement';
export * from './user/useUsers';
export * from './user/useUserCreate';
export * from './user/useUserUpdate';
export * from './user/useUserDelete';
export { type User } from './user/types';

// Authentication Hooks
export { useAuthState } from './auth/useAuthState';
export { usePermissions } from './usePermissions';
export { useUserRole } from './useUserRole';

// Events & Calendar Hooks
export { useCalendarEvents } from './useCalendarEvents';
export { useConcertEvents } from './useConcertEvents';

// Media & Content Hooks
export { useMediaLibrary } from './useMediaLibrary';
export { useMediaUpload } from './useMediaUpload';
export { useAudioFiles } from './useAudioFiles';
export { useAudioRecorder } from './useAudioRecorder';
export { useSiteImages } from './useSiteImages';
export { useSiteImageManager } from './useSiteImageManager';

// Practice & Performance Hooks
export { usePracticeLogs } from './usePracticeLogs';
export { useBackingTracks } from './useBackingTracks';
export { useMixedRecordings } from './useMixedRecordings';
export { useRecordingSave } from './useRecordingSave';

// Utility Hooks
export { useNotifications } from './useNotifications';
export { useMessaging } from './useMessaging';
export { useFanForm } from './useFanForm';
export { useDashboardData } from './useDashboardData';
export { useLoadingCoordinator } from './useLoadingCoordinator';
export { useImagePreloader } from './useImagePreloader';

// Site Management Hooks
export { useSiteSettings } from './useSiteSettings';
export { useAIDescriptions } from './useAIDescriptions';

// PDF & Annotations
export { usePDFAnnotations } from './usePDFAnnotations';

// UI Utility Hooks (re-exported from ui folder)
export { useToast } from './use-toast';
export { useMedia, useIsMobile } from './use-mobile';
export { useSidebar } from './use-sidebar';
export { useIntersection } from './use-intersection';

// Re-export PageLoader component for convenience
export { PageLoader } from '../components/ui/page-loader';
