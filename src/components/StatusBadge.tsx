/**
 * Unified status badge component used across warehouse cards and map labels
 * Provides consistent styling with rounded corners and shadow
 */

import React from 'react';
import { getWarehouseStatusConfig } from '../utils/warehouseStatus';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showShadow?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', showShadow = false }) => {
  const statusConfig = getWarehouseStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div 
      className={`flex items-center space-x-1 px-2 py-1 rounded-md ${statusConfig.backgroundColor} ${statusConfig.borderColor} border w-fit ${className}`}
      style={showShadow ? {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
      } : undefined}
    >
      <StatusIcon className={`w-3 h-3 ${statusConfig.textColor}`} />
      <span className={`text-xs font-medium ${statusConfig.textColor}`}>
        {statusConfig.label}
      </span>
    </div>
  );
};

export default StatusBadge;