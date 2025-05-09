
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Calendar, Globe, Key, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getViewGoogleCalendarUrl } from "@/utils/googleCalendar";
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GoogleCalendarToggleProps {
  useGoogleCalendar: boolean;
  toggleGoogleCalendar: () => void;
  googleCalendarError?: string | null;
  compact?: boolean; // For compact display in smaller UI areas
  daysAhead?: number;
  onDaysAheadChange?: (days: number) => void;
}

export const GoogleCalendarToggle = ({ 
  useGoogleCalendar, 
  toggleGoogleCalendar,
  googleCalendarError,
  compact = false,
  daysAhead = 90,
  onDaysAheadChange
}: GoogleCalendarToggleProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  
  const handleToggle = () => {
    toggleGoogleCalendar();
    toast.info(
      useGoogleCalendar 
        ? "Switching to local calendar" 
        : "Switching to Google Calendar"
    );
  };

  const handleKeyConfigClick = () => {
    setIsDialogOpen(true);
  };

  const handleDaysChange = (value: string) => {
    if (onDaysAheadChange) {
      onDaysAheadChange(parseInt(value));
      toast.info(`Now showing events for the next ${value} days`);
      setIsDateRangeOpen(false);
    }
  };

  const handleSaveKey = () => {
    // In a real app, we would save this key securely
    // For now we'll just show a toast to simulate saving
    toast.success("API Key configuration would be saved in a real app");
    setIsDialogOpen(false);
    
    // Note: In a production app, we would store this in a secure way
    // and reload the calendar data
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-8 px-3 flex items-center gap-1 ${useGoogleCalendar ? 'bg-glee-purple text-white hover:bg-glee-purple/90' : 'bg-transparent'}`}
          onClick={handleToggle}
        >
          {useGoogleCalendar ? (
            <>
              <Globe className="h-3 w-3" />
              <span className="text-xs">Google</span>
            </>
          ) : (
            <>
              <Calendar className="h-3 w-3" />
              <span className="text-xs">Local</span>
            </>
          )}
        </Button>
        
        {useGoogleCalendar && (
          <Dialog open={isDateRangeOpen} onOpenChange={setIsDateRangeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-3 flex items-center gap-1">
                <CalendarClock className="h-3 w-3" />
                <span className="text-xs">{daysAhead} days</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Date Range</DialogTitle>
                <DialogDescription>
                  Select how many days ahead to show in your calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="days-ahead" className="text-right">
                    Days
                  </Label>
                  <Select
                    defaultValue={daysAhead.toString()}
                    onValueChange={handleDaysChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select days ahead" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Range</SelectLabel>
                        <SelectItem value="30">Next 30 days</SelectItem>
                        <SelectItem value="60">Next 60 days</SelectItem>
                        <SelectItem value="90">Next 90 days</SelectItem>
                        <SelectItem value="180">Next 6 months</SelectItem>
                        <SelectItem value="365">Next year</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {googleCalendarError && useGoogleCalendar && (
          <>
            <Badge variant="destructive" className="text-xs px-1 py-0">API Error</Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleKeyConfigClick}>
              <Key className="h-3 w-3" />
            </Button>
          </>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure Google Calendar API</DialogTitle>
              <DialogDescription>
                Enter your Google Calendar API key to connect to your calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Google Calendar API Key</Label>
                <Input
                  id="api-key"
                  placeholder="Enter your Google Calendar API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>You can get your API key from the Google Cloud Console.</p>
                <p>Make sure the Google Calendar API is enabled for your project.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveKey}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Non-compact version
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {useGoogleCalendar ? (
            <Badge variant="outline" className="flex items-center gap-1 bg-glee-purple/10 text-glee-purple border-glee-purple/50 px-2 py-0.5">
              <Globe className="h-3 w-3 mr-1" />
              <span className="text-xs">Google Calendar</span>
            </Badge>
          ) : (
            <span className="text-sm font-medium">Google Calendar</span>
          )}
          <Switch 
            checked={useGoogleCalendar} 
            onCheckedChange={handleToggle} 
            className="data-[state=checked]:bg-glee-purple"
          />
        </div>
        
        {useGoogleCalendar && (
          <div className="flex items-center gap-2">
            {!googleCalendarError && (
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => window.open(getViewGoogleCalendarUrl(), '_blank')}
              >
                <span>View in Google</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            
            <Dialog open={isDateRangeOpen} onOpenChange={setIsDateRangeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <CalendarClock className="h-4 w-4 mr-1" />
                  <span>Next {daysAhead} days</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Date Range</DialogTitle>
                  <DialogDescription>
                    Select how many days ahead to show in your calendar.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="days-ahead" className="text-right">
                      Days
                    </Label>
                    <Select
                      defaultValue={daysAhead.toString()}
                      onValueChange={handleDaysChange}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select days ahead" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Range</SelectLabel>
                          <SelectItem value="30">Next 30 days</SelectItem>
                          <SelectItem value="60">Next 60 days</SelectItem>
                          <SelectItem value="90">Next 90 days</SelectItem>
                          <SelectItem value="180">Next 6 months</SelectItem>
                          <SelectItem value="365">Next year</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        {useGoogleCalendar && googleCalendarError && (
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            onClick={handleKeyConfigClick}
          >
            <Key className="h-4 w-4 mr-1" />
            <span>Configure API Key</span>
          </Button>
        )}
      </div>
      
      {googleCalendarError && useGoogleCalendar && (
        <div className="text-destructive text-xs flex items-center gap-1">
          <span className="font-medium">Error:</span> 
          <span>Google Calendar API key invalid. Please check configuration.</span>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Google Calendar API</DialogTitle>
            <DialogDescription>
              Enter your Google Calendar API key to connect to your calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Google Calendar API Key</Label>
              <Input
                id="api-key"
                placeholder="Enter your Google Calendar API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>You can get your API key from the Google Cloud Console.</p>
              <p>Make sure the Google Calendar API is enabled for your project.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveKey}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
