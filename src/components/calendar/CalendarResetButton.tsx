
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/usePermissions';

interface CalendarResetButtonProps {
  onResetCalendar: () => Promise<boolean>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function CalendarResetButton({
  onResetCalendar,
  variant = 'outline',
  size = 'default',
  className = ''
}: CalendarResetButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { isSuperAdmin } = usePermissions();
  
  if (!isSuperAdmin) {
    return null;
  }
  
  const handleReset = async () => {
    setIsResetting(true);
    try {
      const success = await onResetCalendar();
      if (success) {
        toast.success("Calendar has been reset successfully");
      } else {
        toast.error("Failed to reset calendar");
      }
    } catch (error) {
      console.error("Error resetting calendar:", error);
      toast.error("An error occurred while resetting the calendar");
    } finally {
      setIsResetting(false);
      setIsConfirmOpen(false);
    }
  };
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsConfirmOpen(true)}
        className={`${className} text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800`}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Reset Calendar
      </Button>
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Calendar</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the calendar? This will permanently delete all events.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleReset();
              }}
              disabled={isResetting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Calendar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
