import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Calendar,
  Users,
  MapPin,
  MessageCircle,
  Music,
  Shirt,
  Settings,
  Ticket,
  CheckCircle,
  FileText,
  ClipboardList,
  UserCheck,
  Clock,
  BookOpen,
  Package,
  User,
  Route,
  Plane,
  DollarSign,
  Target,
  Heart,
  Gift,
  Gamepad2,
  Utensils,
  List,
  PenTool,
  HandHeart,
  Scale,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Info,
  Plus,
} from 'lucide-react';
import { 
  EVENT_TYPES, 
  EventType, 
  getModulesForEventType, 
  PlannerModule 
} from '@/utils/gleePlannerModules';

// Icon mapping
const iconMap = {
  Calendar,
  Users,
  MapPin,
  MessageCircle,
  Music,
  Shirt,
  Settings,
  Ticket,
  CheckCircle,
  FileText,
  ClipboardList,
  UserCheck,
  Clock,
  BookOpen,
  Package,
  User,
  Route,
  Plane,
  DollarSign,
  Target,
  Heart,
  Gift,
  Gamepad2,
  Utensils,
  List,
  PenTool,
  HandHeart,
  Scale,
  CreditCard,
};

interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  [key: string]: any;
}

function GleePlannerPageContent() {
  const [selectedEventType, setSelectedEventType] = useState<EventType | ''>('');
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    date: '',
    location: '',
    description: '',
  });
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['event-info']));
  const [enabledModules, setEnabledModules] = useState<Set<string>>(new Set());

  const modules = selectedEventType ? getModulesForEventType(selectedEventType) : [];

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const toggleModuleEnabled = (moduleId: string) => {
    setEnabledModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const updateEventData = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const renderModuleIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <Calendar className="h-4 w-4" />;
  };

  const isModuleVisible = (module: PlannerModule) => {
    return module.required || enabledModules.has(module.id);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <PageHeader 
          title="Glee Planner" 
          description="Plan and organize events with smart module-based workflow."
        />

        {/* Event Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Event Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedEventType} onValueChange={(value: EventType) => setSelectedEventType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose the type of event you're planning..." />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Preview Summary Banner */}
        {selectedEventType && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {eventData.title || 'Untitled Event'} 
                    <Badge variant="outline" className="ml-2">
                      {EVENT_TYPES.find(t => t.value === selectedEventType)?.label}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {eventData.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {eventData.date}
                      </span>
                    )}
                    {eventData.location && (
                      <span className="flex items-center gap-1 ml-4">
                        <MapPin className="h-3 w-3" />
                        {eventData.location}
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {modules.filter(m => isModuleVisible(m)).length} Active Modules
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {modules.filter(m => m.required).length} required
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Planning Modules */}
        {selectedEventType && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Planning Modules</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Module
              </Button>
            </div>

            {modules.map((module) => {
              const isVisible = isModuleVisible(module);
              const isExpanded = expandedModules.has(module.id);

              return (
                <Card key={module.id} className={!isVisible ? 'opacity-50' : ''}>
                  <Collapsible open={isExpanded} onOpenChange={() => toggleModule(module.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {renderModuleIcon(module.icon)}
                            <div>
                              <CardTitle className="text-base flex items-center gap-2">
                                {module.title}
                                {module.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                                {!isVisible && (
                                  <Badge variant="secondary" className="text-xs">
                                    Hidden
                                  </Badge>
                                )}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {module.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!module.required && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        checked={enabledModules.has(module.id)}
                                        onCheckedChange={() => toggleModuleEnabled(module.id)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Toggle module visibility</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{module.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    {isVisible && (
                      <CollapsibleContent>
                        <CardContent>
                          {module.id === 'event-info' && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="title">Event Title</Label>
                                  <Input
                                    id="title"
                                    value={eventData.title}
                                    onChange={(e) => updateEventData('title', e.target.value)}
                                    placeholder="Enter event title..."
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="date">Event Date</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={eventData.date}
                                    onChange={(e) => updateEventData('date', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                  id="description"
                                  value={eventData.description}
                                  onChange={(e) => updateEventData('description', e.target.value)}
                                  placeholder="Describe the event..."
                                  rows={3}
                                />
                              </div>
                            </div>
                          )}

                          {module.id === 'location' && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="location">Venue Name</Label>
                                <Input
                                  id="location"
                                  value={eventData.location}
                                  onChange={(e) => updateEventData('location', e.target.value)}
                                  placeholder="Enter venue name..."
                                />
                              </div>
                              <div>
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                  id="address"
                                  placeholder="Enter full address..."
                                  rows={2}
                                />
                              </div>
                            </div>
                          )}

                          {/* Placeholder content for other modules */}
                          {!['event-info', 'location'].includes(module.id) && (
                            <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
                              <p className="text-muted-foreground">
                                {module.title} module content will be implemented here
                              </p>
                            </div>
                          )}

                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              Reset
                            </Button>
                            <Button size="sm">
                              Save Progress
                            </Button>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        )}

        {!selectedEventType && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-32 space-y-2">
              <Calendar className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground text-center">
                Select an event type above to begin planning
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function GleePlannerPage() {
  return <GleePlannerPageContent />;
}
