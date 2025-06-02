
import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import SearchBar from '../components/SearchBar';
import ProximityAlert from '../components/ProximityAlert';
import { useGeolocation } from '../hooks/useGeolocation';
import { warehouseData } from '../data/warehouses';
import { getWarehousesWithinRadius } from '../utils/distance';
import { Warehouse } from '../types/warehouse';

const Index = () => {
  const { location: userLocation, loading: locationLoading, error: locationError } = useGeolocation();
  const [warehousesWithDistance, setWarehousesWithDistance] = useState<Warehouse[]>([]);
  const [nearbyWarehouses, setNearbyWarehouses] = useState<Warehouse[]>([]);
  const [showProximityAlert, setShowProximityAlert] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (userLocation) {
      const warehousesWithDist = getWarehousesWithinRadius(
        userLocation.latitude,
        userLocation.longitude,
        warehouseData,
        10 // Get all warehouses within 10 miles for map display
      );
      
      const nearby = getWarehousesWithinRadius(
        userLocation.latitude,
        userLocation.longitude,
        warehouseData,
        2 // Only warehouses within 2 miles for the alert
      );

      setWarehousesWithDistance(warehousesWithDist);
      setNearbyWarehouses(nearby);
      
      console.log(`Found ${nearby.length} warehouses within 2 miles`);
      console.log('Nearby warehouses:', nearby);
    }
  }, [userLocation]);

  useEffect(() => {
    // Show proximity alert after map loads and we have nearby warehouses
    if (mapLoaded && nearbyWarehouses.length > 0 && !showProximityAlert) {
      setTimeout(() => {
        setShowProximityAlert(true);
      }, 1000); // Show alert 1 second after map loads
    }
  }, [mapLoaded, nearbyWarehouses.length, showProximityAlert]);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // TODO: Implement search functionality
  };

  const handleCloseAlert = () => {
    setShowProximityAlert(false);
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
    console.log('Map loaded callback triggered');
  };

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

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <SearchBar onSearch={handleSearch} />
      
      <MapView
        userLocation={userLocation}
        warehouses={warehousesWithDistance}
        onMapLoad={handleMapLoad}
      />

      <ProximityAlert
        nearbyWarehouses={nearbyWarehouses}
        closestWarehouse={nearbyWarehouses[0] || null}
        onClose={handleCloseAlert}
        isVisible={showProximityAlert}
      />

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
