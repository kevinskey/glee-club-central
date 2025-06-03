
export interface HeroSlide {
  id: string;
  media_id?: string;
  media_type: 'image' | 'video';
  title: string;
  description: string;
  button_text?: string;
  button_link?: string;
  text_position: 'top' | 'center' | 'bottom';
  text_alignment: 'left' | 'center' | 'right';
  visible: boolean;
  slide_order: number;
  section_id?: string;
}

export interface HeroSettings {
  animation_style: 'fade' | 'slide' | 'zoom' | 'none';
  scroll_interval: number;
  pause_on_hover: boolean;
  loop: boolean;
}

export interface MediaFile {
  id: string;
  file_url: string;
  file_type: string;
  title: string;
}

export type TestMode = 'desktop' | 'tablet' | 'mobile' | null;
