/**
 * Data Explorer Component - Investigation tool for WAREHOUSE CITY API
 * This component helps us understand the data structure and available endpoints
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from './ui/use-toast';

interface ApiResponse {
  url: string;
  status: number;
  data: any;
  error?: string;
  timestamp: string;
}

const DataExplorer: React.FC = () => {
  const [responses, setResponses] = useState<ApiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const { toast } = useToast();

  // Known WAREHOUSE CITY endpoints to investigate
  const knownEndpoints = [
    'https://radicalresearch.shinyapps.io/WarehouseCITY/',
    'https://radicalresearch.shinyapps.io/WarehouseCITY/data',
    'https://radicalresearch.shinyapps.io/WarehouseCITY/api',
    'https://radicalresearch.shinyapps.io/WarehouseCITY/session',
  ];

  const makeRequest = async (url: string) => {
    setLoading(true);
    try {
      // Try different request methods and headers
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/html, */*',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      let data: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        // Try to extract any JSON from HTML if it's a Shiny app
        const jsonMatch = text.match(/window\.__DATA__\s*=\s*({.*?});/);
        if (jsonMatch) {
          try {
            data = { extracted_json: JSON.parse(jsonMatch[1]), html_length: text.length };
          } catch {
            data = { html_content: text.substring(0, 1000) + '...', full_length: text.length };
          }
        } else {
          data = { html_content: text.substring(0, 1000) + '...', full_length: text.length };
        }
      }

      const apiResponse: ApiResponse = {
        url,
        status: response.status,
        data,
        timestamp: new Date().toISOString(),
      };

      setResponses(prev => [apiResponse, ...prev]);
      toast({
        title: "Request Completed",
        description: `${response.status} response from ${url}`,
      });

    } catch (error) {
      const apiResponse: ApiResponse = {
        url,
        status: 0,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };

      setResponses(prev => [apiResponse, ...prev]);
      toast({
        title: "Request Failed",
        description: `Error fetching ${url}: ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exploreKnownEndpoints = async () => {
    for (const endpoint of knownEndpoints) {
      await makeRequest(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const exploreCustomUrl = () => {
    if (customUrl.trim()) {
      makeRequest(customUrl.trim());
    }
  };

  const clearResults = () => {
    setResponses([]);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>WAREHOUSE CITY Data Explorer</CardTitle>
          <p className="text-sm text-muted-foreground">
            Investigate WAREHOUSE CITY's data structure and available endpoints
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={exploreKnownEndpoints} 
              disabled={loading}
              variant="default"
            >
              {loading ? 'Exploring...' : 'Explore Known Endpoints'}
            </Button>
            <Button onClick={clearResults} variant="outline">
              Clear Results
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter custom URL to test..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && exploreCustomUrl()}
            />
            <Button onClick={exploreCustomUrl} disabled={loading || !customUrl.trim()}>
              Test URL
            </Button>
          </div>
        </CardContent>
      </Card>

      {responses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>API Investigation Results ({responses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {responses.map((response, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={response.status === 200 ? "default" : "destructive"}>
                            {response.status || 'ERROR'}
                          </Badge>
                          <span className="font-mono text-sm">{response.url}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="data" className="w-full">
                        <TabsList>
                          <TabsTrigger value="data">Data</TabsTrigger>
                          <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        </TabsList>
                        <TabsContent value="data">
                          <ScrollArea className="h-40">
                            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                              {response.error 
                                ? `ERROR: ${response.error}`
                                : JSON.stringify(response.data, null, 2)
                              }
                            </pre>
                          </ScrollArea>
                        </TabsContent>
                        <TabsContent value="analysis">
                          <div className="text-sm space-y-2">
                            {response.error ? (
                              <p className="text-destructive">Request failed: {response.error}</p>
                            ) : (
                              <>
                                <p><strong>Status:</strong> {response.status}</p>
                                <p><strong>Data Type:</strong> {typeof response.data}</p>
                                {response.data && typeof response.data === 'object' && (
                                  <p><strong>Keys:</strong> {Object.keys(response.data).join(', ')}</p>
                                )}
                                {response.data?.html_content && (
                                  <p><strong>HTML Length:</strong> {response.data.full_length} characters</p>
                                )}
                              </>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Investigation Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2 text-muted-foreground">
            <p><strong>What we're looking for:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>JSON API endpoints that return warehouse data</li>
              <li>Data structure and field names</li>
              <li>Geographic coordinates (latitude/longitude)</li>
              <li>Warehouse status, size, operator information</li>
              <li>Any authentication or CORS requirements</li>
            </ul>
            <p className="mt-4"><strong>Current app data needs:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>id, name, address, latitude, longitude</li>
              <li>status: 'upcoming' | 'in-construction' | 'operating' | 'dormant'</li>
              <li>impactStat: community impact description</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExplorer;