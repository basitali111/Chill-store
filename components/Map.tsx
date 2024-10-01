import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, Libraries } from '@react-google-maps/api';

const libraries: Libraries = ['places'];

interface MapProps {
  onLocationSelected: (address: string) => void;
  addressInput: string;
  isTyping: boolean;
}

const Map: React.FC<MapProps> = ({ onLocationSelected, addressInput, isTyping }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [infoWindow, setInfoWindow] = useState<{ content: string; position: google.maps.LatLng } | null>(null);
  const [lastInputValue, setLastInputValue] = useState<string>('');
  const [userAdjusted, setUserAdjusted] = useState<boolean>(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLatLng = event.latLng;
      setMarkerPosition({ lat: newLatLng.lat(), lng: newLatLng.lng() });
      geocodeLatLng(newLatLng);
      setUserAdjusted(true);
    }
  };

  const geocodeLatLng = (latLng: google.maps.LatLng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address;
        if (lastInputValue !== address) {
          onLocationSelected(address);
          setLastInputValue(address);
        }
        setInfoWindow({ content: address, position: latLng });
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  };

  const geocodeAddress = useCallback(
    (address: string) => {
      if (!isLoaded || address === lastInputValue || isTyping) return;
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const { location } = results[0].geometry;
          setMarkerPosition({ lat: location.lat(), lng: location.lng() });
          if (map && !userAdjusted) {
            map.setCenter(location);
            map.setZoom(13);
          }
          setLastInputValue(address);
        } else {
          console.error('Geocoding address failed:', status);
        }
      });
    },
    [isLoaded, map, lastInputValue, isTyping, userAdjusted]
  );

  useEffect(() => {
    if (isLoaded && markerPosition) {
      const latLng = new google.maps.LatLng(markerPosition.lat, markerPosition.lng);
      geocodeLatLng(latLng);
    }
  }, [markerPosition, isLoaded]);

  useEffect(() => {
    if (!isTyping) {
      geocodeAddress(addressInput);
    }
  }, [addressInput, geocodeAddress, isTyping]);

  useEffect(() => {
    if (isLoaded && !markerPosition) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMarkerPosition({ lat: latitude, lng: longitude });
            map?.setCenter({ lat: latitude, lng: longitude });
            map?.setZoom(15);
          },
          (error) => {
            console.error('Error getting user location:', error);
            setMarkerPosition({ lat: 9.0820, lng: 8.6753 }); // Fallback location
            map?.setCenter({ lat: 9.0820, lng: 8.6753 });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
        setMarkerPosition({ lat: 9.0820, lng: 8.6753 }); // Fallback location
        map?.setCenter({ lat: 9.0820, lng: 8.6753 });
      }
    }
  }, [isLoaded, markerPosition, map]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      zoom={13}
      center={markerPosition || { lat: 9.0820, lng: 8.6753 }}
      onLoad={handleMapLoad}
    >
      {markerPosition && (
        <>
          <Marker
            position={markerPosition}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
          {infoWindow && (
            <InfoWindow
              position={infoWindow.position}
              onCloseClick={() => setInfoWindow(null)}
            >
              <div>{infoWindow.content}</div>
            </InfoWindow>
          )}
        </>
      )}
    </GoogleMap>
  );
};

export default React.memo(Map);
