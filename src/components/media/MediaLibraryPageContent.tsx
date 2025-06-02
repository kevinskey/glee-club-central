
import React from 'react';
import { EnhancedMediaLibrary } from './EnhancedMediaLibrary';

interface MediaLibraryPageContentProps {
  searchTerm?: string;
  filterType?: string;
  viewMode?: 'grid' | 'list';
  selectedFiles?: string[];
  onFileSelect?: (fileId: string) => void;
  isAdminView?: boolean;
}

export function MediaLibraryPageContent({ 
  isAdminView = false,
  ...props 
}: MediaLibraryPageContentProps) {
  return (
    <div className="space-y-6">
      <EnhancedMediaLibrary isAdminView={isAdminView} />
    </div>
  );
}
