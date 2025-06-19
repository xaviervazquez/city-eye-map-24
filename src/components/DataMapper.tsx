/**
 * Data Mapper Component - Maps WAREHOUSE CITY data to our warehouse structure
 * This component analyzes incoming data and shows how to transform it
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from './ui/use-toast';
import { Warehouse } from '../types/warehouse';

// Define what we expect from WAREHOUSE CITY based on typical warehouse data
interface WarehouseCityData {
  // Common fields we might expect from WAREHOUSE CITY
  [key: string]: any;
  // These are guesses - we'll update based on actual data structure
  facility_name?: string;
  facility_id?: string;
  address?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  status?: string;
  construction_status?: string;
  operational_status?: string;
  operator?: string;
  company?: string;
  size_sqft?: number;
  building_size?: number;
  construction_date?: string;
  opened_date?: string;
}

interface MappingResult {
  originalData: WarehouseCityData;
  mappedWarehouse: Partial<Warehouse>;
  mappingStatus: {
    field: keyof Warehouse;
    mapped: boolean;
    sourceField?: string;
    transformation?: string;
    issues?: string[];
  }[];
  missingFields: string[];
  unmappedFields: string[];
}

const DataMapper: React.FC = () => {
  const [sampleData, setSampleData] = useState<string>('');
  const [mappingResults, setMappingResults] = useState<MappingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /**
   * CORE MAPPING LOGIC
   * This function takes raw WAREHOUSE CITY data and maps it to our Warehouse interface
   */
  const mapWarehouseCityToWarehouse = (rawData: WarehouseCityData): MappingResult => {
    // Initialize our target warehouse object
    const mappedWarehouse: Partial<Warehouse> = {};
    
    // Track mapping status for each required field
    const mappingStatus: MappingResult['mappingStatus'] = [];
    const issues: string[] = [];

    // 1. MAP ID FIELD
    // Try to find a unique identifier from various possible field names
    const idCandidates = ['id', 'facility_id', 'warehouse_id', 'project_id', 'unique_id'];
    const idField = idCandidates.find(field => rawData[field]);
    
    if (idField && rawData[idField]) {
      mappedWarehouse.id = String(rawData[idField]);
      mappingStatus.push({
        field: 'id',
        mapped: true,
        sourceField: idField,
        transformation: 'Convert to string'
      });
    } else {
      // Generate fallback ID if none found
      mappedWarehouse.id = `warehouse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      mappingStatus.push({
        field: 'id',
        mapped: false,
        issues: ['No unique ID found - generated fallback ID']
      });
    }

    // 2. MAP NAME FIELD
    // Try to find warehouse name from various possible field names
    const nameCandidates = ['name', 'facility_name', 'warehouse_name', 'project_name', 'site_name'];
    const nameField = nameCandidates.find(field => rawData[field]);
    
    if (nameField && rawData[nameField]) {
      mappedWarehouse.name = String(rawData[nameField]);
      mappingStatus.push({
        field: 'name',
        mapped: true,
        sourceField: nameField
      });
    } else {
      mappingStatus.push({
        field: 'name',
        mapped: false,
        issues: ['No warehouse name found']
      });
    }

    // 3. MAP ADDRESS FIELD
    // Try to construct full address from available fields
    const addressParts: string[] = [];
    
    if (rawData.street_address || rawData.address) {
      addressParts.push(rawData.street_address || rawData.address);
    }
    if (rawData.city) addressParts.push(rawData.city);
    if (rawData.state) addressParts.push(rawData.state);
    if (rawData.zip_code || rawData.zipcode) addressParts.push(rawData.zip_code || rawData.zipcode);
    
    if (addressParts.length > 0) {
      mappedWarehouse.address = addressParts.join(', ');
      mappingStatus.push({
        field: 'address',
        mapped: true,
        sourceField: 'Constructed from: ' + Object.keys(rawData).filter(k => 
          ['street_address', 'address', 'city', 'state', 'zip_code', 'zipcode'].includes(k)
        ).join(', '),
        transformation: 'Concatenate address components'
      });
    } else {
      mappingStatus.push({
        field: 'address',
        mapped: false,
        issues: ['No address components found']
      });
    }

    // 4. MAP LATITUDE FIELD
    // Try to find latitude from various possible field names
    const latCandidates = ['latitude', 'lat', 'y_coordinate', 'coord_lat'];
    const latField = latCandidates.find(field => rawData[field] !== undefined);
    
    if (latField && typeof rawData[latField] === 'number') {
      mappedWarehouse.latitude = rawData[latField];
      mappingStatus.push({
        field: 'latitude',
        mapped: true,
        sourceField: latField
      });
    } else if (latField && rawData[latField]) {
      // Try to parse as number
      const parsed = parseFloat(rawData[latField]);
      if (!isNaN(parsed)) {
        mappedWarehouse.latitude = parsed;
        mappingStatus.push({
          field: 'latitude',
          mapped: true,
          sourceField: latField,
          transformation: 'Parse string to number'
        });
      } else {
        mappingStatus.push({
          field: 'latitude',
          mapped: false,
          issues: [`Found ${latField} but cannot parse as number: ${rawData[latField]}`]
        });
      }
    } else {
      mappingStatus.push({
        field: 'latitude',
        mapped: false,
        issues: ['No latitude coordinate found']
      });
    }

    // 5. MAP LONGITUDE FIELD
    // Try to find longitude from various possible field names
    const lngCandidates = ['longitude', 'lng', 'lon', 'x_coordinate', 'coord_lng'];
    const lngField = lngCandidates.find(field => rawData[field] !== undefined);
    
    if (lngField && typeof rawData[lngField] === 'number') {
      mappedWarehouse.longitude = rawData[lngField];
      mappingStatus.push({
        field: 'longitude',
        mapped: true,
        sourceField: lngField
      });
    } else if (lngField && rawData[lngField]) {
      // Try to parse as number
      const parsed = parseFloat(rawData[lngField]);
      if (!isNaN(parsed)) {
        mappedWarehouse.longitude = parsed;
        mappingStatus.push({
          field: 'longitude',
          mapped: true,
          sourceField: lngField,
          transformation: 'Parse string to number'
        });
      } else {
        mappingStatus.push({
          field: 'longitude',
          mapped: false,
          issues: [`Found ${lngField} but cannot parse as number: ${rawData[lngField]}`]
        });
      }
    } else {
      mappingStatus.push({
        field: 'longitude',
        mapped: false,
        issues: ['No longitude coordinate found']
      });
    }

    // 6. MAP STATUS FIELD
    // This is complex - need to map various status values to our enum
    const statusCandidates = ['status', 'construction_status', 'operational_status', 'project_status'];
    const statusField = statusCandidates.find(field => rawData[field]);
    
    if (statusField && rawData[statusField]) {
      const rawStatus = String(rawData[statusField]).toLowerCase();
      
      // Map various status values to our enum
      let mappedStatus: Warehouse['status'] | undefined;
      
      if (rawStatus.includes('upcoming') || rawStatus.includes('planned') || rawStatus.includes('proposed')) {
        mappedStatus = 'upcoming';
      } else if (rawStatus.includes('construction') || rawStatus.includes('building') || rawStatus.includes('development')) {
        mappedStatus = 'in-construction';
      } else if (rawStatus.includes('operating') || rawStatus.includes('operational') || rawStatus.includes('active') || rawStatus.includes('open')) {
        mappedStatus = 'operating';
      } else if (rawStatus.includes('dormant') || rawStatus.includes('closed') || rawStatus.includes('inactive')) {
        mappedStatus = 'dormant';
      }
      
      if (mappedStatus) {
        mappedWarehouse.status = mappedStatus;
        mappingStatus.push({
          field: 'status',
          mapped: true,
          sourceField: statusField,
          transformation: `Map "${rawData[statusField]}" to "${mappedStatus}"`
        });
      } else {
        mappingStatus.push({
          field: 'status',
          mapped: false,
          issues: [`Unknown status value: "${rawData[statusField]}" - cannot map to our enum`]
        });
      }
    } else {
      mappingStatus.push({
        field: 'status',
        mapped: false,
        issues: ['No status field found']
      });
    }

    // 7. MAP IMPACT STAT FIELD
    // This is likely custom data we'll need to add ourselves
    // WAREHOUSE CITY probably doesn't have community impact statistics
    if (rawData.impact_stat || rawData.impactStat) {
      mappedWarehouse.impactStat = String(rawData.impact_stat || rawData.impactStat);
      mappingStatus.push({
        field: 'impactStat',
        mapped: true,
        sourceField: rawData.impact_stat ? 'impact_stat' : 'impactStat'
      });
    } else {
      // Generate placeholder impact stat based on available data
      let generatedImpact = 'Impact data not available';
      if (rawData.size_sqft || rawData.building_size) {
        const size = rawData.size_sqft || rawData.building_size;
        generatedImpact = `${size.toLocaleString()} sq ft facility`;
      }
      
      mappedWarehouse.impactStat = generatedImpact;
      mappingStatus.push({
        field: 'impactStat',
        mapped: false,
        transformation: `Generated placeholder: "${generatedImpact}"`,
        issues: ['No community impact data - this will need to be added manually']
      });
    }

    // 8. IDENTIFY UNMAPPED FIELDS
    // Find fields in source data that we didn't use
    const usedFields = mappingStatus
      .filter(status => status.sourceField)
      .map(status => status.sourceField)
      .flat();
    
    const unmappedFields = Object.keys(rawData).filter(field => 
      !usedFields.some(used => used?.includes(field))
    );

    // 9. IDENTIFY MISSING REQUIRED FIELDS
    const requiredFields: (keyof Warehouse)[] = ['id', 'name', 'address', 'latitude', 'longitude', 'status', 'impactStat'];
    const missingFields = requiredFields.filter(field => !mappedWarehouse[field]);

    return {
      originalData: rawData,
      mappedWarehouse,
      mappingStatus,
      missingFields: missingFields.map(String),
      unmappedFields
    };
  };

  /**
   * SAMPLE DATA ANALYSIS
   * Parse and analyze sample JSON data from user input
   */
  const analyzeSampleData = () => {
    if (!sampleData.trim()) {
      toast({
        title: "Error",
        description: "Please enter sample data to analyze",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Try to parse as JSON
      let parsedData: any;
      try {
        parsedData = JSON.parse(sampleData);
      } catch {
        // If not JSON, try to extract from text
        toast({
          title: "Error", 
          description: "Please enter valid JSON data",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Handle array of warehouses or single warehouse
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      const results = dataArray.map(item => mapWarehouseCityToWarehouse(item));
      setMappingResults(results);
      
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${results.length} warehouse record(s)`
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to analyze data: ${error}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * LOAD SAMPLE WAREHOUSE CITY DATA
   * Provide some example data structures to test with
   */
  const loadSampleData = (sampleType: string) => {
    const samples = {
      basic: JSON.stringify({
        facility_id: "WH001",
        facility_name: "Distribution Center Alpha",
        street_address: "1234 Industrial Blvd",
        city: "Riverside",
        state: "CA",
        zip_code: "92508",
        latitude: 33.8297,
        longitude: -117.3253,
        status: "operational",
        size_sqft: 500000,
        operator: "Amazon"
      }, null, 2),
      
      minimal: JSON.stringify({
        id: "WH002", 
        name: "Warehouse Beta",
        lat: 33.8289,
        lng: -117.2845,
        construction_status: "under construction"
      }, null, 2),
      
      complex: JSON.stringify({
        warehouse_id: "COMPLEX_001",
        project_name: "Mega Distribution Hub",
        address: "5678 Commerce Way, Moreno Valley, CA 92553",
        coord_lat: 33.8156,
        coord_lng: -117.2734,
        operational_status: "planned",
        building_size: 1200000,
        construction_date: "2024-06-01",
        company: "Walmart",
        impact_stat: "Expected 20% increase in local truck traffic"
      }, null, 2)
    };
    
    setSampleData(samples[sampleType as keyof typeof samples] || samples.basic);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER AND INSTRUCTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>WAREHOUSE CITY Data Mapper</CardTitle>
          <p className="text-sm text-muted-foreground">
            Map WAREHOUSE CITY data fields to our Warehouse interface structure
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sample data buttons for testing */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => loadSampleData('basic')} variant="outline" size="sm">
              Load Basic Sample
            </Button>
            <Button onClick={() => loadSampleData('minimal')} variant="outline" size="sm">
              Load Minimal Sample  
            </Button>
            <Button onClick={() => loadSampleData('complex')} variant="outline" size="sm">
              Load Complex Sample
            </Button>
          </div>

          {/* Data input area */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sample WAREHOUSE CITY Data (JSON)</label>
            <textarea
              className="w-full h-40 p-3 border rounded-md font-mono text-sm"
              placeholder="Paste sample JSON data from WAREHOUSE CITY here..."
              value={sampleData}
              onChange={(e) => setSampleData(e.target.value)}
            />
          </div>

          <Button onClick={analyzeSampleData} disabled={loading} className="w-full">
            {loading ? 'Analyzing...' : 'Analyze Data Mapping'}
          </Button>
        </CardContent>
      </Card>

      {/* CURRENT WAREHOUSE INTERFACE REFERENCE */}
      <Card>
        <CardHeader>
          <CardTitle>Our Current Warehouse Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded overflow-auto">
{`interface Warehouse {
  id: string;                    // Unique identifier
  name: string;                  // Display name  
  address: string;               // Full street address
  latitude: number;              // Geographic latitude
  longitude: number;             // Geographic longitude  
  status: 'upcoming' | 'in-construction' | 'operating' | 'dormant';
  impactStat: string;           // Community impact statistic
  distanceFromUser?: number;    // Optional: distance from user
}`}
          </pre>
        </CardContent>
      </Card>

      {/* MAPPING RESULTS */}
      {mappingResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mapping Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {mappingResults.map((result, index) => (
                <Card key={index} className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Warehouse Record #{index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="mapping" className="w-full">
                      <TabsList>
                        <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
                        <TabsTrigger value="result">Mapped Result</TabsTrigger>
                        <TabsTrigger value="issues">Issues & Recommendations</TabsTrigger>
                      </TabsList>
                      
                      {/* FIELD BY FIELD MAPPING ANALYSIS */}
                      <TabsContent value="mapping">
                        <div className="space-y-3">
                          {result.mappingStatus.map((status, idx) => (
                            <div key={idx} className="flex items-start justify-between p-3 border rounded">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant={status.mapped ? "default" : "destructive"}>
                                    {status.field}
                                  </Badge>
                                  {status.mapped ? (
                                    <span className="text-green-600 text-sm">✓ Mapped</span>
                                  ) : (
                                    <span className="text-red-600 text-sm">✗ Not Mapped</span>
                                  )}
                                </div>
                                
                                {status.sourceField && (
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Source:</strong> {status.sourceField}
                                  </p>
                                )}
                                
                                {status.transformation && (
                                  <p className="text-sm text-blue-600">
                                    <strong>Transform:</strong> {status.transformation}
                                  </p>
                                )}
                                
                                {status.issues && status.issues.length > 0 && (
                                  <div className="mt-1">
                                    {status.issues.map((issue, issueIdx) => (
                                      <p key={issueIdx} className="text-sm text-red-600">
                                        ⚠️ {issue}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      {/* FINAL MAPPED RESULT */}
                      <TabsContent value="result">
                        <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                          {JSON.stringify(result.mappedWarehouse, null, 2)}
                        </pre>
                      </TabsContent>
                      
                      {/* ISSUES AND RECOMMENDATIONS */}
                      <TabsContent value="issues">
                        <div className="space-y-4">
                          {result.missingFields.length > 0 && (
                            <Alert>
                              <AlertDescription>
                                <strong>Missing Required Fields:</strong> {result.missingFields.join(', ')}
                                <br />These fields couldn't be mapped and may need manual data entry or default values.
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {result.unmappedFields.length > 0 && (
                            <Alert>
                              <AlertDescription>
                                <strong>Unused Source Fields:</strong> {result.unmappedFields.join(', ')}
                                <br />These fields from WAREHOUSE CITY weren't used in our mapping. Consider if any contain useful data.
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <Alert>
                            <AlertDescription>
                              <strong>Next Steps:</strong>
                              <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Review field mappings and adjust transformation logic as needed</li>
                                <li>Create fallback values for missing required fields</li>
                                <li>Consider extending our Warehouse interface with useful unmapped fields</li>
                                <li>Set up data validation for transformed values</li>
                                <li>Plan how to handle community impact statistics (likely manual data)</li>
                              </ul>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataMapper;