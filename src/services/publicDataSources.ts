/**
 * Public Data Sources Service
 * 
 * This service catalogs and tests access to public data sources for warehouse tracking.
 * All sources are public and unlicensed to ensure legal compliance.
 * 
 * Key Assumptions:
 * - Inland Empire = Riverside & San Bernardino Counties primarily
 * - Warehouse classification includes distribution centers, fulfillment centers, logistics hubs
 * - Focus on facilities >50,000 sq ft (typical e-commerce warehouse threshold)
 */

export interface DataSource {
  id: string;
  name: string;
  agency: string;
  description: string;
  baseUrl: string;
  apiEndpoint?: string;
  accessMethod: 'API' | 'Web_Scraping' | 'Download' | 'FOIA_Request';
  updateFrequency: 'Real-time' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  dataTypes: string[];
  coverage: 'Riverside_County' | 'San_Bernardino_County' | 'California' | 'Federal';
  reliability: 'High' | 'Medium' | 'Low' | 'Unknown';
  lastTested?: string;
  status: 'Active' | 'Testing' | 'Inactive' | 'Access_Denied';
  notes?: string;
}

/**
 * Comprehensive catalog of public data sources for warehouse tracking
 * Organized by government level and data type
 */
export const publicDataSources: DataSource[] = [
  // RIVERSIDE COUNTY SOURCES
  {
    id: 'riverside_permits',
    name: 'Riverside County Building Permits',
    agency: 'Riverside County Building & Safety',
    description: 'Building permits including new warehouse construction and modifications',
    baseUrl: 'https://rivcobuilding.org',
    accessMethod: 'Web_Scraping', // No public API identified yet
    updateFrequency: 'Daily',
    dataTypes: ['permits', 'construction_status', 'square_footage', 'addresses', 'permit_dates'],
    coverage: 'Riverside_County',
    reliability: 'High',
    status: 'Testing',
    notes: 'Provides construction timeline and facility specifications'
  },
  {
    id: 'riverside_planning',
    name: 'Riverside County Planning Department Records',
    agency: 'Riverside County Planning Department',
    description: 'Zoning applications, conditional use permits, environmental reviews',
    baseUrl: 'https://planning.rctlma.org',
    accessMethod: 'Web_Scraping',
    updateFrequency: 'Weekly',
    dataTypes: ['zoning', 'land_use', 'conditional_permits', 'environmental_reviews'],
    coverage: 'Riverside_County',
    reliability: 'High',
    status: 'Testing',
    notes: 'Critical for identifying warehouse zoning and approval status'
  },
  {
    id: 'riverside_gis',
    name: 'Riverside County GIS Data Portal',
    agency: 'Riverside County Information Technology',
    description: 'Parcel data, zoning maps, land use classifications',
    baseUrl: 'https://gis.rivcoit.org',
    apiEndpoint: '/arcgis/rest/services',
    accessMethod: 'API',
    updateFrequency: 'Monthly',
    dataTypes: ['parcels', 'zoning', 'land_use', 'assessor_data'],
    coverage: 'Riverside_County',
    reliability: 'High',
    status: 'Active',
    notes: 'Reliable GIS API with comprehensive parcel and zoning data'
  },

  // SAN BERNARDINO COUNTY SOURCES  
  {
    id: 'sanbernardino_permits',
    name: 'San Bernardino County Building Permits',
    agency: 'San Bernardino County Building & Safety',
    description: 'Building permits and inspection records for commercial development',
    baseUrl: 'https://www.sbcounty.gov/dbe/building',
    accessMethod: 'FOIA_Request', // Limited online access
    updateFrequency: 'Weekly',
    dataTypes: ['permits', 'inspections', 'certificates_of_occupancy'],
    coverage: 'San_Bernardino_County',
    reliability: 'Medium',
    status: 'Testing',
    notes: 'May require public records requests for bulk data access'
  },
  {
    id: 'sanbernardino_planning',
    name: 'San Bernardino County Planning Records',
    agency: 'San Bernardino County Land Use Services',
    description: 'Development applications, environmental impact reports',
    baseUrl: 'https://www.sbcounty.gov/lus/planning',
    accessMethod: 'Web_Scraping',
    updateFrequency: 'Weekly',
    dataTypes: ['development_applications', 'environmental_reports', 'public_hearings'],
    coverage: 'San_Bernardino_County',
    reliability: 'Medium',
    status: 'Testing'
  },

  // CALIFORNIA STATE SOURCES
  {
    id: 'ceqa_database',
    name: 'California Environmental Quality Act (CEQA) Database',
    agency: 'California Office of Planning and Research',
    description: 'Environmental impact reports and negative declarations for all major projects',
    baseUrl: 'https://ceqanet.opr.ca.gov',
    accessMethod: 'Web_Scraping',
    updateFrequency: 'Daily',
    dataTypes: ['environmental_impacts', 'project_descriptions', 'mitigation_measures', 'public_comments'],
    coverage: 'California',
    reliability: 'High',
    status: 'Active',
    notes: 'Comprehensive source for environmental impact data on warehouse projects'
  },
  {
    id: 'carb_emissions',
    name: 'California Air Resources Board Facility Data',
    agency: 'California Air Resources Board',
    description: 'Industrial facility emissions reporting and air quality monitoring',
    baseUrl: 'https://www.arb.ca.gov',
    apiEndpoint: '/ei/data', // Hypothetical - need to verify
    accessMethod: 'Download',
    updateFrequency: 'Annually',
    dataTypes: ['emissions_data', 'facility_permits', 'air_quality_monitoring'],
    coverage: 'California',
    reliability: 'High',
    status: 'Testing',
    notes: 'Official source for emissions data, may have warehouse-specific reporting'
  },
  {
    id: 'calfire_hazards',
    name: 'Cal Fire Hazard Mapping',
    agency: 'California Department of Forestry and Fire Protection',
    description: 'Fire hazard zones and risk assessments relevant to warehouse siting',
    baseUrl: 'https://osfm.fire.ca.gov',
    accessMethod: 'Download',
    updateFrequency: 'Annually',
    dataTypes: ['fire_hazard_zones', 'risk_assessments'],
    coverage: 'California',
    reliability: 'High',
    status: 'Active'
  },

  // FEDERAL SOURCES
  {
    id: 'epa_facilities',
    name: 'EPA Facility Registry Service',
    agency: 'U.S. Environmental Protection Agency',
    description: 'Federal facility database including large industrial and commercial facilities',
    baseUrl: 'https://www.epa.gov/frs',
    apiEndpoint: '/api/rest/lookups',
    accessMethod: 'API',
    updateFrequency: 'Monthly',
    dataTypes: ['facility_locations', 'environmental_permits', 'compliance_data'],
    coverage: 'Federal',
    reliability: 'High',
    status: 'Active',
    notes: 'May include large warehouse facilities with environmental permits'
  },
  {
    id: 'dot_freight',
    name: 'DOT Freight Analysis Framework',
    agency: 'U.S. Department of Transportation',
    description: 'Freight flow and logistics facility data',
    baseUrl: 'https://ops.fhwa.dot.gov/freight',
    accessMethod: 'Download',
    updateFrequency: 'Annually',
    dataTypes: ['freight_flows', 'logistics_facilities', 'transportation_infrastructure'],
    coverage: 'Federal',
    reliability: 'High',
    status: 'Testing'
  }
];

