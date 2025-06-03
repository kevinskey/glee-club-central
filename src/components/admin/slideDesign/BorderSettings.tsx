
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { BorderAll } from 'lucide-react';

interface BorderSettingsProps {
  showBorders: boolean;
  onShowBordersChange: (show: boolean) => void;
  borderStyle: {
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
  onBorderStyleChange: (style: {
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  }) => void;
}

export function BorderSettings({
  showBorders,
  onShowBordersChange,
  borderStyle,
  onBorderStyleChange
}: BorderSettingsProps) {
  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BorderAll className="h-4 w-4" />
          Element Borders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-borders" className="text-sm">Show Borders</Label>
          <Switch
            id="show-borders"
            checked={showBorders}
            onCheckedChange={onShowBordersChange}
          />
        </div>

        {showBorders && (
          <>
            <Separator />
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Border Width</Label>
                <Slider
                  value={[borderStyle.width]}
                  onValueChange={(value) => 
                    onBorderStyleChange({ ...borderStyle, width: value[0] })
                  }
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {borderStyle.width}px
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="border-color" className="text-xs">Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="border-color"
                    type="color"
                    value={borderStyle.color}
                    onChange={(e) => 
                      onBorderStyleChange({ ...borderStyle, color: e.target.value })
                    }
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    value={borderStyle.color}
                    onChange={(e) => 
                      onBorderStyleChange({ ...borderStyle, color: e.target.value })
                    }
                    placeholder="#000000"
                    className="flex-1 h-8 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Border Style</Label>
                <Select 
                  value={borderStyle.style} 
                  onValueChange={(value: 'solid' | 'dashed' | 'dotted') => 
                    onBorderStyleChange({ ...borderStyle, style: value })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-2 border rounded-md bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Preview:</div>
                <div 
                  className="w-full h-8 bg-white rounded"
                  style={{
                    border: `${borderStyle.width}px ${borderStyle.style} ${borderStyle.color}`
                  }}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
