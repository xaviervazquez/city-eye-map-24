
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
        // Center on user location if available, otherwise use default coordinates
        center: userLocation ? [userLocation.longitude, userLocation.latitude] : [-117.3289, 33.8303],
        zoom: 13,                    // Zoom level (higher = more zoomed in)
        ui: {
          components: ['zoom']       // Only show zoom controls, hide other UI elements
        }
      });

      mapRef.current = view;

      // Set up callback when map finishes loading
      view.when(() => {
        setIsMapLoaded(true);
        onMapLoad?.();            // Call parent callback if provided
        console.log('Map loaded successfully');
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

  return (
    <div className="relative w-full h-screen">
      {/* Map container element */}
      <div ref={mapDiv} className="w-full h-full" />
      
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
