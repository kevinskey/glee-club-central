
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
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Design Studio</h1>
        </div>

        <Tabs defaultValue="designer" className="w-full">
          <div className="bg-white border-b border-gray-200 px-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="designer">Designer</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="designer" className="m-0">
            {/* Main layout - 3 panel design */}
            <div className="flex h-[calc(100vh-140px)]">
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
          </TabsContent>

          <TabsContent value="assets" className="m-0">
            <div className="p-6 max-w-4xl mx-auto">
              <AssetUploader />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DesignProvider>
  );
};
