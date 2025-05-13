
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

export interface YouTubeApiResponse {
  items: YouTubeApiItem[];
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeApiItem {
  id: {
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  contentDetails?: {
    duration: string;
  };
}
