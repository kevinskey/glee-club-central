
/**
 * Format a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from a file name or path
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

/**
 * Generate a unique filename based on original name
 */
export function generateUniqueFileName(originalName: string): string {
  const ext = getFileExtension(originalName);
  const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  
  return `${baseName}-${timestamp}-${randomString}.${ext}`;
}

/**
 * Convert a File object to a data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
