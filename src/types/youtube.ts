
export interface YouTubeVideo {
  id: string;
  title: string;
  description?: string;
  videoId: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelId?: string;
  channelTitle?: string;
  viewCount?: number;
  likeCount?: number;
  duration?: string;
}
