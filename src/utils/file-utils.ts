
import { FileMusic, FileText, FileImage, FileVideo, File } from "lucide-react";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileTypeIcon(mimeType: string) {
  if (mimeType.startsWith("audio/")) {
    return FileMusic;
  } else if (mimeType.startsWith("image/")) {
    return FileImage;
  } else if (mimeType.startsWith("video/")) {
    return FileVideo;
  } else if (mimeType === "application/pdf" || mimeType.includes("document")) {
    return FileText;
  } else {
    return File;
  }
}
