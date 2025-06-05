
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

      // Add warehouse polygons and labels for each warehouse in the array
      warehouses.forEach((warehouse) => {
        // Create point geometry for warehouse center
        const centerPoint = new Point({
          longitude: warehouse.longitude,
          latitude: warehouse.latitude
        });

        // Create polygon geometry (approximating warehouse footprint)
        const polygonCoordinates = [
          [
            [warehouse.longitude - 0.001, warehouse.latitude - 0.0008],
            [warehouse.longitude + 0.001, warehouse.latitude - 0.0008],
            [warehouse.longitude + 0.001, warehouse.latitude + 0.0008],
            [warehouse.longitude - 0.001, warehouse.latitude + 0.0008],
            [warehouse.longitude - 0.001, warehouse.latitude - 0.0008]
          ]
        ];

        // Create polygon geometry
        const polygon = {
          type: "polygon",
          rings: polygonCoordinates
        };

        /**
         * Get polygon and label styling based on warehouse status
         */
        const getWarehousePolygonSymbol = (status: string) => {
          const statusStyles = {
            'upcoming': {
              fill: [234, 88, 51, 0.1],      // soft-citrus with low opacity
              outline: [234, 88, 51, 1]      // urgent-citrus border
            },
            'in-construction': {
              fill: [33, 82, 234, 0.1],      // soft-blue with low opacity
              outline: [33, 82, 234, 1]      // urgent-blue border
            },
            'operating': {
              fill: [156, 163, 175, 0.1],    // gray-200 with low opacity
              outline: [156, 163, 175, 1]    // gray-400 border
            },
            'dormant': {
              fill: [168, 85, 247, 0.1],     // soft-purple with low opacity
              outline: [168, 85, 247, 1]     // urgent-purple border
            }
          };

          const style = statusStyles[status as keyof typeof statusStyles] || statusStyles.operating;

          return {
            type: "simple-fill",
            color: style.fill,
            outline: {
              color: style.outline,
              width: 2,
              style: "dash"
            }
          };
        };

        // Create polygon graphic
        const polygonGraphic = new Graphic({
          geometry: polygon,
          symbol: getWarehousePolygonSymbol(warehouse.status)
        });

        // Add polygon to the map
        view.graphics.add(polygonGraphic);

        // Create text symbol for warehouse label
        const createTextSymbol = (warehouse: Warehouse, zoom: number) => {
          if (zoom >= 13) {
            // Full label at high zoom
            const getStatusBadgeColor = (status: string) => {
              const colors = {
                'upcoming': '#EA5833',
                'in-construction': '#2152EA', 
                'operating': '#374151',
                'dormant': '#A855F7'
              };
              return colors[status as keyof typeof colors] || colors.operating;
            };

            const formatStatus = (status: string) => {
              return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
            };

            return {
              type: "text",
              color: "#1F2937",
              haloColor: "#FEF3E2",
              haloSize: 2,
              text: `${warehouse.name}\n[${formatStatus(warehouse.status)}]`,
              xoffset: 0,
              yoffset: 0,
              font: {
                size: 12,
                family: "Arial",
                weight: "bold"
              }
            };
          } else {
            // Simple icon at low zoom  
            const getStatusIcon = (status: string) => {
              const icons = {
                'upcoming': '⚠️',
                'in-construction': '🦺', // Hard hat emoji for in-construction
                'operating': '⚙️',
                'dormant': '⏸️'
              };
              return icons[status as keyof typeof icons] || '⚙️';
            };

            return {
              type: "text",
              color: "#FFFFFF",
              text: getStatusIcon(warehouse.status),
              xoffset: 0,
              yoffset: 0,
              font: {
                size: 16,
                family: "Arial"
              }
            };
          }
        };

        // Track current text graphic
        let currentTextGraphic: any = null;

        // Function to update label based on zoom level
        const updateLabel = () => {
          const zoom = view.zoom;
          
          // Remove existing text graphic
          if (currentTextGraphic) {
            view.graphics.remove(currentTextGraphic);
            currentTextGraphic = null;
          }

          // Create new text graphic
          const textSymbol = createTextSymbol(warehouse, zoom);
          currentTextGraphic = new Graphic({
            geometry: centerPoint,
            symbol: textSymbol
          });

          // Add text graphic to the map
          view.graphics.add(currentTextGraphic);
        };

        // Initial label setup
        view.when(() => {
          updateLabel();
          
          // Update label when zoom changes
          view.watch('zoom', () => {
            updateLabel();
          });
        });
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