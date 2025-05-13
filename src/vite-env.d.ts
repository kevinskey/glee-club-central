
/// <reference types="vite/client" />

// Google Maps API type definitions
interface Window {
  google: any;
  initGoogleMapsAutocomplete?: () => void;
}

declare namespace google {
  namespace maps {
    class Geocoder {
      geocode(request: {address: string}, callback: (results: any, status: any) => void): void;
    }
    
    namespace places {
      class Autocomplete {
        constructor(inputElement: HTMLInputElement, options?: AutocompleteOptions);
        addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
        getPlace(): google.maps.places.PlaceResult;
      }
      
      interface AutocompleteOptions {
        types?: string[];
        componentRestrictions?: {country: string | string[]};
        fields?: string[];
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        strictBounds?: boolean;
      }
      
      interface PlaceResult {
        address_components?: any[];
        formatted_address?: string;
        geometry?: {location: any};
        place_id?: string;
        name?: string;
      }
    }
    
    interface MapsEventListener {
      remove(): void;
    }
  }
}
