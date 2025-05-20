
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Mic, Headphones, Files, UploadCloud } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordingStudio } from "@/components/recordings/RecordingStudio";
import { RecordingLibrary } from "@/components/recordings/RecordingLibrary";
import { FileUploader } from "@/components/recordings/FileUploader";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function RecordingStudioPage() {
  const { getUserType, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("record");

  // Redirect non-members
  if (!isLoading && getUserType() !== 'member' && getUserType() !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Recording Studio"
        description="Record, edit, and manage your vocal performances"
        icon={<Headphones className="h-6 w-6" />}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="record" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Record</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Files className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="record" className="mt-4">
          <RecordingStudio />
        </TabsContent>
        
        <TabsContent value="library" className="mt-4">
          <RecordingLibrary />
        </TabsContent>
        
        <TabsContent value="upload" className="mt-4">
          <FileUploader />
        </TabsContent>
      </Tabs>
    </div>
  );
}
