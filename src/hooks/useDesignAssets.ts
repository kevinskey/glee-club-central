
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DesignAsset {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  extraction_status: 'pending' | 'extracting' | 'completed' | 'failed';
  extracted_files: any[];
  uploaded_by: string;
  uploaded_at: string;
  extracted_at?: string;
}

export function useDesignAssets() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<DesignAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = async () => {
    if (!user) {
      setAssets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('design_assets')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setAssets(data || []);
    } catch (err: any) {
      console.error('Error loading design assets:', err);
      setError(err.message);
      toast.error('Failed to load design assets');
    } finally {
      setLoading(false);
    }
  };

  const getAssetUrl = async (filePath: string) => {
    const { data } = supabase.storage
      .from('design-assets')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  const getExtractedFiles = (asset: DesignAsset) => {
    return asset.extracted_files || [];
  };

  const getAssetsByStatus = (status: DesignAsset['extraction_status']) => {
    return assets.filter(asset => asset.extraction_status === status);
  };

  const deleteAsset = async (assetId: string) => {
    try {
      // Find the asset to get its file path
      const asset = assets.find(a => a.id === assetId);
      if (!asset) {
        throw new Error('Asset not found');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('design-assets')
        .remove([asset.file_path]);

      if (storageError) {
        console.warn('Storage deletion error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('design_assets')
        .delete()
        .eq('id', assetId);

      if (dbError) {
        throw dbError;
      }

      toast.success('Asset deleted successfully');
      await loadAssets();
    } catch (err: any) {
      console.error('Error deleting asset:', err);
      toast.error(`Failed to delete asset: ${err.message}`);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [user]);

  // Set up realtime subscription for asset updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('design-assets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'design_assets',
        },
        () => {
          loadAssets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    assets,
    loading,
    error,
    loadAssets,
    getAssetUrl,
    getExtractedFiles,
    getAssetsByStatus,
    deleteAsset,
    completedAssets: getAssetsByStatus('completed'),
    pendingAssets: getAssetsByStatus('pending'),
    extractingAssets: getAssetsByStatus('extracting'),
    failedAssets: getAssetsByStatus('failed'),
  };
}
