
export interface AudioFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_path: string;
  created_at: string;
  uploaded_by: string;
  category: string;
  is_backing_track?: boolean;
}

export interface AudioFileData {
  id: string;
  title: string;
  file_url: string;
  description?: string;
  category: string;
  created_at: string;
  file_path?: string;
  uploaded_by?: string;
  is_backing_track?: boolean;
}

export type AudioPageCategory = "part_tracks" | "recordings" | "my_tracks" | "all" | "backing_tracks";
