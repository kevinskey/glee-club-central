
export interface MediaFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_path: string;
  file_type: string;
  created_at: string;
  uploaded_by: string;
  category?: string;
  tags?: string[];
  folder?: string;
  size?: number;
}

export type MediaCategory = 'sheet_music' | 'audio' | 'video' | 'other';

export interface MediaStats {
  totalFiles: number;
  totalSize: number;
  filesByType: Record<string, number>;
}
