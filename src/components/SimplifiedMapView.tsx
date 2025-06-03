/**
 * Simplified map component that displays a stylized map background
 * without requiring external mapping SDKs or real geolocation
 */

import React, { useEffect, useState } from 'react';
import { Warehouse, UserLocation } from '../types/warehouse';

interface SimplifiedMapViewProps {
  userLocation: UserLocation | null;  // Fixed user location
  warehouses: Warehouse[];           // Array of warehouses to display
  onMapLoad?: () => void;           // Optional callback when map finishes loading
}

const SimplifiedMapView: React.FC<SimplifiedMapViewProps> = ({ 
  userLocation, 
  warehouses, 
  onMapLoad 
}) => {
  // State to track map loading
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  // State for zoom level (for map controls)
  const [zoomLevel, setZoomLevel] = useState(2); // 1 = zoomed out, 3 = zoomed in

  /**
   * Simulate map loading and trigger callback
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
      onMapLoad?.();
    }, 800); // Simulate loading time

    return () => clearTimeout(timer);
  }, [onMapLoad]);

  /**
   * Get warehouse marker color based on status
   */
  const getMarkerColor = (status: string) => {
    const colors = {
      'upcoming': 'bg-urgent-citrus',      // Orange for upcoming projects
      'in-construction': 'bg-urgent-blue', // Blue for in-construction
      'operating': 'bg-black',             // Black for operating
      'dormant': 'bg-inactive'             // Gray for dormant
    };
    return colors[status as keyof typeof colors] || colors.operating;
  };

  /**
   * Calculate marker position based on warehouse coordinates relative to user
   * This creates a simplified positioning system for the stylized map
   */
  const getMarkerPosition = (warehouse: Warehouse) => {
    if (!userLocation) return { left: '50%', top: '50%' };
    
    // Simple calculation to position markers relative to user location
    // This is a simplified version that works for the MVP scope
    const latDiff = warehouse.latitude - userLocation.latitude;
    const lonDiff = warehouse.longitude - userLocation.longitude;
    
    // Convert to percentage positions on the map (centered around user)
    const leftPercent = 50 + (lonDiff * 1000); // Scale factor for positioning
    const topPercent = 50 - (latDiff * 1000);  // Negative because screen coords are inverted
    
    return {
      left: `${Math.max(10, Math.min(90, leftPercent))}%`,
      top: `${Math.max(10, Math.min(90, topPercent))}%`
    };
  };

  /**
   * Handle zoom controls
   */
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(3, prev + 1));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(1, prev - 1));
  };

  const handleResetView = () => {
    setZoomLevel(2);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Stylized map background */}
      <div 
        className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 relative transition-all duration-300 ${
          zoomLevel === 1 ? 'scale-75' : zoomLevel === 3 ? 'scale-125' : 'scale-100'
        }`}
        style={{
          transformOrigin: 'center center'
        }}
      >
        {/* County boundaries visual (simplified representation) */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-gray-400 rounded-lg"></div>
          <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 border-2 border-gray-400 rounded-lg"></div>
        </div>

        {/* User location marker (fixed position) */}
        {userLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: '50%', top: '50%' }}
          >
            <div className="w-4 h-4 bg-urgent-blue rounded-full border-2 border-white shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
              You are here
            </div>
          </div>
        )}

        {/* Warehouse markers */}
        {warehouses.map((warehouse, index) => {
          const position = getMarkerPosition(warehouse);
          return (
            <div
              key={warehouse.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
              style={position}
            >
              {/* Warehouse marker */}
              <div className={`w-3 h-3 ${getMarkerColor(warehouse.status)} rounded-sm border border-white shadow-md group-hover:scale-125 transition-transform`}></div>
              
              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                <div className="font-medium">{warehouse.name}</div>
                <div className="text-gray-300">{warehouse.status}</div>
                {warehouse.distanceFromUser && (
                  <div className="text-gray-300">{warehouse.distanceFromUser.toFixed(1)} mi</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Map legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="text-label-sm font-medium mb-2">Warehouse Status</h3>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-urgent-citrus rounded-sm"></div>
              <span className="text-body-sm">Upcoming</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-urgent-blue rounded-sm"></div>
              <span className="text-body-sm">In Construction</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-black rounded-sm"></div>
              <span className="text-body-sm">Operating</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-inactive rounded-sm"></div>
              <span className="text-body-sm">Dormant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls positioned below search bar */}
      <div className="absolute top-20 right-4 z-30 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          disabled={zoomLevel >= 3}
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          disabled={zoomLevel <= 1}
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <button
          onClick={handleResetView}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Loading overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-urgent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-body-md text-inactive">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplifiedMapView;