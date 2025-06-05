import React from 'react';
import { HardHat, ChevronRight, AlertTriangle, Settings, Pause } from 'lucide-react';
import { Warehouse } from '../types/warehouse';

interface WarehouseLabelProps {
  warehouse: Warehouse;
  isZoomedIn: boolean;
  style: React.CSSProperties;
}

const WarehouseLabel: React.FC<WarehouseLabelProps> = ({ warehouse, isZoomedIn, style }) => {
  /**
   * Get status-specific styling and icon
   */
  const getStatusConfig = (status: string) => {
    const configs = {
      'upcoming': {
        bgColor: 'bg-soft-citrus',
        borderColor: 'border-urgent-citrus',
        textColor: 'text-urgent-citrus',
        icon: AlertTriangle,
        label: 'Upcoming'
      },
      'in-construction': {
        bgColor: 'bg-soft-blue',
        borderColor: 'border-urgent-blue', 
        textColor: 'text-urgent-blue',
        icon: HardHat,
        label: 'In Construction'
      },
      'operating': {
        bgColor: 'bg-gray-200',
        borderColor: 'border-gray-400',
        textColor: 'text-gray-700',
        icon: Settings,
        label: 'Operating'
      },
      'dormant': {
        bgColor: 'bg-soft-purple',
        borderColor: 'border-urgent-purple',
        textColor: 'text-urgent-purple',
        icon: Pause,
        label: 'Dormant'
      }
    };
    
    return configs[status as keyof typeof configs] || configs.operating;
  };

  const statusConfig = getStatusConfig(warehouse.status);
  const StatusIcon = statusConfig.icon;

  if (!isZoomedIn) {
    // Simple icon view for zoomed out
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={style}
      >
        <div className={`w-6 h-6 ${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-md shadow-md flex items-center justify-center`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.textColor}`} />
        </div>
      </div>
    );
  }

  // Full card view for zoomed in
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
      style={style}
    >
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 min-w-48">
        {/* Project name with text shadow for readability */}
        <div 
          className="font-bold text-sm text-gray-900 mb-2"
          style={{
            textShadow: '1px 1px 2px rgba(234, 88, 51, 0.3)'
          }}
        >
          {warehouse.name}
        </div>
        
        {/* Status badge and chevron container */}
        <div className="flex items-center justify-between">
          {/* Status badge */}
          <div className={`flex items-center space-x-2 px-2 py-1 rounded-md ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
            <StatusIcon className={`w-3 h-3 ${statusConfig.textColor}`} />
            <span className={`text-xs font-medium ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
          
          {/* Circular chevron button */}
          <div className={`w-6 h-6 ${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}>
            <ChevronRight className={`w-3 h-3 ${statusConfig.textColor}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseLabel;