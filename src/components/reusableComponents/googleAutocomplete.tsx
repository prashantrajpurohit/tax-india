"use client";

import React, { useState, useEffect, JSX } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import type { Suggestion } from "use-places-autocomplete";
import { MapPin, Search, X } from "lucide-react";
import { FieldValues, useFormContext, UseFormSetValue } from "react-hook-form";

declare global {
  interface Window {
    google: any;
  }
}
const fields = [
  "city",
  "state",
  "country",
  "zipCode",
  "address",
  "longitude",
  "latitude",
];
function useGoogleMapsLoaded() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    const checkLoaded = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsLoaded(true);
        clearInterval(checkLoaded);
      }
    }, 100);

    return () => clearInterval(checkLoaded);
  }, []);

  return isLoaded;
}

interface AutocompleteInputProps {
  setAddress: UseFormSetValue<FieldValues>;
  specificUpdate?: string;
}

function AutocompleteInput({
  setAddress,
  specificUpdate,
}: AutocompleteInputProps): JSX.Element {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: ["ca"] },
    },
    debounce: 300,
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = async (suggestion: Suggestion): Promise<void> => {
    const selectedAddress = suggestion.description;
    setValue(selectedAddress, false);
    clearSuggestions();
    setIsOpen(false);

    try {
      const results = await getGeocode({ address: selectedAddress });
      const addressComponents = results[0].address_components;
      const geo = results[0].geometry;
      const latitude = geo.location.lat();
      const longitude = geo.location.lng();
      let city = "";
      let state = "";
      let country = "";
      let zipCode = "";
      addressComponents.forEach((component: any) => {
        const types = component.types;
        if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("sublocality")) {
          city = city || component.long_name; // Fallback if locality doesn't exist
        } else if (types.includes("administrative_area_level_2")) {
          city = city || component.long_name; // Another fallback
        }

        if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }

        if (types.includes("country")) {
          country = component.long_name;
        }

        if (types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      });
      if (specificUpdate) {
        setAddress(specificUpdate, selectedAddress);
        return;
      }
      const addressObj: Record<string, string | number> = {
        city,
        country,
        state,
        latitude,
        longitude,
        zipCode,
        address: selectedAddress,
      };

      fields.forEach((item) => {
        return setAddress(item, addressObj[item], { shouldValidate: true });
      });
    } catch (error) {
      console.error("Error fetching geocode details:", error);
    }
  };

  const handleClear = (): void => {
    setValue("");
    if (specificUpdate) {
      setAddress(specificUpdate, "");
    } else {
      fields.forEach((item) => {
        return setAddress(item, "", { shouldValidate: true });
      });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
        <input
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search Location..."
          className="w-full pl-10 pr-10 py-2 text-sm bg-background text-foreground border border-border rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground hover:border-border/80 dark:hover:border-border"
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            type="button"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {status === "OK" && isOpen && data.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-popover text-popover-foreground border border-border rounded-[var(--radius)] shadow-lg max-h-60 overflow-y-auto">
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
              <button
                key={place_id}
                onClick={() => handleSelect(suggestion)}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0 focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground truncate">
                      {main_text}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {secondary_text}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Main Autocomplete Component
function PlacesAutocomplete({ update }: { update?: string }) {
  const isLoaded = useGoogleMapsLoaded();
  const { setValue } = useFormContext();

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm p-3 bg-muted/30 rounded-[var(--radius)] border border-border">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
        <span>Loading Maps...</span>
      </div>
    );
  }

  return <AutocompleteInput setAddress={setValue} specificUpdate={update} />;
}

export default PlacesAutocomplete;
