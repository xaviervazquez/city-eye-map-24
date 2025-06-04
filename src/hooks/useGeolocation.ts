/**
 * Custom React hook for handling user geolocation with fallback
 * Attempts to get user's real location, falls back to demo location if denied/unavailable
 */
import { useState, useEffect } from 'react';
import { UserLocation } from '../types/warehouse';
import { defaultUserLocation } from '../data/warehouses';
/**
 * State interface for geolocation hook
 */
interface GeolocationState {
  location: UserLocation | null;  // Current user location or null if loading
  loading: boolean;               // Whether we're still trying to get location
  error: string | null;           // Error message if geolocation failed
  permissionDenied: boolean;      // Whether user explicitly denied location permission
}

/**
 * Hook that manages user location with browser geolocation API
 * Falls back to demo location if real location is unavailable
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
    permissionDenied: false,
  });

  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setState({
        location: defaultUserLocation,  // Use demo location as fallback
        loading: false,
        error: 'Geolocation not supported',
        permissionDenied: false,
      });
      return;
    }
    // Watch user's position (updates if they move)
    const watchId = navigator.geolocation.watchPosition(
      // Success callback - user granted permission and we got their location
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
      // Error callback - permission denied, timeout, or other error
      (error) => {
        console.log('Geolocation error:', error);
        // For demo purposes, always fall back to the test location
        setState({
          location: defaultUserLocation,
          loading: false,
          error: error.message,
          permissionDenied: error.code === error.PERMISSION_DENIED,
        });
      },
      // Geolocation options
      {
        enableHighAccuracy: true,  // Request GPS if available
        timeout: 10000,           // 10 second timeout
        maximumAge: 60000,        // Cache location for 1 minute
      }
    );

    // Cleanup function to stop watching location when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
