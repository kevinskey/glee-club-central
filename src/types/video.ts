
export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  publishedAt: string;
  duration?: string;
  viewCount?: number;
  category?: string;
  tags?: string[];
}
