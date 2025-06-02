
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getWarehousesWithinRadius(
  userLat: number,
  userLon: number,
  warehouses: any[],
  radiusMiles: number = 2
) {
  return warehouses
    .map(warehouse => ({
      ...warehouse,
      distanceFromUser: calculateDistance(userLat, userLon, warehouse.latitude, warehouse.longitude)
    }))
    .filter(warehouse => warehouse.distanceFromUser <= radiusMiles)
    .sort((a, b) => a.distanceFromUser - b.distanceFromUser);
}
