
export type MediaType = "image" | "video" | "audio" | "pdf" | "other";

export function getMediaType(fileType: string): MediaType {
  if (fileType.startsWith("image/")) {
    return "image";
  } else if (fileType.startsWith("video/")) {
    return "video";
  } else if (fileType.startsWith("audio/")) {
    return "audio";
  } else if (fileType === "application/pdf" || fileType.includes("pdf")) {
    return "pdf";
  } else {
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
