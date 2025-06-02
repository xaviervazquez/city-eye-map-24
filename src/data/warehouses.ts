
import { Warehouse } from '../types/warehouse';

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
    name: 'Elite Placement Solutions',
    address: '224544 Alessandro Blvd Moreno Valley, CA 92553',
    latitude: 33.8289,
    longitude: -117.2845,
    status: 'operating',
    impactStat: '15% increase in truck traffic'
  },
  {
    id: '3',
    name: 'National Tube Supply',
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
    status: 'dormant',
    impactStat: '5% noise increase during peak hours'
  }
];

export const defaultUserLocation = {
  latitude: 33.8303,
  longitude: -117.3289
}; // 14070 Barton St. Riverside, CA 92508
