
/**
 * Static data for warehouse locations in the Inland Empire region
 * This data represents the four test warehouses mentioned in the PRD
 */

import { Warehouse } from '../types/warehouse';

/**
 * Sample warehouse data for the MVP
 * These are the four specific warehouses mentioned in the PRD requirements
 */
export const warehouseData: Warehouse[] = [
  {
    id: '1',
    name: 'Meridian Park West',
    address: 'Linebacker Rd, Riverside, CA 92508',
    latitude: 33.9068611,
    longitude: -117.2916944,
    status: 'upcoming',
    impactStat: '12% decrease in property value averaged'
  },
  {
    id: '2',
    name: 'Burlington Distribution Center',
    address: '3850 Van Buren Blvd, Riverside, CA 92503',
    latitude: 33.9055,
    longitude: -117.2990,
    status: 'operating',
    impactStat: '15% increase in truck traffic'
  },
  {
    id: '3',
    name: 'Bloomington Industrial Park',
    address: '4200 Pierce St, Riverside, CA 92505',
    latitude: 33.9095,
    longitude: -117.2890,
    status: 'in-construction',
    impactStat: '8% air quality decrease'
  },
  {
    id: '4',
    name: 'Amazon Fresh',
    address: '3950 Chicago Ave, Riverside, CA 92507',
    latitude: 33.9085,
    longitude: -117.2975,
    status: 'dormant',
    impactStat: '5% noise increase during peak hours'
  }
];

/**
 * Default user location for testing purposes
 * Located approximately 351 feet from Meridian Park West in Riverside, CA
 */
export const defaultUserLocation = {
  latitude: 33.9055,
  longitude: -117.2930
};
