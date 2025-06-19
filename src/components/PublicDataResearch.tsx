/**
 * Public Data Research Component
 * 
 * Phase 1 implementation: Research and document public data sources for warehouse tracking.
 * Displays comprehensive inventory of public data sources with testing capabilities.
 * 
 * Key Features:
 * - Data source catalog with detailed metadata
 * - Real-time accessibility testing 
 * - Reliability assessment and scoring
 * - Filtering by data type and coverage area
 * - Documentation of legal compliance approach
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  publicDataSources, 
  testDataSource, 
  getDataSourcesByType, 
  getDataSourcesByCoverage,
  calculateReliabilityScore,
  type DataSource 
} from '@/services/publicDataSources';
import { CheckCircle, XCircle, Clock, ExternalLink, Database, Shield } from 'lucide-react';

const PublicDataResearch = () => {
  // State for tracking test results and current testing status
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  /**
   * Test accessibility of a specific data source
   * Updates UI with real-time results and response times
   */
  const handleTestSource = async (source: DataSource) => {
    setTesting(source.id);
    
    try {
      const result = await testDataSource(source);
      setTestResults(prev => ({
        ...prev,
        [source.id]: {
          ...result,
          testedAt: new Date().toISOString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [source.id]: {
          success: false,
          error: 'Test failed',
          testedAt: new Date().toISOString()
        }
      }));
    } finally {
      setTesting(null);
    }
  };

  /**
   * Test all data sources sequentially to assess overall system reliability
   * Includes delay between requests to be respectful of public APIs
   */
  const handleTestAllSources = async () => {
    for (const source of publicDataSources) {
      await handleTestSource(source);
      // Add delay between requests to avoid overwhelming public servers
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  /**
   * Filter data sources based on selected criteria
   * Supports filtering by data type, coverage area, or showing all
   */
  const getFilteredSources = (): DataSource[] => {
    switch (selectedFilter) {
      case 'permits':
        return getDataSourcesByType('permits');
      case 'environmental':
        return getDataSourcesByType('environmental');
      case 'riverside':
        return getDataSourcesByCoverage('Riverside_County');
      case 'sanbernardino':
        return getDataSourcesByCoverage('San_Bernardino_County');
      case 'california':
        return getDataSourcesByCoverage('California');
      case 'federal':
        return getDataSourcesByCoverage('Federal');
      default:
        return publicDataSources;
    }
  };

  const filteredSources = getFilteredSources();
  const reliabilityScore = calculateReliabilityScore(filteredSources);

  /**
   * Render status badge based on data source current status
   * Provides visual indication of source availability and testing state
   */
  const renderStatusBadge = (source: DataSource) => {
    const result = testResults[source.id];
    
    if (testing === source.id) {
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Testing</Badge>;
    }
    
    if (result) {
      return result.success ? 
        <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Accessible</Badge> :
        <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
    }
    
    // Default status based on source configuration
    const statusColors = {
      'Active': 'default',
      'Testing': 'secondary', 
      'Inactive': 'secondary',
      'Access_Denied': 'destructive'
    } as const;
    
    return <Badge variant={statusColors[source.status] || 'secondary'}>{source.status.replace('_', ' ')}</Badge>;
  };

  /**
   * Render reliability indicator with color coding
   * Helps prioritize which data sources to integrate first
   */
  const renderReliabilityBadge = (reliability: string) => {
    const colors = {
      'High': 'default',
      'Medium': 'secondary',
      'Low': 'destructive',
      'Unknown': 'outline'
    } as const;
    
    return <Badge variant={colors[reliability as keyof typeof colors] || 'outline'}>{reliability}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Public Data Source Research</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Phase 1: Comprehensive catalog of public data sources for warehouse tracking. 
            All sources are legally accessible and license-compliant for independent dataset creation.
          </p>
        </div>

        {/* Legal Compliance Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Legal Compliance:</strong> All data sources listed are public, government-operated, 
            and unlicensed. We're building our own independent dataset using the same original sources 
            that others reference, ensuring full legal compliance without copying proprietary data.
          </AlertDescription>
        </Alert>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{publicDataSources.length}</div>
              <p className="text-sm text-muted-foreground">Total Data Sources</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{reliabilityScore.high}</div>
              <p className="text-sm text-muted-foreground">High Reliability</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {publicDataSources.filter(s => s.accessMethod === 'API').length}
              </div>
              <p className="text-sm text-muted-foreground">API Access</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(testResults).length}
              </div>
              <p className="text-sm text-muted-foreground">Sources Tested</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="sources" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="testing">Reliability Testing</TabsTrigger>
            <TabsTrigger value="analysis">Coverage Analysis</TabsTrigger>
          </TabsList>

          {/* Data Sources Tab */}
          <TabsContent value="sources" className="space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('all')}
              >
                All Sources ({publicDataSources.length})
              </Button>
              <Button 
                variant={selectedFilter === 'permits' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('permits')}
              >
                Permits ({getDataSourcesByType('permits').length})
              </Button>
              <Button 
                variant={selectedFilter === 'environmental' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('environmental')}
              >
                Environmental ({getDataSourcesByType('environmental').length})
              </Button>
              <Button 
                variant={selectedFilter === 'riverside' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('riverside')}
              >
                Riverside County ({getDataSourcesByCoverage('Riverside_County').length})
              </Button>
              <Button 
                variant={selectedFilter === 'sanbernardino' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('sanbernardino')}
              >
                San Bernardino County ({getDataSourcesByCoverage('San_Bernardino_County').length})
              </Button>
            </div>

            {/* Data Sources Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSources.map((source) => (
                <Card key={source.id} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                        <CardDescription>{source.agency}</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2">
                        {renderStatusBadge(source)}
                        {renderReliabilityBadge(source.reliability)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{source.description}</p>
                    
                    {/* Data Types */}
                    <div>
                      <p className="text-sm font-medium mb-2">Data Types:</p>
                      <div className="flex flex-wrap gap-1">
                        {source.dataTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Technical Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Access Method:</p>
                        <p className="text-muted-foreground">{source.accessMethod.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="font-medium">Update Frequency:</p>
                        <p className="text-muted-foreground">{source.updateFrequency.replace('_', ' ')}</p>
                      </div>
                    </div>

                    {/* Test Results */}
                    {testResults[source.id] && (
                      <div className="bg-muted rounded-lg p-3 text-sm">
                        <p className="font-medium">Last Test Result:</p>
                        <p>Response Time: {testResults[source.id].responseTime}ms</p>
                        {testResults[source.id].statusCode && (
                          <p>Status Code: {testResults[source.id].statusCode}</p>
                        )}
                        <p className="text-muted-foreground text-xs mt-1">
                          Tested: {new Date(testResults[source.id].testedAt).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {source.notes && (
                      <div className="text-sm bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium text-blue-900">Notes:</p>
                        <p className="text-blue-800">{source.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleTestSource(source)}
                        disabled={testing === source.id}
                      >
                        <Database className="w-4 h-4 mr-2" />
                        {testing === source.id ? 'Testing...' : 'Test Access'}
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={source.baseUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Source
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Reliability Testing</CardTitle>
                <CardDescription>
                  Test all data sources to assess accessibility and response times
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleTestAllSources} disabled={testing !== null}>
                  Test All Sources ({publicDataSources.length})
                </Button>
                
                {/* Reliability Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{reliabilityScore.high}</div>
                    <p className="text-sm text-muted-foreground">High Reliability</p>
                    <Progress value={(reliabilityScore.high / reliabilityScore.total) * 100} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{reliabilityScore.medium}</div>
                    <p className="text-sm text-muted-foreground">Medium Reliability</p>
                    <Progress value={(reliabilityScore.medium / reliabilityScore.total) * 100} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{reliabilityScore.low}</div>
                    <p className="text-sm text-muted-foreground">Low Reliability</p>
                    <Progress value={(reliabilityScore.low / reliabilityScore.total) * 100} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{reliabilityScore.unknown}</div>
                    <p className="text-sm text-muted-foreground">Unknown</p>
                    <Progress value={(reliabilityScore.unknown / reliabilityScore.total) * 100} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coverage Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(['Riverside_County', 'San_Bernardino_County', 'California', 'Federal'] as const).map((coverage) => {
                      const count = getDataSourcesByCoverage(coverage).length;
                      return (
                        <div key={coverage} className="flex justify-between items-center">
                          <span className="text-sm">{coverage.replace('_', ' ')}</span>
                          <Badge>{count} sources</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Data Type Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Type Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['permits', 'environmental', 'zoning', 'emissions'].map((dataType) => {
                      const count = getDataSourcesByType(dataType).length;
                      return (
                        <div key={dataType} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{dataType}</span>
                          <Badge>{count} sources</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicDataResearch;