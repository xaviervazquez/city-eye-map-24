/**
 * Shared utility functions for warehouse status styling and icons
 * Ensures consistent appearance across all components
 */

import { AlertTriangle, HardHat, Settings, Pause } from 'lucide-react';

export interface WarehouseStatusConfig {
  icon: typeof AlertTriangle;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  label: string;
}

/**
 * Get standardized status configuration for warehouse status
 */
export const getWarehouseStatusConfig = (status: string): WarehouseStatusConfig => {
  const configs: Record<string, WarehouseStatusConfig> = {
    'upcoming': {
      icon: AlertTriangle,
      textColor: 'text-urgent-citrus',
      backgroundColor: 'bg-soft-citrus',
      borderColor: 'border-urgent-citrus',
      label: 'In proposal'
    },
    'in-construction': {
      icon: HardHat,
      textColor: 'text-urgent-blue',
      backgroundColor: 'bg-soft-blue',
      borderColor: 'border-urgent-blue',
      label: 'In construction'
    },
    'operating': {
      icon: Settings,
      textColor: 'text-green-700',
      backgroundColor: 'bg-green-100',
      borderColor: 'border-green-600',
      label: 'Active'
    },
    'dormant': {
      icon: Pause,
      textColor: 'text-gray-600',
      backgroundColor: 'bg-gray-100',
      borderColor: 'border-gray-500',
      label: 'Not active'
    }
  };

  return configs[status] || configs.operating;
};

/**
 * Format status text for display (capitalize and handle hyphens)
 */
export const formatWarehouseStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
};