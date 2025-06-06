
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
    name: 'Sycamore Hills Distribution Center',
    address: '1000 E Alessandro BLVD Riverside, CA 92508',
    latitude: 33.8297,
    longitude: -117.3253,
    status: 'upcoming',
    impactStat: '12% decrease in property value averaged'
  },
  {
    id: '2',
    name: 'West Meridian Center',
    address: '224544 Alessandro Blvd Moreno Valley, CA 92553',
    latitude: 33.8289,
    longitude: -117.2845,
    status: 'upcoming',
    impactStat: '15% increase in truck traffic'
  },
  {
    id: '3',
    name: 'Bloomington Industrial Park',
    address: '22360 Goldencrest Ave Moreno Valley, CA 92553',
    latitude: 33.8156,
    longitude: -117.2734,
    status: 'in-construction',
    impactStat: '8% air quality decrease'
  },
  {
    id: '4',
    name: 'Amazon Fresh',
    address: '23900 Brodiaea Ave Moreno Valley, CA 92553',
    latitude: 33.8087,
    longitude: -117.2698,
    status: 'operating',
    impactStat: '5% noise increase during peak hours'
  }
];

/**
 * Default user location for testing purposes
 * This is the validation address mentioned in the PRD: 14070 Barton St. Riverside, CA 92508
 */
export const defaultUserLocation = {
  latitude: 33.8303,
  longitude: -117.3289
};
