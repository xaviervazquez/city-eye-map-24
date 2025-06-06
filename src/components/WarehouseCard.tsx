/**
 * Individual warehouse card component for the drawer
 * Shows warehouse image, details, status, and distance
 */

import React from 'react';
import { Warehouse } from '../types/warehouse';
import { Badge } from './ui/badge';
import { ChevronRight } from 'lucide-react';

interface WarehouseCardProps {
  warehouse: Warehouse;
}

const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse }) => {
  // Get warehouse image based on name
  const getWarehouseImage = (name: string) => {
    if (name.includes('Sycamore Hills')) {
      return '/images/warehouses/Warehouse-XL.png';
    } else if (name.includes('West Meridian')) {
      return '/images/warehouses/Warehouse-L.png';
    } else if (name.includes('Bloomington')) {
      return '/images/warehouses/Warehouse-M.png';
    } else if (name.includes('Amazon')) {
      return '/images/warehouses/Warehouse-L.png';
    }
    return '/images/warehouses/Warehouse-M.png'; // Default fallback
  };

  // Get status badge styling based on warehouse status
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'upcoming': {
        variant: 'default' as const,
        className: 'bg-urgent-citrus/10 text-urgent-citrus border-urgent-citrus',
        icon: '⚠️',
        label: 'Upcoming'
      },
      'in-construction': {
        variant: 'default' as const,
        className: 'bg-urgent-blue/10 text-urgent-blue border-urgent-blue',
        icon: '🚧',
        label: 'In construction'
      },
      'operating': {
        variant: 'default' as const,
        className: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: '⚪',
        label: 'Operating'
      },
      'dormant': {
        variant: 'default' as const,
        className: 'bg-inactive/10 text-inactive border-inactive',
        icon: '⚫',
        label: 'Dormant'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.operating;
    
    return (
      <Badge variant={config.variant} className={`${config.className} gap-1 text-xs`}>
        <span>{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4 hover:shadow-md transition-shadow">
      {/* Warehouse Image */}
      <img 
        src={getWarehouseImage(warehouse.name)}
        alt={warehouse.name}
        className="w-16 h-12 object-cover rounded-md bg-gray-100"
        onError={(e) => {
          // Fallback to a placeholder if image fails to load
          e.currentTarget.src = '/images/warehouses/Warehouse-M.png';
        }}
      />
      
      {/* Warehouse Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">
          {warehouse.name}
        </h3>
        
        {/* Status Badge */}
        <div className="mb-2">
          {getStatusBadge(warehouse.status)}
        </div>
        
        {/* Distance and Impact */}
        <div className="space-y-1">
          <p className="text-xs text-gray-600 flex items-center">
            <span className="mr-1">📍</span>
            about {Math.round((warehouse.distanceFromUser || 0) * 5280)} feet from you
          </p>
          <p className="text-xs text-gray-600 flex items-center">
            <span className="mr-1">📊</span>
            {warehouse.impactStat}
          </p>
        </div>
      </div>
      
      {/* Right Arrow */}
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </div>
  );
};

export default WarehouseCard;