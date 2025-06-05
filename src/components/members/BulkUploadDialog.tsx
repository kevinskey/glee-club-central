
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BulkMemberUpload } from './BulkMemberUpload';

interface BulkUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: () => void;
}

export function BulkUploadDialog({ isOpen, onOpenChange, onUploadComplete }: BulkUploadDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Member Upload</DialogTitle>
          <DialogDescription>
            Import multiple members from CSV, Excel, or JSON files
          </DialogDescription>
        </DialogHeader>
        <BulkMemberUpload />
      </DialogContent>
    </Dialog>
  );
}
