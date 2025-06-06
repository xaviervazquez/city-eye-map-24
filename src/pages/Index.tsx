/**
 * Main page component that orchestrates the entire app experience
 * Uses fixed user location and displays warehouse data with proximity alerts
 */

import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import SearchBar from '../components/SearchBar';
import ProximityAlert from '../components/ProximityAlert';
import WarehouseDrawer from '../components/WarehouseDrawer';
import { warehouseData, defaultUserLocation } from '../data/warehouses';
import { getWarehousesWithinRadius } from '../utils/distance';
import { Warehouse } from '../types/warehouse';

const Index = () => {
  // Use fixed user location (no geolocation for MVP)
  const userLocation = defaultUserLocation;

  const [hasSeenProximityAlert, setHasSeenProximityAlert] = useState(false); //added to make sure alert only opens once

  // State for warehouses with calculated distances (for map display)
  const [warehousesWithDistance, setWarehousesWithDistance] = useState<Warehouse[]>([]);

  // State for warehouses within 2-mile proximity (for alert)
  const [nearbyWarehouses, setNearbyWarehouses] = useState<Warehouse[]>([]);

  // State to control when proximity alert drawer is shown
  const [showProximityAlert, setShowProximityAlert] = useState(false);

  // State to control warehouse drawer visibility
  const [showWarehouseDrawer, setShowWarehouseDrawer] = useState(false);

  // State to track when map has finished loading
  const [mapLoaded, setMapLoaded] = useState(false);

  /**
   * Effect: Calculate warehouse distances on component mount
   * Uses fixed user location from defaultUserLocation
   */
  useEffect(() => {
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
  }, []); // Run once on mount

  /**
   * Effect: Show proximity alert after map loads and we have nearby warehouses
   * This implements the PRD requirement for auto-showing the proximity drawer
   */
  useEffect(() => {
    // Only show alert if:
    // 1. Map has finished loading
    // 2. We found warehouses within 2 miles
    // 3. Alert hasn't been shown yet
    if (mapLoaded && nearbyWarehouses.length > 0 && !hasSeenProximityAlert) {
      setTimeout(() => {
        setShowProximityAlert(true);
      }, 1000); // Show alert 1 second after map loads for better UX
    }
  }, [mapLoaded, nearbyWarehouses.length, showProximityAlert]);

  /**
   * Effect: Show warehouse drawer after map loads
   */
  useEffect(() => {
    if (mapLoaded && warehousesWithDistance.length > 0) {
      setTimeout(() => {
        setShowWarehouseDrawer(true);
      }, 2000); // Show drawer 2 seconds after map loads
    }
  }, [mapLoaded, warehousesWithDistance.length]);

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
    setHasSeenProximityAlert(true); // Prevents reopening
  };
  /**
   * Callback when map finishes loading
   */
  const handleMapLoad = () => {
    setMapLoaded(true);
    console.log('Map loaded callback triggered');
  };
  // Main app render with fixed user location
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Search bar positioned over the map */}
      <SearchBar onSearch={handleSearch} />

      {/* ArcGIS map view with fixed user location and warehouse markers */}
      <MapView
        userLocation={userLocation}
        warehouses={warehousesWithDistance}
        onMapLoad={handleMapLoad}
      />
      {/* Proximity alert drawer (shows when warehouses found nearby) */}
      <ProximityAlert
        nearbyWarehouses={nearbyWarehouses}
        closestWarehouse={nearbyWarehouses[0] || null}  // First item is closest due to sorting
        onClose={handleCloseAlert}
        isVisible={showProximityAlert}
      />

      {/* Warehouse drawer */}
      <WarehouseDrawer
        warehouses={warehousesWithDistance}
        isOpen={showWarehouseDrawer}
        onClose={() => setShowWarehouseDrawer(false)}
      />
    </div>
  );
};

export default Index;
