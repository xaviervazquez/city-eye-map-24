
export interface Warehouse {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'upcoming' | 'in-construction' | 'operating' | 'dormant';
  impactStat: string;
  distanceFromUser?: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
