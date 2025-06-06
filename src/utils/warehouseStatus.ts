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
      label: 'Upcoming'
    },
    'in-construction': {
      icon: HardHat,
      textColor: 'text-urgent-blue',
      backgroundColor: 'bg-soft-blue',
      borderColor: 'border-urgent-blue',
      label: 'In Construction'
    },
    'operating': {
      icon: Settings,
      textColor: 'text-black',
      backgroundColor: 'bg-border',
      borderColor: 'border-border',
      label: 'Operating'
    },
    'dormant': {
      icon: Pause,
      textColor: 'text-urgent-purple',
      backgroundColor: 'bg-soft-purple',
      borderColor: 'border-urgent-purple',
      label: 'Dormant'
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