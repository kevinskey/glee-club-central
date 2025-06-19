
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Users, Package, Calculator } from 'lucide-react';

export function AttendanceInventoryCalculator() {
  const [attendance, setAttendance] = useState<number>(0);
  const [venueType, setVenueType] = useState<string>('general');
  const [merchRate, setMerchRate] = useState<number>(15);
  const [results, setResults] = useState<any>(null);

  const venueMultipliers = {
    'general': 1.0,
    'college': 1.2,
    'church': 0.8,
    'community': 1.1,
    'festival': 1.5,
    'outdoor': 1.3
  };

  const merchandiseTypes = [
    { name: 'T-Shirts', baseRate: 0.15, sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { name: 'Hoodies', baseRate: 0.08, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { name: 'Tote Bags', baseRate: 0.12, sizes: ['One Size'] },
    { name: 'Mugs', baseRate: 0.06, sizes: ['One Size'] },
    { name: 'Programs', baseRate: 0.25, sizes: ['One Size'] }
  ];

  const calculateInventory = () => {
    const multiplier = venueMultipliers[venueType as keyof typeof venueMultipliers] || 1.0;
    const adjustedRate = merchRate / 100;
    
    const calculations = merchandiseTypes.map(item => {
      const baseQuantity = Math.ceil(attendance * item.baseRate * multiplier * adjustedRate);
      
      const sizeBreakdown = item.sizes.reduce((acc, size) => {
        let percentage = 0.2; // Default 20% per size
        
        // Adjust percentages for common sizing
        if (size === 'M') percentage = 0.25;
        else if (size === 'L') percentage = 0.25;
        else if (size === 'S') percentage = 0.2;
        else if (size === 'XL') percentage = 0.15;
        else if (size === 'XS' || size === 'XXL') percentage = 0.075;
        else if (size === 'One Size') percentage = 1.0;
        
        acc[size] = Math.ceil(baseQuantity * percentage);
        return acc;
      }, {} as Record<string, number>);
      
      return {
        name: item.name,
        totalQuantity: baseQuantity,
        sizeBreakdown
      };
    });
    
    setResults({
      totalAttendance: attendance,
      venue: venueType,
      merchRate: merchRate,
      calculations
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Attendance to Inventory Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="attendance">Expected Attendance</Label>
            <Input
              id="attendance"
              type="number"
              value={attendance}
              onChange={(e) => setAttendance(Number(e.target.value))}
              placeholder="500"
            />
          </div>
          <div className="space-y-2">
            <Label>Venue Type</Label>
            <Select value={venueType} onValueChange={setVenueType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="college">College/University</SelectItem>
                <SelectItem value="church">Church</SelectItem>
                <SelectItem value="community">Community Center</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
                <SelectItem value="outdoor">Outdoor Venue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="merchRate">Merchandise Purchase Rate (%)</Label>
          <Input
            id="merchRate"
            type="number"
            value={merchRate}
            onChange={(e) => setMerchRate(Number(e.target.value))}
            placeholder="15"
            min="1"
            max="100"
          />
        </div>
        
        <Button onClick={calculateInventory} className="w-full">
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Inventory Needs
        </Button>
        
        {results && (
          <div className="mt-6 space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Inventory Recommendations</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Based on {results.totalAttendance} attendees at a {results.venue} venue 
                with {results.merchRate}% purchase rate
              </p>
              
              <div className="space-y-3">
                {results.calculations.map((item: any) => (
                  <div key={item.name} className="border rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-bold">{item.totalQuantity} total</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {Object.entries(item.sizeBreakdown).map(([size, qty]) => (
                        <div key={size} className="flex justify-between">
                          <span>{size}:</span>
                          <span>{qty as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
