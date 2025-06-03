
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileArchive, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UploadedAsset {
  id: string;
  file_name: string;
  file_size: number;
  extraction_status: string;
  uploaded_at: string;
}

export function AssetUploader() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [extracting, setExtracting] = useState<string | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5GB = 5 * 1024 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size exceeds 5GB limit');
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const uploadFile = async () => {
    if (!selectedFile || !user) {
      toast.error('Please select a file and ensure you are logged in');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `uploads/${user.id}/${fileName}`;

      // Upload to Supabase Storage with chunked upload for large files
      const chunkSize = 6 * 1024 * 1024; // 6MB chunks
      const totalChunks = Math.ceil(selectedFile.size / chunkSize);
      
      if (selectedFile.size <= chunkSize) {
        // Simple upload for smaller files
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('design-assets')
          .upload(filePath, selectedFile);

        if (uploadError) {
          throw uploadError;
        }
        
        setUploadProgress(100);
      } else {
        // Chunked upload for large files
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const start = chunkIndex * chunkSize;
          const end = Math.min(start + chunkSize, selectedFile.size);
          const chunk = selectedFile.slice(start, end);
          
          const chunkPath = chunkIndex === 0 ? filePath : `${filePath}.part.${chunkIndex}`;
          
          const { error: chunkError } = await supabase.storage
            .from('design-assets')
            .upload(chunkPath, chunk, {
              upsert: chunkIndex > 0
            });

          if (chunkError) {
            throw chunkError;
          }

          const progress = ((chunkIndex + 1) / totalChunks) * 100;
          setUploadProgress(progress);
        }
      }

      // Determine if this is a ZIP file
      const isZipFile = selectedFile.type === 'application/zip' || 
                       selectedFile.name.toLowerCase().endsWith('.zip') ||
                       selectedFile.name.toLowerCase().endsWith('.rar') ||
                       selectedFile.name.toLowerCase().endsWith('.7z');

      // For non-ZIP files, prepare the extracted_files array immediately
      const extractedFiles = isZipFile ? [] : [
        {
          name: selectedFile.name,
          path: filePath,
          size: selectedFile.size,
          type: selectedFile.type
        }
      ];

      // Create database record with appropriate status
      const { data: assetData, error: dbError } = await supabase
        .from('design_assets')
        .insert({
          file_name: selectedFile.name,
          file_path: filePath,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
          uploaded_by: user.id,
          extraction_status: isZipFile ? 'pending' : 'completed',
          extracted_files: extractedFiles,
          extracted_at: isZipFile ? null : new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      toast.success('File uploaded successfully!');
      setSelectedFile(null);
      setUploadProgress(0);
      
      // Refresh assets list
      await loadAssets();

      // Auto-extract if it's a ZIP file
      if (isZipFile) {
        await extractAsset(assetData.id);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const extractAsset = async (assetId: string) => {
    setExtracting(assetId);
    
    try {
      const { data, error } = await supabase.functions.invoke('extract-design-assets', {
        body: { assetId }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success('Asset extracted successfully!');
        await loadAssets();
      } else {
        throw new Error(data.error || 'Extraction failed');
      }
    } catch (error: any) {
      console.error('Extraction error:', error);
      toast.error(`Extraction failed: ${error.message}`);
    } finally {
      setExtracting(null);
    }
  };

  const loadAssets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('design_assets')
        .select('id, file_name, file_size, extraction_status, uploaded_at')
        .eq('uploaded_by', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAssets(data || []);
    } catch (error: any) {
      console.error('Error loading assets:', error);
      toast.error('Failed to load assets');
    }
  };

  React.useEffect(() => {
    loadAssets();
  }, [user]);

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string, assetId: string) => {
    if (extracting === assetId) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'extracting':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string, fileName: string) => {
    const isZipFile = fileName.toLowerCase().match(/\.(zip|rar|7z)$/);
    
    switch (status) {
      case 'completed':
        return 'Ready';
      case 'failed':
        return 'Failed';
      case 'extracting':
        return 'Extracting...';
      case 'pending':
        return isZipFile ? 'Ready to extract' : 'Processing...';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Design Assets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset-file">Select File (Max 5GB)</Label>
            <Input
              id="asset-file"
              type="file"
              onChange={handleFileSelect}
              accept=".zip,.rar,.7z,.png,.jpg,.jpeg,.svg,.pdf"
              disabled={uploading}
            />
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center">{Math.round(uploadProgress)}% uploaded</p>
            </div>
          )}

          <Button 
            onClick={uploadFile} 
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Asset
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileArchive className="h-5 w-5" />
            Uploaded Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No assets uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{asset.file_name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(asset.file_size)} • {new Date(asset.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(asset.extraction_status, asset.id)}
                    <span className="text-sm">{getStatusText(asset.extraction_status, asset.file_name)}</span>
                    {asset.extraction_status === 'pending' && asset.file_name.toLowerCase().match(/\.(zip|rar|7z)$/) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => extractAsset(asset.id)}
                        disabled={extracting === asset.id}
                      >
                        Extract
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
