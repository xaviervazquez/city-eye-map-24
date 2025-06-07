
/**
 * Modal component that appears when warehouses are found near the user
 * Shows the number of nearby warehouses and details about the closest one
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Warehouse } from '../types/warehouse';
import WarehouseCard from './WarehouseCard';

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
  const navigate = useNavigate();
  
  // Don't render anything if modal should be hidden or no closest warehouse
  if (!isVisible || !closestWarehouse) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Full-screen overlay with dark background - drawer style
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50" onClick={handleBackdropClick}>
      {/* Drawer that slides up from bottom */}
      <div 
        className="bg-white rounded-t-2xl w-full mx-0 mb-0 transform transition-transform duration-300 ease-out"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          maxHeight: '70vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header section with close button */}
          <div className="flex justify-between items-start mb-4">
            <div>
              {/* Main alert message showing count of nearby warehouses */}
              <h2 className="text-h2 font-medium mb-2">
                There are <span className="text-urgent-citrus">4 warehouses</span> within 2 miles from you.
              </h2>
              <p className="text-body-md text-inactive">The closest proposal to you is:</p>
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="text-inactive hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Warehouse details card */}
          <div className="mb-6">
            <WarehouseCard warehouse={closestWarehouse} />
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