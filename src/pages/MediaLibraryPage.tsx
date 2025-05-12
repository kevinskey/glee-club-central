
import React from 'react';
import MediaLibraryPage from './media-library/MediaLibraryPage';

// This is a wrapper component that re-exports the actual MediaLibraryPage
const MediaLibraryPageWrapper: React.FC = () => {
  return <MediaLibraryPage />;
};

export default MediaLibraryPageWrapper;
