
import React from 'react';
import { LeftSidebar } from './LeftSidebar';
import { GarmentPreview } from './GarmentPreview';
import { RightPanel } from './RightPanel';
import { BottomControls } from './BottomControls';
import { AssetUploader } from './AssetUploader';
import { DesignProvider } from './DesignContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const DesignStudio = () => {
  return (
    <DesignProvider>
      <div className="min-h-screen bg-gray-100 design-studio-container">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 design-studio-header">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Design Studio</h1>
        </div>

        <Tabs defaultValue="designer" className="w-full">
          <div className="bg-white border-b border-gray-200 px-4 md:px-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md admin-tab-list">
              <TabsTrigger value="designer" className="admin-tab-trigger">Designer</TabsTrigger>
              <TabsTrigger value="assets" className="admin-tab-trigger">Assets</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="designer" className="m-0 admin-tab-content">
            {/* Mobile-optimized layout */}
            <div className="design-studio-layout flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-140px)]">
              {/* Mobile: Preview first, then sidebar and panel */}
              
              {/* Center Panel - Garment Preview - Mobile First */}
              <div className="design-studio-preview flex-1 bg-gray-100 relative order-1 lg:order-2 min-h-[50vh] lg:min-h-0">
                <GarmentPreview />
              </div>

              {/* Left Sidebar - Mobile: Full width below preview */}
              <div className="design-studio-sidebar w-full lg:w-80 bg-gray-800 text-white order-2 lg:order-1">
                <LeftSidebar />
              </div>

              {/* Right Panel - Mobile: Full width at bottom */}
              <div className="design-studio-panel w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 order-3">
                <RightPanel />
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="order-4">
              <BottomControls />
            </div>
          </TabsContent>

          <TabsContent value="assets" className="m-0 admin-tab-content">
            <div className="p-4 md:p-6 max-w-4xl mx-auto">
              <AssetUploader />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DesignProvider>
  );
};
