
/**
 * Modal component that appears when warehouses are found near the user
 * Shows the number of nearby warehouses and details about the closest one
 */

import React from 'react';
import { Warehouse } from '../types/warehouse';

interface ProximityAlertProps {
  nearbyWarehouses: Warehouse[];     // All warehouses within proximity radius
  closestWarehouse: Warehouse | null; // The single closest warehouse to highlight
  onClose: () => void;               // Callback to dismiss the modal
  isVisible: boolean;                // Whether modal should be shown
}

const ProximityAlert: React.FC<ProximityAlertProps> = ({
  nearbyWarehouses,
  closestWarehouse,
  onClose,
  isVisible,
}) => {
  // Don't render anything if modal should be hidden or no closest warehouse
  if (!isVisible || !closestWarehouse) return null;

  /**
   * Get appropriate background and text colors based on warehouse status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-urgent-citrus bg-soft-citrus';
      case 'in-construction':
        return 'text-urgent-blue bg-soft-blue';
      case 'operating':
        return 'text-black bg-border';
      case 'dormant':
        return 'text-inactive bg-gray-100';
      default:
        return 'text-black bg-border';
    }
  };

  /**
   * Format status text for display (capitalize and handle hyphens)
   */
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  return (
    // Full-screen overlay with dark background - drawer style
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      {/* Drawer that slides up from bottom */}
      <div className="bg-white rounded-t-2xl w-full mx-0 mb-0 transform transition-transform duration-300 ease-out"
           style={{ 
             transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
             maxHeight: '70vh'
           }}>
        <div className="p-6">
          {/* Header section with close button */}
          <div className="flex justify-between items-start mb-4">
            <div>
              {/* Main alert message showing count of nearby warehouses */}
              <h2 className="text-h2 font-medium mb-2">
                There are <span className="text-urgent-citrus">13 warehouses</span> within 2 miles from you.
              </h2>
              <p className="text-body-md text-inactive">The closest proposal to you is:</p>
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="text-inactive hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Warehouse details card */}
          <div className="border border-border rounded-2xl p-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {/* Warehouse icon */}
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-inactive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  {/* Warehouse name */}
                  <h3 className="text-body-md font-medium mb-1">{closestWarehouse.name}</h3>
                  
                  {/* Distance indicator */}
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-inactive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-body-sm text-inactive">
                      about {Math.round((closestWarehouse.distanceFromUser || 0) * 5280)} feet from you
                    </span>
                  </div>
                  
                  {/* Status badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-lg text-label-sm ${getStatusColor(closestWarehouse.status)}`}>
                      <span className="mr-1">⚠️</span>
                      {formatStatus(closestWarehouse.status)}
                    </span>
                  </div>
                  
                  {/* Impact statistic */}
                  <p className="text-body-sm text-inactive mt-2">{closestWarehouse.impactStat}</p>
                </div>
              </div>
              
              {/* Arrow button for future expansion */}
              <button className="ml-2 text-urgent-blue">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-4 rounded-2xl text-body-md font-medium hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProximityAlert;
