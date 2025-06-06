/**
 * Engage Modal - Warehouse Meeting RSVP Component
 * Shows meeting details and allows users to RSVP to public meetings
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Warehouse } from '../types/warehouse';
import { getWarehouseStatusConfig } from '../utils/warehouseStatus';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

interface EngageModalProps {
  warehouse: Warehouse;
  isOpen: boolean;
  onClose: () => void;
}

const EngageModal: React.FC<EngageModalProps> = ({
  warehouse,
  isOpen,
  onClose,
}) => {
  const [hasRSVPd, setHasRSVPd] = useState(false);

  const statusConfig = getWarehouseStatusConfig(warehouse.status);
  const StatusIcon = statusConfig.icon;

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
    return '/images/warehouses/Warehouse-M.png';
  };

  const handleRSVP = () => {
    setHasRSVPd(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-auto max-h-[90vh] overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-semibold">Engage</SheetTitle>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* Project Info */}
          <div className="flex items-start space-x-4">
            <img 
              src={getWarehouseImage(warehouse.name)}
              alt={warehouse.name}
              className="w-16 h-12 object-cover rounded-md bg-gray-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold mb-2">{warehouse.name}</h2>
              <Badge variant="default" className={`${statusConfig.backgroundColor} ${statusConfig.textColor} ${statusConfig.borderColor} border gap-1 text-xs mb-2 w-fit`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </Badge>
              <p className="text-sm text-muted-foreground">
                about {Math.round((warehouse.distanceFromUser || 0.21) * 5280)} feet from you • {warehouse.address.split(',')[0]}
              </p>
            </div>
          </div>

          {/* Meeting Details */}
          <div>
            <h3 className="font-medium mb-3">Next meeting</h3>
            <div 
              className={`rounded-lg p-4 text-center ${
                hasRSVPd 
                  ? 'bg-green-50 border-2 border-green-600' 
                  : 'bg-white border border-border'
              }`}
            >
              <h4 className="font-semibold mb-2">Joint Powers Authority San Bernardino</h4>
              <p className="text-sm mb-1">May 17 at 6:00 PM</p>
              <p className="text-sm text-muted-foreground mb-1">716 La Cadena Ave.</p>
              <p className="text-sm text-muted-foreground mb-1">Colton, California</p>
              <p className="text-sm text-muted-foreground">92324</p>
            </div>
          </div>

          {/* How to Prepare */}
          <div>
            <h3 className="font-medium mb-2">How to prepare</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You can show up with a personalized report:
            </p>
            <Button variant="primary" size="lg" className="w-full">
              Start consultation →
            </Button>
          </div>

          {/* Builder Q&A */}
          <div>
            <h3 className="font-medium mb-3">Also try asking your Builder:</h3>
            <div className="space-y-2">
              <Button variant="tertiary" size="sm" className="w-full justify-start text-left h-auto py-3">
                How can I prepare for this meeting?
              </Button>
              <Button variant="tertiary" size="sm" className="w-full justify-start text-left h-auto py-3">
                What can I expect if I show up?
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant={hasRSVPd ? "secondary" : "primary"}
              size="lg"
              className={`flex-1 ${
                hasRSVPd 
                  ? 'bg-green-50 border-green-600 text-green-700 hover:bg-green-100' 
                  : ''
              }`}
              onClick={handleRSVP}
            >
              {hasRSVPd ? 'Going' : 'RSVP'}
            </Button>
            <Button variant="secondary-custom" size="lg" className="flex-1">
              Email rep
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EngageModal;