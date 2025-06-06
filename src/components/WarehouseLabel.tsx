import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Warehouse } from '../types/warehouse';
import { getWarehouseStatusConfig } from '../utils/warehouseStatus';

interface WarehouseLabelProps {
  warehouse: Warehouse;
  isZoomedIn: boolean;
  style: React.CSSProperties;
}

const WarehouseLabel: React.FC<WarehouseLabelProps> = ({ warehouse, isZoomedIn, style }) => {
  const statusConfig = getWarehouseStatusConfig(warehouse.status);
  const StatusIcon = statusConfig.icon;

  if (!isZoomedIn) {
    // Simple icon view for zoomed out
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={style}
      >
        <div className={`w-6 h-6 ${statusConfig.backgroundColor} ${statusConfig.borderColor} border rounded-md shadow-md flex items-center justify-center`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.textColor}`} />
        </div>
      </div>
    );
  }

  // Full card view for zoomed in - clear background with shadows
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
      style={style}
    >
      <div className="flex flex-col items-center space-y-1">
        {/* Project name with shadow for readability */}
        <div 
          className="font-bold text-sm text-black px-2 py-1 rounded"
          style={{
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
          }}
        >
          {warehouse.name}
        </div>
        
        {/* Status badge and chevron button on same line */}
        <div className="flex items-center space-x-2">
          {/* Status badge with shadow */}
          <div 
            className={`flex items-center space-x-1 px-2 py-1 rounded-md ${statusConfig.backgroundColor} ${statusConfig.borderColor} border`}
            style={{
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            <StatusIcon className={`w-3 h-3 ${statusConfig.textColor}`} />
            <span className={`text-xs font-medium ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
          
          {/* Circular chevron button with shadow */}
          <div 
            className={`w-6 h-6 ${statusConfig.backgroundColor} ${statusConfig.borderColor} border rounded-full flex items-center justify-center cursor-pointer pointer-events-auto`}
            style={{
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            <ChevronRight className={`w-3 h-3 ${statusConfig.textColor}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseLabel;