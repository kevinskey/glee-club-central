
export type MediaType = "pdf" | "audio" | "image" | "video" | "other";

export function getMediaType(fileType: string): MediaType {
  if (fileType.startsWith('audio/') || fileType.includes('audio')) {
    return "audio";
  } else if (fileType.startsWith('video/') || fileType.includes('video')) {
    return "video";
  } else if (fileType.startsWith('image/') || fileType.includes('image')) {
    return "image";
  } else if (
    fileType === 'application/pdf' || 
    fileType.includes('pdf') || 
    fileType.endsWith('.pdf')
  ) {
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

// Flickr API utility
export async function fetchFlickrPhotos(userId = '129581018@N02', count = 6) {
  // Updated API key for Flickr
  const apiKey = '3123882337f8b49fe43efdc0b5cdd46a';
  const url = `https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${apiKey}&user_id=${userId}&format=json&per_page=${count}&nojsoncallback=1`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.stat !== 'ok') {
      console.error('Error fetching Flickr photos:', data);
      return [];
    }
    
    return data.photos.photo.map((photo: any) => ({
      id: photo.id,
      title: photo.title,
      imageUrl: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`, // c is for medium 800px
      thumbnailUrl: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`, // q is for square 150px
      flickrUrl: `https://www.flickr.com/photos/${userId}/${photo.id}/`
    }));
  } catch (error) {
    console.error('Error fetching Flickr photos:', error);
    return [];
  }
}
