
export interface PerformanceEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  image_url?: string;
  type: string;
  allday?: boolean;
}
