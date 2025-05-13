
// Re-export all functionality from the services file
export * from "@/services/googleCalendar";

// Add Google Maps utility functions
export interface GoogleMapsPlace {
  address: string;
  lat: number;
  lng: number;
  placeId: string;
}

/**
 * Get coordinates from an address using Google Maps Geocoding API
 */
export const getCoordinatesFromAddress = async (address: string): Promise<GoogleMapsPlace | null> => {
  try {
    if (!window.google) {
      console.error("Google Maps API not loaded");
      return null;
    }
    
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK') {
          const place = results[0];
          resolve({
            address: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            placeId: place.place_id
          });
        } else {
          console.error("Geocoding failed:", status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
};

/**
 * Generate a Google Maps link from an address
 */
export const generateGoogleMapsLink = (address: string): string => {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

/**
 * Generate a static Google Maps image URL from an address
 */
export const generateStaticMapUrl = (address: string, width = 600, height = 300, zoom = 14): string => {
  const encodedAddress = encodeURIComponent(address);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=${zoom}&size=${width}x${height}&markers=color:red|${encodedAddress}&key=AIzaSyDV-0kQ8jWP-AMzgbxlXdT1IuS7ZUrpgek`;
};
