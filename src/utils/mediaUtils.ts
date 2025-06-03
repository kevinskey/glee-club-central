
export type MediaType = "image" | "video" | "audio" | "pdf" | "document" | "other";

export function getMediaType(fileType: string): MediaType {
  console.log('getMediaType called with:', fileType);
  
  if (fileType.startsWith('image/')) {
    return 'image';
  } else if (fileType.startsWith('video/')) {
    return 'video';
  } else if (fileType.startsWith('audio/')) {
    return 'audio';
  } else if (fileType === 'application/pdf' || fileType.includes('pdf')) {
    console.log('Detected PDF file type:', fileType);
    return 'pdf';
  } else if (fileType.startsWith('application/') || fileType.startsWith('text/')) {
    return 'document';
  } else {
    return 'other';
  }
}

export function getMediaTypeLabel(type: MediaType): string {
  switch (type) {
    case 'image':
      return 'Images';
    case 'video':
      return 'Videos';
    case 'audio':
      return 'Audio';
    case 'pdf':
      return 'PDFs';
    case 'document':
      return 'Documents';
    case 'other':
      return 'Other';
    default:
      return 'Unknown';
  }
}
