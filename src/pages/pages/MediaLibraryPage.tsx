
import React from 'react';
import MediaLibraryPage from '../MediaLibraryPage';

// This is a wrapper component that re-exports the actual MediaLibraryPage
const MediaLibraryPageWrapper: React.FC = () => {
  console.log("MediaLibraryPage wrapper component rendering");
  return <MediaLibraryPage />;
};

export default MediaLibraryPageWrapper;
