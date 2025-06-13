
export interface SlideTemplate {
  id: string;
  name: string;
  description?: string;
  layout_type: 'full' | 'half_horizontal' | 'half_vertical' | 'quarter';
  template_data: TemplateData;
  designable_areas: DesignableArea[];
  default_styles: Record<string, any>;
  thumbnail_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface SlideDesign {
  id: string;
  template_id?: string;
  title: string;
  description?: string;
  layout_type: 'full' | 'half_horizontal' | 'half_vertical' | 'quarter';
  design_data: DesignData;
  background_color: string;
  background_image_url?: string;
  background_media_id?: string;
  animation_settings: AnimationSettings;
  link_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface TemplateData {
  textAreas: TextArea[];
  backgroundZones: BackgroundZone[];
}

export interface DesignData {
  textElements: TextElement[];
  backgroundElements: BackgroundElement[];
  customElements?: CustomElement[];
}

export interface DesignableArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  constraints: Record<string, any>;
}

export interface TextArea {
  id: string;
  type: 'heading' | 'paragraph' | 'caption';
  defaultText: string;
  position: Position;
  style: TextStyle;
}

export interface TextElement {
  id: string;
  type: 'heading' | 'paragraph' | 'caption';
  text: string;
  position: Position;
  style: TextStyle;
}

export interface BackgroundZone {
  id: string;
  type: 'background';
  position: ZonePosition;
  allowMedia?: boolean;
  allowColor?: boolean;
}

export interface BackgroundElement {
  id: string;
  type: 'color' | 'image' | 'video';
  value: string;
  position: ZonePosition;
}

export interface CustomElement {
  id: string;
  type: 'button' | 'logo' | 'icon';
  content: any;
  position: Position;
  style: any;
}

export interface Position {
  x: number; // percentage
  y: number; // percentage
}

export interface ZonePosition extends Position {
  width: number; // percentage
  height: number; // percentage
}

export interface TextStyle {
  fontSize: string;
  color: string;
  fontWeight?: string;
  fontStyle?: string; // Added this property
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  textShadow?: string;
}

export interface AnimationSettings {
  duration: number;
  transition: 'fade' | 'slide' | 'zoom' | 'none';
  autoPlay?: boolean;
}
