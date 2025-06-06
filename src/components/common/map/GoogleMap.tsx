'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { Search, LocateFixed } from 'lucide-react';
import React from 'react';
import { Input } from 'antd';
import { InputRef } from 'antd';
const libraries: ("places")[] = ["places"];

interface MapComponentProps {
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
    city: string;
    state: string;
    zipcode: string;
  }) => void;
  defaultCenter?: {
    lat: number;
    lng: number;
  };
  initialLat?: number;
  initialLng?: number;
}

let defaultLocation = { lat: 13.049252503720867, lng:  80.23614052016578 }; 


const MapComponent = ({ onLocationSelect, defaultCenter, initialLat, initialLng }: MapComponentProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [marker, setMarker] = useState<google.maps.LatLng | null>(null);
  const searchInputRef = useRef<InputRef>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  
  const handleLoadError = (error: Error) => {
    console.error("Google Maps loading error:", error);
    setMapError(`Failed to load Google Maps: ${error.message}`);
  };

  const handleApiLoaded = () => {
    setMapError(null);
  };
  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const latLng = e.latLng;
      setMarker(latLng);
      getAddressFromLatLng(latLng);
    }
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onLoadSearchBox = useCallback((searchBox: google.maps.places.SearchBox) => {
    setSearchBox(searchBox);
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBox) {
      
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry?.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          
          defaultLocation = {
            lat: location.lat,
            lng: location.lng
          };
                    
          map?.panTo(location);
          setMarker(place.geometry.location);
          if (place.formatted_address) {
            onLocationSelect({
              address: place.formatted_address || '',
              ...location,
              city: place.address_components?.find(component => component.types.includes('locality'))?.long_name || '',
              state: place.address_components?.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '',
              zipcode: place.address_components?.find(component => component.types.includes('postal_code'))?.long_name || '',
            });
          }
        }
      }
    }
  }, [searchBox, map, onLocationSelect]);

  const getAddressFromLatLng = async (latLng: google.maps.LatLng) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ location: latLng });
      const addressDataLength = result?.results?.[0]?.address_components?.length || 0;
      const isZipcode = result.results[0].address_components[addressDataLength - 1].long_name?.length == 6;
      const zipcode = result.results[0].address_components[addressDataLength - 1].long_name;
      
      if (result.results[0]) {
        onLocationSelect({
          address: result.results?.[0]?.formatted_address || '',
          city: isZipcode ? result?.results?.[0].address_components?.[addressDataLength - 4]?.long_name : result?.results?.[0].address_components?.[addressDataLength - 3]?.long_name,
          state: isZipcode ? result?.results?.[0]?.address_components?.[addressDataLength - 3]?.long_name : result?.results?.[0]?.address_components?.[addressDataLength - 2]?.long_name,
          zipcode:  isZipcode ? zipcode : "",
          lat: latLng.lat() || 0,
          lng: latLng.lng() || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  useEffect(() => {
    if (map && initialLat && initialLng) {
      const initialPosition = new google.maps.LatLng(initialLat, initialLng);
      setMarker(initialPosition);
      map.panTo(initialPosition);
    }
  }, [initialLat, initialLng, map]);

  const apiKey = "AIzaSyCJvn8t8IkACyimpufYRkb-uTTfBksrfwg";
  if (!apiKey) {
    return (
      <div className="w-full h-[400px] rounded-xl bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-500 text-sm">Loading Google Maps</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      onError={handleLoadError}
      onLoad={handleApiLoaded}
      loadingElement={
        <div className="w-full h-[400px] rounded-xl bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 text-sm">Loading Google Maps</p>
          </div>
        </div>
      }
    >
<div className="w-full h-auto mb-4">  
        <StandaloneSearchBox
          onLoad={onLoadSearchBox}
          onPlacesChanged={onPlacesChanged}
        >
          <div className="relative">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search for area, street name"
              className="w-full bg-white shadow-sm h-[42px] pl-10 pr-4 text-sm rounded-lg border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
          </div>
        </StandaloneSearchBox>
      </div>

      <div className="relative w-full h-[400px] rounded-xl overflow-hidden">  
      {mapError ? (
          <div className="w-full h-[400px] rounded-xl bg-red-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-700 font-medium">Error Loading Maps</p>
              <p className="text-red-600 text-sm">{mapError}</p>
            </div>
          </div>
        ) :(
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={defaultLocation}
          zoom={15}
          onClick={onMapClick}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
        )
}  
      </div>

    </LoadScript>
  );
};

export default MapComponent; 