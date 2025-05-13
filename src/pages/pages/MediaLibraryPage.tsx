
import React from 'react';
import MediaLibraryPage from '../MediaLibraryPage';

// This is a wrapper component that re-exports the actual MediaLibraryPage
const MediaLibraryPageWrapper: React.FC = () => {
  console.log("MediaLibraryPageWrapper: rendering media library page");
  return (
    <div className="h-full w-full">
      <MediaLibraryPage />
    </div>
  );
};

export default MediaLibraryPageWrapper;
