
/**
 * PDF utility functions for handling common PDF loading and display issues
 */

/**
 * Validates if a URL string is likely to be a valid PDF URL
 * @param url The URL to validate
 */
export function isValidPdfUrl(url?: string): boolean {
  if (!url) return false;
  
  const trimmedUrl = url.trim();
  
  // Basic URL validation
  try {
    new URL(trimmedUrl);
  } catch (e) {
    console.error("Invalid URL format:", e);
    return false;
  }
  
  // Check if URL ends with .pdf (not always reliable but a good hint)
  const isPdfExtension = trimmedUrl.toLowerCase().endsWith('.pdf');
  
  // Further checks could be added here based on project needs
  
  return true; // Default to true after basic validation
}

/**
 * Creates a URL with cache busting parameters to prevent caching issues
 * @param url Base URL
 * @returns URL with cache busting parameters
 */
export function createCacheBustedUrl(url: string): string {
  if (!url) return '';
  
  const timestamp = Date.now();
  const separator = url.includes('?') ? '&' : '?';
  
  return `${url}${separator}t=${timestamp}`;
}

/**
 * Creates parameters for the Google PDF Viewer as a fallback
 * @param url PDF URL
 * @returns Google PDF Viewer URL
 */
export function getGoogleViewerUrl(url: string): string {
  if (!url) return '';
  const encodedUrl = encodeURIComponent(url);
  return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
}

/**
 * Checks if the current browser is likely to have issues with PDF display
 * @returns Boolean indicating if fallback viewer should be used
 */
export function shouldUseFallbackViewer(): boolean {
  // iOS often has issues with PDF display
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
  // Add other browser detections as needed
  const isOldIE = /MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.userAgent);
  
  return isIOS || isOldIE;
}

/**
 * Preloads a PDF for faster display
 * @param url URL to preload 
 * @returns Promise that resolves when preloaded or rejects on error
 */
export function preloadPdf(url: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error("No URL provided for preloading"));
      return;
    }
    
    const cacheBustedUrl = createCacheBustedUrl(url);
    
    // Create a fetch request to preload the PDF
    fetch(cacheBustedUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log("PDF preloaded successfully:", url);
          resolve(true);
        } else {
          console.error("PDF preload failed:", response.status, response.statusText);
          reject(new Error(`Failed to preload PDF: ${response.status}`));
        }
      })
      .catch(error => {
        console.error("PDF preload error:", error);
        reject(error);
      });
  });
}
