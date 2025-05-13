
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  subscriberCount: number;
  videoCount: number;
}
