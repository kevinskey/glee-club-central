
// Type declarations for hooks module
// This file helps TypeScript validate hook imports and provides IntelliSense

declare module '@/hooks' {
  // User Management Types
  export interface User {
    id: string;
    email?: string | null;
    first_name: string;
    last_name: string;
    phone?: string | null;
    voice_part: string | null;
    avatar_url?: string | null;
    status: string;
    join_date?: string;
    class_year?: string;
    dues_paid?: boolean;
    notes?: string;
    created_at: string;
    updated_at?: string | null;
    last_sign_in_at?: string | null;
    is_super_admin?: boolean;
    role?: string;
  }

  // Hook Return Types
  export interface UseUserManagementReturn {
    users: User[];
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<User[] | null>;
    refreshUsers: () => Promise<User[]>;
    deleteUser: (userId: string) => Promise<boolean>;
    getUserCount: () => Promise<void>;
    userCount: number;
    getUserById: (userId: string) => Promise<User | null>;
    updateUser: (userId: string, data: any) => Promise<boolean>;
    updateUserStatus: (userId: string, status: string) => Promise<boolean>;
    addUser: (data: any) => Promise<boolean>;
  }

  export interface UseAuthReturn {
    user: any;
    profile: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: () => boolean;
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, userData: any) => Promise<any>;
  }

  // Export hook functions
  export function useUserManagement(): UseUserManagementReturn;
  export function useAuth(): UseAuthReturn;
  export function usePermissions(): any;
  export function useUserRole(): any;
  export function useRoleLevels(): any;
  export function useCalendarEvents(): any;
  export function useConcertEvents(): any;
  export function useMediaLibrary(): any;
  export function useMediaUpload(): any;
  export function useAudioFiles(): any;
  export function useAudioRecorder(): any;
  export function useSiteImages(): any;
  export function useSiteImageManager(): any;
  export function usePracticeLogs(): any;
  export function useBackingTracks(): any;
  export function useMixedRecordings(): any;
  export function useRecordingSave(): any;
  export function useNotifications(): any;
  export function useMessaging(): any;
  export function useFanForm(): any;
  export function useDashboardData(): any;
  export function useLoadingCoordinator(): any;
  export function useImagePreloader(): any;
  export function useSiteSettings(): any;
  export function useAIDescriptions(): any;
  export function usePDFAnnotations(): any;
  export function useToast(): any;
  export function useMedia(query: string): boolean;
  export function useIsMobile(): boolean;
  export function useSidebar(): any;
  export function useIntersection(): any;
}
