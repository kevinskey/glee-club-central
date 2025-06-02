
export type MediaType = "image" | "video" | "audio" | "pdf" | "other";

export function getMediaType(fileType: string): MediaType {
  console.log('getMediaType called with:', fileType);
  
  if (!fileType) {
    console.log('No file type provided, returning other');
    return "other";
  }
  
  const lowerFileType = fileType.toLowerCase();
  
  if (lowerFileType.startsWith("image/")) {
    return "image";
  } else if (lowerFileType.startsWith("video/")) {
    return "video";
  } else if (lowerFileType.startsWith("audio/")) {
    return "audio";
  } else if (lowerFileType === "application/pdf" || lowerFileType.includes("pdf")) {
    console.log('Detected PDF file type:', fileType);
    return "pdf";
  } else {
    console.log('File type not recognized, returning other:', fileType);
    return "other";
  }
}

export function getMediaTypeLabel(type: MediaType): string {
  switch (type) {
    case "image":
      return "Image";
    case "video":
      return "Video";
    case "audio":
      return "Audio";
    case "pdf":
      return "PDF";
    default:
      return "Other";
  }
}

export async function fetchFlickrPhotos(userId?: string, photoCount?: number): Promise<any[]> {
  try {
    console.log('Flickr fetch not implemented yet', { userId, photoCount });
    // This is a placeholder - the real implementation would fetch from Flickr API
    return [];
  } catch (error) {
    console.error("Error fetching Flickr photos:", error);
    return [];
  }
}
