
import { useState, useEffect } from 'react';
import { UserLocation } from '../types/warehouse';
import { defaultUserLocation } from '../data/warehouses';

interface GeolocationState {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
    permissionDenied: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: defaultUserLocation,
        loading: false,
        error: 'Geolocation not supported',
        permissionDenied: false,
      });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
          permissionDenied: false,
        });
      },
      (error) => {
        console.log('Geolocation error:', error);
        // Use default location for demo purposes
        setState({
          location: defaultUserLocation,
          loading: false,
          error: error.message,
          permissionDenied: error.code === error.PERMISSION_DENIED,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
