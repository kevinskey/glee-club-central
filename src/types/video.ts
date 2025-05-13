
export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  datePublished?: string;
  category?: string;
  duration?: string;
  views?: number;
}

export interface VideoCategory {
  id: string;
  name: string;
  count: number;
}
