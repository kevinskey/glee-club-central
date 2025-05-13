
import React, { useEffect, useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { FormControl, FormDescription } from "@/components/ui/form";
import { MapPin } from "lucide-react";

interface GoogleMapAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    initGoogleMapsAutocomplete: () => void;
  }
}

export function GoogleMapAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Enter a location",
  className = "",
  disabled = false
}: GoogleMapAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Google Maps API script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDV-0kQ8jWP-AMzgbxlXdT1IuS7ZUrpgek&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize Autocomplete when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode', 'establishment'],
      });

      const autocompleteListener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          onChange(place.formatted_address);
          if (onSelect) {
            onSelect(place);
          }
        }
      });

      return () => {
        window.google?.maps.event.removeListener(autocompleteListener);
      };
    }
  }, [isLoaded, onChange, onSelect]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        disabled={disabled || !isLoaded}
      />
      <MapPin 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" 
      />
      {!isLoaded && (
        <FormDescription className="text-xs mt-1">
          Loading Google Maps...
        </FormDescription>
      )}
    </div>
  );
}
