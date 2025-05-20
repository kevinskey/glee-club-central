import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AudioCategorySelector } from "../audio/AudioCategorySelector";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { UploadCloud, XCircle, FileAudio } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export function FileUploader() {
  // State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("practice");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom hooks
  const { user } = useAuth();
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    processSelectedFile(file);
  };
  
  // Process the selected audio file
  const processSelectedFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file (MP3, WAV, etc.)");
      return;
    }
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 50MB");
      return;
    }
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(previewUrl);
    
    // Set file and default title
    setSelectedFile(file);
    
    // Generate title from filename if not set
    if (!title) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      setTitle(fileName);
    }
  };
  
  // Clear selected file
  const clearSelectedFile = () => {
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    setAudioPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Handle form submission
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !user) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Please enter a title for the recording");
      return;
    }
    
    try {
      setIsUploading(true);
      toast.loading("Uploading recording...");
      
      // Create a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      // Create form data for upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title);
      formData.append("userId", user.id);
      formData.append("category", category);
      formData.append("notes", notes);
      formData.append("filePath", filePath);
      
      // Upload to Supabase
      const response = await fetch('/api/upload-audio', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      
      toast.dismiss();
      toast.success("File uploaded successfully");
      
      // Reset form
      setTitle("");
      setNotes("");
      clearSelectedFile();
      
    } catch (error) {
      toast.dismiss();
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleUpload} className="space-y-4">
            {/* File Drop Area */}
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center ${
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
              } transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <FileAudio className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB
                  </p>
                  
                  {audioPreviewUrl && (
                    <audio
                      src={audioPreviewUrl}
                      controls
                      className="w-full max-w-md mx-auto mt-2"
                    />
                  )}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearSelectedFile}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <UploadCloud className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">
                      Drag and drop your audio file here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports MP3, WAV, M4A, and FLAC files up to 50MB
                    </p>
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select File
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="audio/*"
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* File Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Recording Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your recording"
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <AudioCategorySelector 
                  onChange={(value) => setCategory(value)}
                  value={category} 
                  disabled={isUploading}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this recording"
                  disabled={isUploading}
                  rows={4}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload Recording
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
