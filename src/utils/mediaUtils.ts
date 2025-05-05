
export type MediaType = "pdf" | "audio" | "image" | "video" | "other";

export function getMediaType(fileType: string): MediaType {
  if (fileType.startsWith('audio/') || fileType.includes('audio')) {
    return "audio";
  } else if (fileType.startsWith('video/') || fileType.includes('video')) {
    return "video";
  } else if (fileType.startsWith('image/') || fileType.includes('image')) {
    return "image";
  } else if (fileType === 'application/pdf' || fileType.includes('pdf')) {
    return "pdf";
  } else {
    return "other";
  }
}

export function getMediaTypeLabel(type: MediaType): string {
  switch (type) {
    case "pdf":
      return "PDF Documents";
    case "audio":
      return "Audio Files";
    case "image":
      return "Images";
    case "video":
      return "Videos";
    case "other":
      return "Other Files";
  }
}
