
/**
 * Common type definitions used across the GleeWorld application
 * Consolidated to reduce duplication and improve maintainability
 */

export interface HeroImage {
  id: string;
  url: string;
  title?: string;
  alt?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
  isPublic?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  albumArt: string;
  artist: string;
  duration: string;
}

export interface FanFormData {
  fullName: string;
  email: string;
  favoriteMemory: string;
}

export interface NavigationLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}