/**
 * Test a data source for accessibility and response time
 * This helps assess reliability and current status
 */
export const testDataSource = async (source: DataSource): Promise<{
  success: boolean;
  responseTime: number;
  error?: string;
  statusCode?: number;
}> => {
  const startTime = Date.now();
  
  try {
    // For API endpoints, test the actual API
    const testUrl = source.apiEndpoint ? 
      `${source.baseUrl}${source.apiEndpoint}` : 
      source.baseUrl;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'WarehouseTracker/1.0 (Research Tool)', // Identify our tool
      },
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: response.ok,
      responseTime,
      statusCode: response.status
    };
  } catch (error) {
    return {
      success: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get data sources filtered by specific criteria
 * Useful for focusing on particular types of data or jurisdictions
 */
export const getDataSourcesByType = (dataType: string): DataSource[] => {
  return publicDataSources.filter(source => 
    source.dataTypes.some(type => 
      type.toLowerCase().includes(dataType.toLowerCase())
    )
  );
};

/**
 * Get data sources by coverage area
 * Helps focus on specific geographic regions
 */
export const getDataSourcesByCoverage = (coverage: DataSource['coverage']): DataSource[] => {
  return publicDataSources.filter(source => source.coverage === coverage);
};

/**
 * Calculate overall data source reliability score
 * Used for prioritizing which sources to integrate first
 */
export const calculateReliabilityScore = (sources: DataSource[]): {
  high: number;
  medium: number;
  low: number;
  unknown: number;
  total: number;
} => {
  const scores = sources.reduce((acc, source) => {
    acc[source.reliability.toLowerCase() as keyof typeof acc]++;
    acc.total++;
    return acc;
  }, { high: 0, medium: 0, low: 0, unknown: 0, total: 0 });
  
  return scores;
};