
export interface AudioFile {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_path: string;
  category: string;
  is_backing_track: boolean;
  uploaded_by: string;
  created_at: string;
}

export interface AudioFileData {
  id: string;
  title: string;
  description?: string | null;
  file_url: string;
  file_path?: string;
  category: string;
  created_at: string;
  uploaded_by?: string;
  is_backing_track?: boolean;
}

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  albumArt?: string;
  duration?: string;
  order?: number;
  featured?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: PlaylistTrack[];
}

// Updated AudioPageCategory type to include all needed categories
export type AudioPageCategory = 
  | 'recordings' 
  | 'backing_tracks' 
  | 'practice' 
  | 'performance'
  | 'part_tracks'
  | 'my_tracks'
  | 'all';
