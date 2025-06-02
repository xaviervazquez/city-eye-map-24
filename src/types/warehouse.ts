
/**
 * TypeScript type definitions for warehouse and location data structures
 */

/**
 * Warehouse data structure representing a distribution center or warehouse facility
 */
export interface Warehouse {
  id: string;                    // Unique identifier for the warehouse
  name: string;                  // Display name of the warehouse
  address: string;               // Full street address
  latitude: number;              // Geographic latitude coordinate
  longitude: number;             // Geographic longitude coordinate
  status: 'upcoming' | 'in-construction' | 'operating' | 'dormant'; // Current operational status
  impactStat: string;           // Human-readable impact statistic (e.g., "12% decrease in property value")
  distanceFromUser?: number;    // Optional: calculated distance from user in miles
}

/**
 * User's geographical location coordinates
 */
export interface UserLocation {
  latitude: number;             // User's latitude coordinate
  longitude: number;            // User's longitude coordinate
}
