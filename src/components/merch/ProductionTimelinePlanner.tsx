
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';

export function ProductionTimelinePlanner() {
  const [eventDate, setEventDate] = useState<string>('');
  const [itemType, setItemType] = useState<string>('tshirt');
  const [quantity, setQuantity] = useState<number>(0);
  const [printMethod, setPrintMethod] = useState<string>('dtf');
  const [timeline, setTimeline] = useState<any>(null);

  const productionTimes = {
    'tshirt': {
      design: 2,
      approval: 1,
      blanks: 3,
      dtf: 2,
      screenprint: 4,
      embroidery: 5,
      assembly: 1
    },
    'hoodie': {
      design: 3,
      approval: 1,
      blanks: 5,
      dtf: 3,
      screenprint: 5,
      embroidery: 7,
      assembly: 1
    },
    'totebag': {
      design: 2,
      approval: 1,
      blanks: 2,
      dtf: 2,
      screenprint: 3,
      embroidery: 4,
      assembly: 1
    },
    'mug': {
      design: 2,
      approval: 1,
      blanks: 4,
      sublimation: 3,
      assembly: 1
    }
  };

  const generateTimeline = () => {
    if (!eventDate) return;
    
    const event = parseISO(eventDate);
    const item = productionTimes[itemType as keyof typeof productionTimes];
    
    // Adjust times based on quantity
    let quantityMultiplier = 1;
    if (quantity > 100) quantityMultiplier = 1.5;
    else if (quantity > 50) quantityMultiplier = 1.2;
    
    // Calculate production time based on print method
    let printTime = item[printMethod as keyof typeof item] || item.dtf;
    if (printMethod === 'rush') {
      printTime = Math.ceil(printTime * 0.6); // Rush reduces time by 40%
    }
    
    const totalTime = Math.ceil(
      (item.design + item.approval + item.blanks + printTime + item.assembly) * quantityMultiplier
    );
    
    // Work backwards from event date
    const startDate = addDays(event, -totalTime);
    const designCompleteDate = addDays(startDate, item.design);
    const approvalDate = addDays(designCompleteDate, item.approval);
    const blanksArriveDate = addDays(startDate, item.blanks);
    const printCompleteDate = addDays(blanksArriveDate, printTime);
    const finalDate = addDays(printCompleteDate, item.assembly);
    
    // Check if timeline is feasible
    const today = new Date();
    const isFeasible = startDate >= today;
    const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    setTimeline({
      totalDays: totalTime,
      startDate: format(startDate, 'MMM dd, yyyy'),
      designComplete: format(designCompleteDate, 'MMM dd, yyyy'),
      approvalComplete: format(approvalDate, 'MMM dd, yyyy'),
      blanksArrive: format(blanksArriveDate, 'MMM dd, yyyy'),
      printComplete: format(printCompleteDate, 'MMM dd, yyyy'),
      finalComplete: format(finalDate, 'MMM dd, yyyy'),
      eventDate: format(event, 'MMM dd, yyyy'),
      isFeasible,
      daysUntilStart,
      urgency: daysUntilStart < 3 ? 'critical' : daysUntilStart < 7 ? 'urgent' : 'normal'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Production Timeline Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Item Type</Label>
            <Select value={itemType} onValueChange={setItemType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tshirt">T-Shirt</SelectItem>
                <SelectItem value="hoodie">Hoodie</SelectItem>
                <SelectItem value="totebag">Tote Bag</SelectItem>
                <SelectItem value="mug">Mug</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="50"
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label>Print Method</Label>
            <Select value={printMethod} onValueChange={setPrintMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dtf">DTF Transfer</SelectItem>
                <SelectItem value="screenprint">Screen Print</SelectItem>
                <SelectItem value="embroidery">Embroidery</SelectItem>
                {itemType === 'mug' && <SelectItem value="sublimation">Sublimation</SelectItem>}
                <SelectItem value="rush">Rush Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={generateTimeline} className="w-full">
          <Clock className="h-4 w-4 mr-2" />
          Generate Production Timeline
        </Button>
        
        {timeline && (
          <div className="mt-6 space-y-4">
            <div className={`p-4 rounded-lg ${
              timeline.isFeasible 
                ? timeline.urgency === 'critical' 
                  ? 'bg-red-50 border border-red-200' 
                  : timeline.urgency === 'urgent'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {timeline.isFeasible ? (
                  <CheckCircle className={`h-5 w-5 ${
                    timeline.urgency === 'critical' ? 'text-red-600' :
                    timeline.urgency === 'urgent' ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                ) : (
                  <Clock className="h-5 w-5 text-red-600" />
                )}
                <h4 className="font-semibold">
                  {timeline.isFeasible ? 'Production Timeline' : 'Timeline Not Feasible'}
                </h4>
              </div>
              
              {!timeline.isFeasible && (
                <p className="text-red-600 text-sm mb-3">
                  This timeline requires starting {Math.abs(timeline.daysUntilStart)} days ago. 
                  Consider rush options or simplified designs.
                </p>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Production Start:</span>
                  <span>{timeline.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Design Complete:</span>
                  <span>{timeline.designComplete}</span>
                </div>
                <div className="flex justify-between">
                  <span>Approval Complete:</span>
                  <span>{timeline.approvalComplete}</span>
                </div>
                <div className="flex justify-between">
                  <span>Blanks Arrive:</span>
                  <span>{timeline.blanksArrive}</span>
                </div>
                <div className="flex justify-between">
                  <span>Printing Complete:</span>
                  <span>{timeline.printComplete}</span>
                </div>
                <div className="flex justify-between">
                  <span>Final Assembly:</span>
                  <span>{timeline.finalComplete}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Event Date:</span>
                  <span>{timeline.eventDate}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Production Time:</span>
                  <span>{timeline.totalDays} business days</span>
                </div>
              </div>
              
              {timeline.isFeasible && timeline.urgency !== 'normal' && (
                <div className="mt-3 p-2 bg-white rounded text-xs">
                  <strong>
                    {timeline.urgency === 'critical' ? 'Critical Timeline:' : 'Urgent Timeline:'} 
                  </strong>
                  {timeline.urgency === 'critical' 
                    ? ' Consider rush production options and simplified designs.'
                    : ' Limited time for revisions. Finalize designs quickly.'
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
