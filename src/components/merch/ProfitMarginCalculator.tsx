
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign } from 'lucide-react';

export function ProfitMarginCalculator() {
  const [blankCost, setBlankCost] = useState<number>(0);
  const [printingCost, setPrintingCost] = useState<number>(0);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [results, setResults] = useState<any>(null);

  const calculateProfitMargin = () => {
    const totalCost = blankCost + printingCost + laborCost;
    const profit = sellingPrice - totalCost;
    const profitMargin = totalCost > 0 ? (profit / sellingPrice) * 100 : 0;
    const markup = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    
    // Suggested pricing tiers
    const suggestedPrices = {
      conservative: totalCost * 2.0,    // 50% margin
      standard: totalCost * 2.5,       // 60% margin
      premium: totalCost * 3.0         // 67% margin
    };
    
    setResults({
      totalCost: totalCost.toFixed(2),
      profit: profit.toFixed(2),
      profitMargin: profitMargin.toFixed(1),
      markup: markup.toFixed(1),
      suggestedPrices: {
        conservative: suggestedPrices.conservative.toFixed(2),
        standard: suggestedPrices.standard.toFixed(2),
        premium: suggestedPrices.premium.toFixed(2)
      },
      breakdownPercentages: {
        blank: ((blankCost / totalCost) * 100).toFixed(1),
        printing: ((printingCost / totalCost) * 100).toFixed(1),
        labor: ((laborCost / totalCost) * 100).toFixed(1)
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Profit Margin Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="blankCost">Blank Item Cost</Label>
            <Input
              id="blankCost"
              type="number"
              step="0.01"
              value={blankCost}
              onChange={(e) => setBlankCost(Number(e.target.value))}
              placeholder="5.50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="printingCost">Printing Cost</Label>
            <Input
              id="printingCost"
              type="number"
              step="0.01"
              value={printingCost}
              onChange={(e) => setPrintingCost(Number(e.target.value))}
              placeholder="3.25"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="laborCost">Labor/Setup Cost</Label>
            <Input
              id="laborCost"
              type="number"
              step="0.01"
              value={laborCost}
              onChange={(e) => setLaborCost(Number(e.target.value))}
              placeholder="1.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sellingPrice">Proposed Selling Price</Label>
            <Input
              id="sellingPrice"
              type="number"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              placeholder="20.00"
            />
          </div>
        </div>
        
        <Button onClick={calculateProfitMargin} className="w-full">
          <DollarSign className="h-4 w-4 mr-2" />
          Calculate Profit Margin
        </Button>
        
        {results && (
          <div className="mt-6 space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Profit Analysis</h4>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span>${results.totalCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selling Price:</span>
                  <span>${sellingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Profit per Item:</span>
                  <span className={Number(results.profit) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${results.profit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <span className={Number(results.profitMargin) >= 50 ? 'text-green-600' : 'text-yellow-600'}>
                    {results.profitMargin}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Markup:</span>
                  <span>{results.markup}%</span>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h5 className="font-medium mb-2">Cost Breakdown:</h5>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Blank ({results.breakdownPercentages.blank}%):</span>
                    <span>${blankCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Printing ({results.breakdownPercentages.printing}%):</span>
                    <span>${printingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor ({results.breakdownPercentages.labor}%):</span>
                    <span>${laborCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <h5 className="font-medium mb-2">Suggested Pricing:</h5>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Conservative (50% margin):</span>
                    <span>${results.suggestedPrices.conservative}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard (60% margin):</span>
                    <span>${results.suggestedPrices.standard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium (67% margin):</span>
                    <span>${results.suggestedPrices.premium}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
