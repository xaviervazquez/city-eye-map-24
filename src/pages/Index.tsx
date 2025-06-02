
/**
 * Main page component that orchestrates the entire app experience
 * Handles user location, warehouse data, map display, and proximity alerts
 */

import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import SearchBar from '../components/SearchBar';
import ProximityAlert from '../components/ProximityAlert';
import { useGeolocation } from '../hooks/useGeolocation';
import { warehouseData } from '../data/warehouses';
import { getWarehousesWithinRadius } from '../utils/distance';
import { Warehouse } from '../types/warehouse';

const Index = () => {
  // Get user's location using our custom hook
  const { location: userLocation, loading: locationLoading, error: locationError } = useGeolocation();
  
  // State for warehouses with calculated distances (for map display)
  const [warehousesWithDistance, setWarehousesWithDistance] = useState<Warehouse[]>([]);
  
  // State for warehouses within 2-mile proximity (for alert)
  const [nearbyWarehouses, setNearbyWarehouses] = useState<Warehouse[]>([]);
  
  // State to control when proximity alert modal is shown
  const [showProximityAlert, setShowProximityAlert] = useState(false);
  
  // State to track when map has finished loading
  const [mapLoaded, setMapLoaded] = useState(false);

  /**
   * Effect: Calculate warehouse distances when user location changes
   * Runs whenever userLocation updates (including initial load)
   */
  useEffect(() => {
    if (userLocation) {
      // Get all warehouses within 10 miles for map display
      const warehousesWithDist = getWarehousesWithinRadius(
        userLocation.latitude,
        userLocation.longitude,
        warehouseData,
        10 // Get all warehouses within 10 miles for map display
      );
      
      // Get only warehouses within 2 miles for the proximity alert
      const nearby = getWarehousesWithinRadius(
        userLocation.latitude,
        userLocation.longitude,
        warehouseData,
        2 // Only warehouses within 2 miles for the alert
      );

      setWarehousesWithDistance(warehousesWithDist);
      setNearbyWarehouses(nearby);
      
      // Debug logging to track what warehouses are found
      console.log(`Found ${nearby.length} warehouses within 2 miles`);
      console.log('Nearby warehouses:', nearby);
    }
  }, [userLocation]);

  /**
   * Effect: Show proximity alert after map loads and we have nearby warehouses
   * This implements the PRD requirement for auto-showing the proximity modal
   */
  useEffect(() => {
    // Only show alert if:
    // 1. Map has finished loading
    // 2. We found warehouses within 2 miles
    // 3. Alert hasn't been shown yet
    if (mapLoaded && nearbyWarehouses.length > 0 && !showProximityAlert) {
      setTimeout(() => {
        setShowProximityAlert(true);
      }, 1000); // Show alert 1 second after map loads for better UX
    }
  }, [mapLoaded, nearbyWarehouses.length, showProximityAlert]);

  /**
   * Handle search functionality (placeholder for future implementation)
   */
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // TODO: Implement search functionality to filter warehouses
  };

  /**
   * Handle closing the proximity alert modal
   */
  const handleCloseAlert = () => {
    setShowProximityAlert(false);
  };

  /**
   * Callback when map finishes loading
   */
  const handleMapLoad = () => {
    setMapLoaded(true);
    console.log('Map loaded callback triggered');
  };

  // Show loading screen while getting user location
  if (locationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-urgent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-body-md text-inactive">Getting your location...</p>
        </div>
      </div>
    );
  }

  // Main app render
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Search bar positioned over the map */}
      <SearchBar onSearch={handleSearch} />
      
      {/* Main map view with user location and warehouse markers */}
      <MapView
        userLocation={userLocation}
        warehouses={warehousesWithDistance}
        onMapLoad={handleMapLoad}
      />

      {/* Proximity alert modal (shows when warehouses found nearby) */}
      <ProximityAlert
        nearbyWarehouses={nearbyWarehouses}
        closestWarehouse={nearbyWarehouses[0] || null}  // First item is closest due to sorting
        onClose={handleCloseAlert}
        isVisible={showProximityAlert}
      />

      {/* Error notification if geolocation failed (but using demo location) */}
      {locationError && (
        <div className="absolute bottom-4 left-4 right-4 bg-soft-citrus border border-urgent-citrus rounded-2xl p-4 z-10">
          <p className="text-body-sm text-urgent-citrus">
            Using demo location. {locationError}
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
