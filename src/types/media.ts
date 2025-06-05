
export interface MediaFile {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_path: string;
  file_type: string;
  uploaded_by: string;
  category?: string;
  folder?: string;
  tags?: string[];
  created_at: string;
  size?: number;
  file_size?: number;
}

export interface MediaStats {
  totalFiles: number;
  totalSize: number;
  filesByType: { [key: string]: number };
}
