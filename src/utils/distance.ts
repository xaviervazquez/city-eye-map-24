
/**
 * Utility functions for calculating distances between geographical coordinates
 * and filtering warehouses based on proximity to user location
 */

/**
 * Calculate the distance between two geographical points using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point  
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles

  // Convert latitude and longitude differences to radians
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  // Haversine formula calculation
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Return distance in miles
  return R * c;
}

/**
 * Filter warehouses within a specified radius of user location and sort by distance
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @param warehouses - Array of warehouse objects
 * @param radiusMiles - Maximum distance in miles (default: 2 miles)
 * @returns Array of warehouses within radius, sorted by distance (closest first)
 */
export function getWarehousesWithinRadius(
  userLat: number,
  userLon: number,
  warehouses: any[],
  radiusMiles: number = 2
) {
  return warehouses
    // Add distance calculation to each warehouse
    .map(warehouse => ({
      ...warehouse,
      distanceFromUser: calculateDistance(userLat, userLon, warehouse.latitude, warehouse.longitude)
    }))
    // Filter to only include warehouses within the specified radius
    .filter(warehouse => warehouse.distanceFromUser <= radiusMiles)
    // Sort by distance (closest warehouses first)
    .sort((a, b) => a.distanceFromUser - b.distanceFromUser);
}
