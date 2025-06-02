
import { FileText, Image, Video, Music, File } from "lucide-react";

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number | null | undefined): string {
  // Handle null, undefined, or 0 bytes
  if (bytes === null || bytes === undefined || bytes === 0) {
    return "Unknown size";
  }
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${size.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

/**
 * Get file extension from filename or file path
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if file is a valid image type
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(filename));
}

/**
 * Check if file is a valid video type
 */
export function isVideoFile(filename: string): boolean {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
  return videoExtensions.includes(getFileExtension(filename));
}

/**
 * Check if file is a valid audio type
 */
export function isAudioFile(filename: string): boolean {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
  return audioExtensions.includes(getFileExtension(filename));
}

/**
 * Check if file is a PDF
 */
export function isPDFFile(filename: string): boolean {
  return getFileExtension(filename) === 'pdf';
}

/**
 * Get the appropriate icon component for a file type
 */
export function getFileTypeIcon(fileType: string) {
  if (fileType.startsWith('image/')) {
    return Image;
  } else if (fileType.startsWith('video/')) {
    return Video;
  } else if (fileType.startsWith('audio/')) {
    return Music;
  } else if (fileType === 'application/pdf' || fileType.includes('pdf')) {
    return FileText;
  } else {
    return File;
  }
}
