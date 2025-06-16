/**
 * Warehouse Detail Page - Shows comprehensive information about a specific warehouse
 * Includes health and financial impacts, developer info, and consultation CTAs
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Share, Heart, DollarSign, Bot } from 'lucide-react';
import { warehouseData } from '../data/warehouses';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import EngageModal from '../components/EngageModal';
import StatusBadge from '../components/StatusBadge';

const WarehouseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('health');
  const [isEngageModalOpen, setIsEngageModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Find the warehouse data
  const warehouse = warehouseData.find(w => w.id === id);
  
  if (!warehouse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Warehouse not found</p>
      </div>
    );
  }


  // Get warehouse image based on name
  const getWarehouseImage = (name: string) => {
    if (name.includes('Sycamore Hills')) {
      return '/images/warehouses/Warehouse-XL.png';
    } else if (name.includes('West Meridian')) {
      return '/images/warehouses/Warehouse-L.png';
    } else if (name.includes('Bloomington')) {
      return '/images/warehouses/Warehouse-M.png';
    } else if (name.includes('Amazon')) {
      return '/images/warehouses/Warehouse-L.png';
    }
    return '/images/warehouses/Warehouse-M.png';
  };

  // Sample data for metrics (in real app this would come from API)
  const healthMetrics = {
    traffic: {
      value: '25 trucks per day',
      description: 'This could add 10 minutes to your commute, according to our models.'
    },
    pollution: {
      value: '10 tons per day',
      description: 'Based on your distance, equal to smoking 2.3 cigarettes a day.'
    },
    noise: {
      value: '67 db per day',
      description: 'Imagine a vacuum running right outside your door.'
    }
  };

  const moneyMetrics = {
    jobs: {
      value: '250 jobs created',
      permanent: 175,
      temporary: 75,
      description: "That's as many jobs as a large grocery store or small hospital."
    },
    wage: {
      value: '$17-19 per hour',
      description: "That's about $19,300 less than the average wage in San Bernardino."
    },
    tax: {
      value: '$1.6M per year',
      description: "That's enough to fund about 3 public school teachers each year."
    }
  };

  // Handle scroll for collapsible header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className={`sticky top-0 bg-white border-b border-border z-10 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            {isScrolled ? (
              /* Collapsed header content */
              <div className="space-y-1">
                <h1 className="text-lg font-semibold">{warehouse.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>About {Math.round((warehouse.distanceFromUser || 0.21) * 5280)} feet from you</span>
                  <span>•</span>
                  <span>{warehouse.address}</span>
                </div>
              </div>
            ) : (
              <h1 className="text-lg font-semibold">Warehouse details</h1>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-24">
        {/* Warehouse Header - only show when not scrolled */}
        <div className={`transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'py-6 opacity-100'}`}>
          <h1 className="text-2xl font-bold mb-2">{warehouse.name}</h1>
          <p className="text-sm text-muted-foreground mb-1">
            About {Math.round((warehouse.distanceFromUser || 0.21) * 5280)} feet from you
          </p>
          <p className="text-sm text-muted-foreground mb-3">{warehouse.address}</p>
          
          {/* Status Badge */}
          <StatusBadge status={warehouse.status} />
        </div>

        {/* Developer + Size Section */}
        <div className="bg-white rounded-lg border border-border p-4 mb-6 flex items-center space-x-4">
          <img 
            src={getWarehouseImage(warehouse.name)}
            alt={warehouse.name}
            className="w-16 h-12 object-cover rounded-md bg-gray-100"
          />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Developer</p>
            <p className="font-medium">Ruth Villalobos & Associated Inc.</p>
            <p className="text-sm text-muted-foreground mt-1">Project size</p>
            <p className="font-medium">603,100 square feet</p>
          </div>
        </div>

        {/* Builder Summary */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Builder summary</h3>
          <p className="text-sm text-muted-foreground">
            This project is 16% larger than other projects nearby and is expected to create 400 packing jobs.
          </p>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Your health
            </TabsTrigger>
            <TabsTrigger value="money" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Your money
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-4">
            {/* Traffic Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-inactive">Traffic added to your streets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">{healthMetrics.traffic.value}</p>
                <p className="text-sm text-muted-foreground">
                  This could <span className="text-urgent-citrus font-medium">add 10 minutes</span> to your commute, according to our models.
                </p>
              </CardContent>
            </Card>

            {/* Pollution Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-inactive">Pollution added to your air, CO2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">{healthMetrics.pollution.value}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your distance, equal to smoking <span className="text-urgent-citrus font-medium">2.3 cigarettes</span> a day.
                </p>
              </CardContent>
            </Card>

            {/* Noise Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-inactive">Daily noise near your home</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">{healthMetrics.noise.value}</p>
                <p className="text-sm text-muted-foreground">{healthMetrics.noise.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="money" className="space-y-4">
            {/* Jobs Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-inactive">Jobs created</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-3">{moneyMetrics.jobs.value}</p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>{moneyMetrics.jobs.permanent} permanent</span>
                    <span>{moneyMetrics.jobs.temporary} temporary</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{moneyMetrics.jobs.description}</p>
              </CardContent>
            </Card>

            {/* Wage Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-inactive">Wage for most jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">{moneyMetrics.wage.value}</p>
                <p className="text-sm text-muted-foreground">
                  That's about <span className="text-urgent-citrus font-medium">$19,300 less</span> than the average wage in San Bernardino.
                </p>
              </CardContent>
            </Card>

            {/* Tax Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-inactive">Tax gain per year</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">{moneyMetrics.tax.value}</p>
                <p className="text-sm text-muted-foreground">{moneyMetrics.tax.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Personalized Report Promo */}
        <Card className="bg-soft-citrus border-urgent-citrus mb-6">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-3">
              Go beyond these numbers and get a personalized report
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              We'll check your age, weight, and distance to summarize in-depth what this project means for you.
            </p>
            <Button variant="primary" size="lg" className="w-full">
              Start consultation →
            </Button>
          </CardContent>
        </Card>

        {/* Ask Your Builder Q&A */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Ask your Builder</h3>
          <div className="space-y-2">
            <Button variant="tertiary" size="sm" className="w-full justify-start text-left h-auto py-3">
              Where did you get this information?
            </Button>
            <Button variant="tertiary" size="sm" className="w-full justify-start text-left h-auto py-3">
              What is San Bernardino's plan to invest the tax revenue?
            </Button>
            <Button variant="tertiary" size="sm" className="w-full justify-start text-left h-auto py-3">
              Can I read the environmental report?
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button Row */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
        <div className="flex gap-3 overflow-x-auto">
          <Button variant="primary" size="sm" className="flex-shrink-0">
            <Bot className="w-4 h-4 mr-2" />
            Ask your Builder
          </Button>
          <Button 
            variant="secondary-custom" 
            size="sm" 
            className="flex-shrink-0"
            onClick={() => setIsEngageModalOpen(true)}
          >
            <Bell className="w-4 h-4 mr-2" />
            Engage
          </Button>
          <Button variant="tertiary" size="sm" className="flex-shrink-0">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Engage Modal */}
      <EngageModal 
        warehouse={warehouse}
        isOpen={isEngageModalOpen}
        onClose={() => setIsEngageModalOpen(false)}
      />
    </div>
  );
};

export default WarehouseDetail;