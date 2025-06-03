
import React from 'react';
import { LeftSidebar } from './LeftSidebar';
import { GarmentPreview } from './GarmentPreview';
import { RightPanel } from './RightPanel';
import { BottomControls } from './BottomControls';
import { DesignProvider } from './DesignContext';

export const DesignStudio = () => {
  return (
    <DesignProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Design Studio</h1>
        </div>

        {/* Main layout - 3 panel design */}
        <div className="flex h-[calc(100vh-100px)]">
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-800 text-white">
            <LeftSidebar />
          </div>

          {/* Center Panel - Garment Preview */}
          <div className="flex-1 bg-gray-100 relative">
            <GarmentPreview />
          </div>

          {/* Right Panel */}
          <div className="w-80 bg-white border-l border-gray-200">
            <RightPanel />
          </div>
        </div>

        {/* Bottom Controls */}
        <BottomControls />
      </div>
    </DesignProvider>
  );
};
