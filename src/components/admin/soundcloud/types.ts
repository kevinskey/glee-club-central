
export interface SoundCloudUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  followers_count: number;
  followings_count: number;
  track_count: number;
  playlist_count: number;
}

export interface SoundCloudTrack {
  id: string;
  title: string;
  artist: string;
  permalink_url: string;
  artwork_url: string;
  duration: number;
  likes: number;
  plays: number;
  genre: string;
  uploadDate: string;
  description: string;
  embeddable_by: string;
  stream_url: string;
}

export interface SoundCloudPlaylist {
  id: string;
  name: string;
  description: string;
  track_count: number;
  duration: number;
  artwork_url: string;
  permalink_url: string;
  is_public: boolean;
  created_at: string;
  tracks: any[];
}
