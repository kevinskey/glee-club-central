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
