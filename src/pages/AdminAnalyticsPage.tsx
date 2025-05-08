
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { 
  BarChart3, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  Users, 
  CreditCard,
  Music,
  PieChart,
  LineChart,
  Clock
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

// Mock data for charts
const attendanceData = [
  { month: "Jan", value: 85 },
  { month: "Feb", value: 78 },
  { month: "Mar", value: 92 },
  { month: "Apr", value: 88 },
  { month: "May", value: 95 }
];

const duesCollection = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 72 },
  { month: "Mar", value: 83 },
  { month: "Apr", value: 87 },
  { month: "May", value: 92 }
];

const voicePartDistribution = [
  { name: "Soprano 1", value: 12 },
  { name: "Soprano 2", value: 11 },
  { name: "Alto 1", value: 10 },
  { name: "Alto 2", value: 9 }
];

export default function AdminAnalyticsPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  
  // Redirect if user is not authenticated or not an admin
  if (!isLoading && (!isAuthenticated || !isAdmin())) {
    return <Navigate to="/dashboard" />;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  const renderLegend = (items) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getColor(index) }}
            ></div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    );
  };
  
  const getColor = (index) => {
    const colors = [
      "#8884d8", "#82ca9d", "#ffc658", "#ff8042", 
      "#0088FE", "#00C49F", "#FFBB28", "#FF8042"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Track performance and key metrics"
        icon={<BarChart3 className="h-6 w-6" />}
      />
      
      <div className="flex justify-between">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end mb-4">
            <Select defaultValue="2025">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium">
                    <span>Member Growth</span>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12%</div>
                  <div className="flex items-center text-xs text-emerald-500">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>Since last semester</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium">
                    <span>Event Attendance</span>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Average this semester</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium">
                    <span>Dues Collection</span>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,250</div>
                  <div className="flex items-center text-xs text-emerald-500">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>94% collected</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Rate</CardTitle>
                  <CardDescription>Monthly attendance percentage</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] relative">
                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="flex-1 flex items-end">
                      {attendanceData.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-8 bg-primary rounded-t" 
                            style={{ height: `${item.value * 0.8}%` }}
                          ></div>
                          <div className="mt-2 text-sm">{item.month}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 space-y-1">
                      <div className="h-4 w-full grid grid-cols-5 gap-px">
                        {[0, 25, 50, 75, 100].map((value) => (
                          <div key={value} className="text-xs text-muted-foreground text-center">
                            {value}%
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Voice Part Distribution</CardTitle>
                  <CardDescription>Current member voice parts</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] relative">
                  <div className="h-3/4 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-8 border-background relative">
                      {/* Simplified pie chart visualization */}
                      <div className="absolute inset-0 bg-[#8884d8] rounded-full" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)' }}></div>
                      <div className="absolute inset-0 bg-[#82ca9d] rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
                      <div className="absolute inset-0 bg-[#ffc658] rounded-full" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 50%)' }}></div>
                      <div className="absolute inset-0 bg-[#ff8042] rounded-full" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 0, 50% 0)' }}></div>
                    </div>
                  </div>
                  {renderLegend(voicePartDistribution)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Attendance Analytics</CardTitle>
                <CardDescription>
                  Track attendance rates across events and rehearsals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Select specific date ranges and event types to analyze attendance patterns
                </p>
                <div className="border rounded-md p-6 flex items-center justify-center min-h-[300px]">
                  <p className="text-muted-foreground">Attendance charts would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="finances" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Analytics</CardTitle>
                <CardDescription>
                  Track dues collection and financial trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Analyze dues collection rates and payment methods
                </p>
                <div className="border rounded-md p-6 flex items-center justify-center min-h-[300px]">
                  <p className="text-muted-foreground">Financial charts would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="membership" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Membership Analytics</CardTitle>
                <CardDescription>
                  Track membership changes and demographics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Analyze member retention, class year distribution, and voice part balance
                </p>
                <div className="border rounded-md p-6 flex items-center justify-center min-h-[300px]">
                  <p className="text-muted-foreground">Membership charts would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
