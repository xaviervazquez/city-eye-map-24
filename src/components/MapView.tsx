
/**
 * Interactive map component using ArcGIS API for JavaScript
 * Displays user location and warehouse markers with different styling based on status
 */

import React, { useEffect, useRef, useState } from 'react';
import { Warehouse, UserLocation } from '../types/warehouse';

interface MapViewProps {
  userLocation: UserLocation | null;  // User's current location
  warehouses: Warehouse[];           // Array of warehouses to display
  onMapLoad?: () => void;           // Optional callback when map finishes loading
}

const MapView: React.FC<MapViewProps> = ({ userLocation, warehouses, onMapLoad }) => {
  const mapDiv = useRef<HTMLDivElement>(null);    // Reference to the map container DOM element
  const mapRef = useRef<any>(null);               // Reference to the ArcGIS Map instance
  const [isMapLoaded, setIsMapLoaded] = useState(false);  // Track loading state
  const [zoomLevel, setZoomLevel] = useState(12); // Track current zoom level

  useEffect(() => {
    if (!mapDiv.current) return;

    // Load required ArcGIS modules dynamically
    (window as any).require([
      'esri/Map',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/geometry/Point',
      'esri/symbols/SimpleMarkerSymbol',
      'esri/symbols/PictureMarkerSymbol',
      'esri/PopupTemplate'
    ], (Map: any, MapView: any, Graphic: any, Point: any, SimpleMarkerSymbol: any, PictureMarkerSymbol: any, PopupTemplate: any) => {
      
      // Create the map with street navigation basemap
      const map = new Map({
        basemap: 'streets-navigation-vector'
      });

      // Create the map view and attach it to the DOM element
      const view = new MapView({
        container: mapDiv.current,
        map: map,
        // Center on fixed user location (no geolocation)
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 12,                    // Zoom level focused on local area
        // Constrain map to San Bernardino and Riverside County area
        constraints: {
          geometry: {
            type: "extent",
            xmin: -118.5, ymin: 33.3,  // Southwest corner
            xmax: -116.0, ymax: 34.7   // Northeast corner (covers SB and Riverside counties)
          }
        },
        ui: {
          components: []             // Hide all default UI components (we'll add custom ones)
        }
      });

      mapRef.current = view;

      // Set up callback when map finishes loading
      view.when(() => {
        setIsMapLoaded(true);
        onMapLoad?.();            // Call parent callback if provided
        console.log('Map loaded successfully');
      });

      // Track zoom level changes
      view.watch('zoom', (newZoom: number) => {
        setZoomLevel(newZoom);
      });

      // Add user location marker if we have user's location
      if (userLocation) {
        // Create point geometry for user location
        const userPoint = new Point({
          longitude: userLocation.longitude,
          latitude: userLocation.latitude
        });

        // Create blue circle symbol for user location
        const userSymbol = new SimpleMarkerSymbol({
          color: [33, 82, 234, 1],   // urgent-blue color
          size: 12,
          outline: {
            color: [255, 255, 255, 1], // White outline
            width: 3
          }
        });

        // Create graphic combining geometry and symbol
        const userGraphic = new Graphic({
          geometry: userPoint,
          symbol: userSymbol
        });

        // Add user marker to the map
        view.graphics.add(userGraphic);
      }

      // Add warehouse markers for each warehouse in the array
      warehouses.forEach((warehouse) => {
        // Create point geometry for warehouse location
        const point = new Point({
          longitude: warehouse.longitude,
          latitude: warehouse.latitude
        });

        /**
         * Get symbol color based on warehouse status
         * Each status has a different color to make them visually distinct
         */
        const getWarehouseSymbol = (status: string) => {
          const colors = {
            'upcoming': [234, 88, 51, 1],      // urgent-citrus (orange/red)
            'in-construction': [33, 82, 234, 1], // urgent-blue
            'operating': [18, 18, 18, 1],       // black
            'dormant': [125, 123, 123, 1]       // inactive (gray)
          };
          
          return new SimpleMarkerSymbol({
            color: colors[status as keyof typeof colors] || colors.operating,
            size: 10,
            outline: {
              color: [255, 255, 255, 1],  // White outline for visibility
              width: 2
            },
            style: 'square'              // Square markers to distinguish from user location
          });
        };

        // Create popup template that shows when user clicks on warehouse marker
        const popupTemplate = new PopupTemplate({
          title: warehouse.name,
          content: `
            <div style="padding: 8px;">
              <p><strong>Status:</strong> ${warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1).replace('-', ' ')}</p>
              <p><strong>Address:</strong> ${warehouse.address}</p>
              <p><strong>Impact:</strong> ${warehouse.impactStat}</p>
              ${warehouse.distanceFromUser ? `<p><strong>Distance:</strong> ${warehouse.distanceFromUser.toFixed(1)} miles</p>` : ''}
            </div>
          `
        });

        // Create warehouse graphic with geometry, symbol, and popup
        const warehouseGraphic = new Graphic({
          geometry: point,
          symbol: getWarehouseSymbol(warehouse.status),
          attributes: warehouse,        // Store warehouse data for popup
          popupTemplate: popupTemplate
        });

        // Add warehouse marker to the map
        view.graphics.add(warehouseGraphic);
      });
    });

    // Cleanup function - destroy map when component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
      }
    };
  }, [userLocation, warehouses, onMapLoad]);

  /**
   * Handle zoom controls
   */
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.goTo({
        zoom: mapRef.current.zoom + 1
      });
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.goTo({
        zoom: mapRef.current.zoom - 1
      });
    }
  };

  const handleResetView = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.goTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 12
      });
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Map container element */}
      <div ref={mapDiv} className="w-full h-full" />
      
      {/* Map Controls positioned below search bar */}
      <div className="absolute top-20 right-4 z-30 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          disabled={zoomLevel >= 18}
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          disabled={zoomLevel <= 8}
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
      
      {/* Loading overlay shown while map is initializing */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            {/* Spinning loader */}
            <div className="w-8 h-8 border-4 border-urgent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-body-md text-inactive">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
