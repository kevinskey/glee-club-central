
export interface HeroSlide {
  id: string;
  title: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  media_id?: string;
  youtube_url?: string;
  media_type?: string;
  visible: boolean;
  show_title?: boolean;
  slide_order: number;
}

export interface MediaFile {
  id: string;
  file_url: string;
  title: string;
}
