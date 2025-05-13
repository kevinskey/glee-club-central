
import { FileIcon, FileTextIcon, FileArchiveIcon, ImageIcon, Music, FileVideoIcon, FileCodeIcon } from "lucide-react";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileTypeIcon(mimeType: string): any {
  if (mimeType.startsWith('image/')) {
    return ImageIcon;
  } else if (mimeType.startsWith('audio/')) {
    return Music;
  } else if (mimeType.startsWith('video/')) {
    return FileVideoIcon;
  } else if (mimeType === 'application/pdf') {
    return FileTextIcon;
  } else if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar') || mimeType.includes('compress')) {
    return FileArchiveIcon;
  } else if (mimeType.includes('text/html') || mimeType.includes('text/css') || mimeType.includes('javascript')) {
    return FileCodeIcon;
  } else {
    return FileIcon;
  }
}
