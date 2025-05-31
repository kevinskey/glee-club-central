import React from 'react';
import { User } from '@/hooks/user/useUserManagement';

/**
 * This is a simplified stub component to maintain backward compatibility
 */
interface MemberPermissionsDialogProps {
  user: User | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => Promise<void>;
}

export function MemberPermissionsDialog({ 
  user, 
  isOpen, 
  setIsOpen, 
  onSuccess 
}: MemberPermissionsDialogProps) {
  // This is just a stub component to maintain backward compatibility
  React.useEffect(() => {
    if (isOpen) {
      console.log("Permissions management is disabled in simplified permissions model");
      setIsOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isOpen, setIsOpen, onSuccess]);
  
  return null;
}
