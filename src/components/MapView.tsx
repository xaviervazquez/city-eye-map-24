
import React, { useEffect, useRef, useState } from 'react';
import { Warehouse, UserLocation } from '../types/warehouse';

interface MapViewProps {
  userLocation: UserLocation | null;
  warehouses: Warehouse[];
  onMapLoad?: () => void;
}

const MapView: React.FC<MapViewProps> = ({ userLocation, warehouses, onMapLoad }) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapDiv.current) return;

    // Load ArcGIS modules
    (window as any).require([
      'esri/Map',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/geometry/Point',
      'esri/symbols/SimpleMarkerSymbol',
      'esri/symbols/PictureMarkerSymbol',
      'esri/PopupTemplate'
    ], (Map: any, MapView: any, Graphic: any, Point: any, SimpleMarkerSymbol: any, PictureMarkerSymbol: any, PopupTemplate: any) => {
      
      const map = new Map({
        basemap: 'streets-navigation-vector'
      });

      const view = new MapView({
        container: mapDiv.current,
        map: map,
        center: userLocation ? [userLocation.longitude, userLocation.latitude] : [-117.3289, 33.8303],
        zoom: 13,
        ui: {
          components: ['zoom']
        }
      });

      mapRef.current = view;

      view.when(() => {
        setIsMapLoaded(true);
        onMapLoad?.();
        console.log('Map loaded successfully');
      });

      // Add user location marker when available
      if (userLocation) {
        const userPoint = new Point({
          longitude: userLocation.longitude,
          latitude: userLocation.latitude
        });

        const userSymbol = new SimpleMarkerSymbol({
          color: [33, 82, 234, 1], // urgent-blue
          size: 12,
          outline: {
            color: [255, 255, 255, 1],
            width: 3
          }
        });

        const userGraphic = new Graphic({
          geometry: userPoint,
          symbol: userSymbol
        });

        view.graphics.add(userGraphic);
      }

      // Add warehouse markers
      warehouses.forEach((warehouse) => {
        const point = new Point({
          longitude: warehouse.longitude,
          latitude: warehouse.latitude
        });

        const getWarehouseSymbol = (status: string) => {
          const colors = {
            'upcoming': [234, 88, 51, 1], // urgent-citrus
            'in-construction': [33, 82, 234, 1], // urgent-blue
            'operating': [18, 18, 18, 1], // black
            'dormant': [125, 123, 123, 1] // inactive
          };
          
          return new SimpleMarkerSymbol({
            color: colors[status as keyof typeof colors] || colors.operating,
            size: 10,
            outline: {
              color: [255, 255, 255, 1],
              width: 2
            },
            style: 'square'
          });
        };

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

        const warehouseGraphic = new Graphic({
          geometry: point,
          symbol: getWarehouseSymbol(warehouse.status),
          attributes: warehouse,
          popupTemplate: popupTemplate
        });

        view.graphics.add(warehouseGraphic);
      });
    });

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
      }
    };
  }, [userLocation, warehouses, onMapLoad]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapDiv} className="w-full h-full" />
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-urgent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-body-md text-inactive">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
