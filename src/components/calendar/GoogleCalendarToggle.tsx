import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Calendar, Globe, Key, CalendarClock, AlertCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  checkGoogleCalendarConnection, 
  disconnectGoogleCalendar, 
  getViewGoogleCalendarUrl,
  startGoogleOAuth
} from "@/services/googleCalendar";
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useQueryClient } from '@tanstack/react-query';

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
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();

  // Check if user has connected their Google Calendar
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkGoogleCalendarConnection();
      setIsConnected(connected);
    };
    
    checkConnection();
  }, []);

  const handleToggle = async () => {
    // If turning on Google Calendar but not connected yet
    if (!useGoogleCalendar && !isConnected) {
      setIsConnectDialogOpen(true);
      return;
    }
    
    // Otherwise just toggle the setting
    toggleGoogleCalendar();
    toast.info(
      useGoogleCalendar 
        ? "Switching to local calendar" 
        : "Switching to Google Calendar"
    );
  };

  const handleDaysChange = (value: string) => {
    if (onDaysAheadChange) {
      onDaysAheadChange(parseInt(value));
      toast.info(`Now showing events for the next ${value} days`);
      setIsDateRangeOpen(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const authUrl = await startGoogleOAuth();
      
      if (!authUrl) {
        toast.error("Failed to start Google Calendar authentication");
        return;
      }
      
      // Open the auth URL in a new window/tab
      window.open(authUrl, "_blank");
      
      toast.info(
        "Please complete Google authentication in the new browser tab. Return here when finished.",
        { duration: 8000 }
      );
      
      // We'll check the connection status periodically
      const checkInterval = setInterval(async () => {
        const connected = await checkGoogleCalendarConnection();
        if (connected) {
          setIsConnected(true);
          clearInterval(checkInterval);
          setIsConnecting(false);
          setIsConnectDialogOpen(false);
          
          // Turn on Google Calendar integration
          if (!useGoogleCalendar) {
            toggleGoogleCalendar();
          }
          
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['calendar'] });
          
          toast.success("Successfully connected to Google Calendar!");
        }
      }, 5000); // Check every 5 seconds
      
      // Stop checking after 2 minutes (user might have abandoned the flow)
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!isConnected) {
          setIsConnecting(false);
          toast.error("Connection timeout. Please try again.");
        }
      }, 120000);
      
    } catch (error) {
      console.error("Error connecting to Google Calendar:", error);
      toast.error("Failed to connect to Google Calendar");
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const success = await disconnectGoogleCalendar();
      
      if (success) {
        setIsConnected(false);
        
        // If currently using Google Calendar, switch back to local
        if (useGoogleCalendar) {
          toggleGoogleCalendar();
        }
        
        toast.success("Disconnected from Google Calendar");
      } else {
        toast.error("Failed to disconnect from Google Calendar");
      }
    } catch (error) {
      console.error("Error disconnecting from Google Calendar:", error);
      toast.error("Failed to disconnect from Google Calendar");
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {useGoogleCalendar ? 
              (isConnected ? 
                "Using Google Calendar (click to switch to local)" : 
                "Connect Google Calendar"
              ) : 
              "Using local calendar (click to switch to Google)"
            }
          </TooltipContent>
        </Tooltip>
        
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

        {isConnected && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="text-xs px-1 py-0 bg-green-100 text-green-800 border-green-300">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Your Google Calendar is connected
            </TooltipContent>
          </Tooltip>
        )}

        {googleCalendarError && useGoogleCalendar && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  API Error
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[300px] whitespace-normal">
                Failed to connect to Google Calendar API
              </TooltipContent>
            </Tooltip>
          </>
        )}
        
        <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Google Calendar</DialogTitle>
              <DialogDescription>
                Connect your Google Calendar to view your events directly in the Glee World app.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-sm text-muted-foreground">
                <p>Connecting your Google Calendar allows you to:</p>
                <ul className="list-disc list-inside space-y-1 mt-1 ml-2">
                  <li>View your Google Calendar events in Glee World</li>
                  <li>Manage both Glee Club events and personal events in one place</li>
                  <li>Keep track of all your commitments in a single calendar</li>
                </ul>
                
                <div className="mt-4">
                  <p className="font-semibold">This will:</p>
                  <ul className="list-disc list-inside space-y-1 mt-1 ml-2">
                    <li>Only request read-only access to your calendar</li>
                    <li>Never modify or create events in your Google Calendar</li>
                    <li>You can disconnect at any time</li>
                  </ul>
                </div>
                
                {isConnected === false && (
                  <div className="mt-4 p-2 bg-amber-50 text-amber-800 rounded border border-amber-200">
                    <p className="font-medium">Not Connected</p>
                    <p>Please click Connect to begin the authentication process.</p>
                  </div>
                )}
                
                {isConnected === true && (
                  <div className="mt-4 p-2 bg-green-50 text-green-800 rounded border border-green-200">
                    <p className="font-medium">Already Connected</p>
                    <p>Your Google Calendar is already connected.</p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              {isConnected ? (
                <>
                  <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDisconnect}>Disconnect</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleConnect} disabled={isConnecting}>
                    {isConnecting ? "Connecting..." : "Connect"}
                  </Button>
                </>
              )}
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
        
        {isConnected && (
          <Badge variant={isConnected ? "outline" : "secondary"} className="flex items-center gap-1">
            {isConnected ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-red-600" />
                <span>Disconnected</span>
              </>
            )}
          </Badge>
        )}
        
        {useGoogleCalendar && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={() => window.open(getViewGoogleCalendarUrl(), '_blank')}
            >
              <span>View in Google</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            
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
      </div>
      
      {googleCalendarError && useGoogleCalendar && (
        <div className="text-red-600 text-xs bg-red-50 p-2 rounded border border-red-100">
          {googleCalendarError}
        </div>
      )}
      
      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Google Calendar</DialogTitle>
            <DialogDescription>
              Connect your Google Calendar to view your events directly in the Glee World app.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              <p>Connecting your Google Calendar allows you to:</p>
              <ul className="list-disc list-inside space-y-1 mt-1 ml-2">
                <li>View your Google Calendar events in Glee World</li>
                <li>Manage both Glee Club events and personal events in one place</li>
                <li>Keep track of all your commitments in a single calendar</li>
              </ul>
              
              <div className="mt-4">
                <p className="font-semibold">This will:</p>
                <ul className="list-disc list-inside space-y-1 mt-1 ml-2">
                  <li>Only request read-only access to your calendar</li>
                  <li>Never modify or create events in your Google Calendar</li>
                  <li>You can disconnect at any time</li>
                </ul>
              </div>
              
              {isConnected === false && (
                <div className="mt-4 p-2 bg-amber-50 text-amber-800 rounded border border-amber-200">
                  <p className="font-medium">Not Connected</p>
                  <p>Please click Connect to begin the authentication process.</p>
                </div>
              )}
              
              {isConnected === true && (
                <div className="mt-4 p-2 bg-green-50 text-green-800 rounded border border-green-200">
                  <p className="font-medium">Already Connected</p>
                  <p>Your Google Calendar is already connected.</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            {isConnected ? (
              <>
                <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDisconnect}>Disconnect</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleConnect} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
