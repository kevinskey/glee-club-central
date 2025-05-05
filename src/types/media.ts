
export interface MediaFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_path: string;
  file_type: string;
  created_at: string;
  uploaded_by: string;
}
