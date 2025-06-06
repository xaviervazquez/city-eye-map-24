/**
 * Warehouse drawer component that slides up from the bottom
 * Shows warehouse cards with filtering capabilities
 */

import React, { useState, useMemo } from 'react';
import { Warehouse } from '../types/warehouse';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle 
} from './ui/drawer';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import WarehouseCard from './WarehouseCard';

interface WarehouseDrawerProps {
  warehouses: Warehouse[];
  isOpen: boolean;
  isExpanded: boolean;
  onClose: () => void;
  onToggle: () => void;
}

type FilterOption = 'nearest' | 'impactful' | 'newest';

const WarehouseDrawer: React.FC<WarehouseDrawerProps> = ({
  warehouses,
  isOpen,
  isExpanded,
  onClose,
  onToggle
}) => {
  const [filter, setFilter] = useState<FilterOption>('nearest');

  // Sort warehouses based on selected filter
  const sortedWarehouses = useMemo(() => {
    const warehousesCopy = [...warehouses];
    
    switch (filter) {
      case 'nearest':
        return warehousesCopy.sort((a, b) => 
          (a.distanceFromUser || 0) - (b.distanceFromUser || 0)
        );
      
      case 'impactful':
        return warehousesCopy.sort((a, b) => {
          // Extract numeric value from impact stat for sorting
          const getImpactValue = (stat: string) => {
            const match = stat.match(/(\d+)%/);
            return match ? parseInt(match[1]) : 0;
          };
          return getImpactValue(b.impactStat) - getImpactValue(a.impactStat);
        });
      
      case 'newest':
        return warehousesCopy.sort((a, b) => {
          const statusPriority = {
            'upcoming': 1,
            'in-construction': 2,
            'operating': 3,
            'dormant': 4
          };
          return statusPriority[a.status] - statusPriority[b.status];
        });
      
      default:
        return warehousesCopy;
    }
  }, [warehouses, filter]);

  return (
    <>
      {/* Overlay to block map interaction when drawer is expanded */}
      {isExpanded && (
        <div className="fixed inset-0 z-30 bg-transparent" />
      )}
      
      <Drawer open={isOpen} modal={false} dismissible={false}>
        <DrawerContent className={`${isExpanded ? 'max-h-[75vh]' : 'max-h-[180px]'} transition-all duration-300 z-40 pointer-events-auto ${!isExpanded ? 'shadow-lg border-border/50' : ''}`}>
          {/* Pull handle */}
          <div className="flex justify-center pt-2 pb-2">
            <div 
              className="w-12 h-1 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors"
              onClick={onToggle}
            />
          </div>
        
        <DrawerHeader className="pb-2" onClick={!isExpanded ? onToggle : undefined}>
          <DrawerTitle className="text-left text-xl font-semibold">
            In San Bernardino
          </DrawerTitle>
          <p className="text-left text-urgent-citrus text-sm font-medium">
            {warehouses.length} warehouses found
          </p>
          
          {/* Filter Dropdown - only show when expanded */}
          {isExpanded && (
            <div className="mt-3 flex justify-start">
              <Select value={filter} onValueChange={(value: FilterOption) => setFilter(value)}>
                <SelectTrigger className="w-48 text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nearest">Nearest to you</SelectItem>
                  <SelectItem value="impactful">Most impactful</SelectItem>
                  <SelectItem value="newest">Newest project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </DrawerHeader>
        
        {/* Content */}
        {isExpanded ? (
          /* Scrollable warehouse cards when expanded */
          <div className="px-4 pb-4 space-y-3 overflow-y-auto">
            {sortedWarehouses.map((warehouse) => (
              <WarehouseCard 
                key={warehouse.id} 
                warehouse={warehouse} 
              />
            ))}
          </div>
        ) : (
          /* Preview of first card when collapsed */
          <div className="px-4 pb-4 overflow-hidden">
            <div className="opacity-60">
              <WarehouseCard 
                warehouse={sortedWarehouses[0]} 
              />
            </div>
          </div>
        )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default WarehouseDrawer;