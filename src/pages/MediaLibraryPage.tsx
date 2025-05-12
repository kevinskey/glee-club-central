
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Library } from "lucide-react";
import MediaLibraryPage from './media-library/MediaLibraryPage';

// This is just a wrapper component that re-exports the actual MediaLibraryPage component
const MediaLibraryPageWrapper: React.FC = () => {
  return <MediaLibraryPage />;
};

export default MediaLibraryPageWrapper;
