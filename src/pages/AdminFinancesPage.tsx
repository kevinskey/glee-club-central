
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { CreditCard, Plus, Download, DollarSign, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample financial data
const samplePayments = [
  { id: "1", memberId: "1", memberName: "Alexis Johnson", amount: 100, date: "2024-01-15", method: "Credit Card", status: "completed", description: "Academic Year 2025 Dues" },
  { id: "2", memberId: "2", memberName: "Jamal Williams", amount: 100, date: "2024-01-12", method: "Venmo", status: "completed", description: "Academic Year 2025 Dues" },
  { id: "3", memberId: "4", memberName: "Maya Rodriguez", amount: 100, date: "2024-01-10", method: "Cash", status: "completed", description: "Academic Year 2025 Dues" },
  { id: "4", memberId: "5", memberName: "Devon Carter", amount: 100, date: "2024-01-05", method: "Check", status: "completed", description: "Academic Year 2025 Dues" },
  { id: "5", memberId: "3", memberName: "Taylor Smith", amount: 100, date: "2024-02-28", method: "Credit Card", status: "pending", description: "Academic Year 2025 Dues" },
];

const chartData = [
  { name: "Aug", revenue: 0, expenses: 125 },
  { name: "Sep", revenue: 300, expenses: 250 },
  { name: "Oct", revenue: 400, expenses: 175 },
  { name: "Nov", revenue: 100, expenses: 350 },
  { name: "Dec", revenue: 200, expenses: 200 },
  { name: "Jan", revenue: 500, expenses: 125 },
  { name: "Feb", revenue: 100, expenses: 175 },
  { name: "Mar", revenue: 0, expenses: 300 },
  { name: "Apr", revenue: 300, expenses: 250 },
  { name: "May", revenue: 500, expenses: 500 },
];

export default function AdminFinancesPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate total revenue and expenses
  const totalRevenue = samplePayments.reduce((sum, payment) => 
    payment.status === "completed" ? sum + payment.amount : sum, 0
  );
  
  const pendingRevenue = samplePayments.reduce((sum, payment) => 
    payment.status === "pending" ? sum + payment.amount : sum, 0
  );
  
  const totalExpenses = chartData.reduce((sum, month) => sum + month.expenses, 0);

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Financial Management"
        description="Track dues, payments, and financial records"
        icon={<CreditCard className="h-6 w-6" />}
      />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue}</div>
                <p className="text-xs text-muted-foreground">Academic Year 2024-2025</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${pendingRevenue}</div>
                <p className="text-xs text-muted-foreground">From 1 member</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalExpenses}</div>
                <p className="text-xs text-muted-foreground">Academic Year 2024-2025</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#4ade80" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#f43f5e" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button className="justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Record New Payment
                </Button>
                <Button variant="outline" className="justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Financial Report
                </Button>
                <Button variant="outline" className="justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Set Dues for New Term
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Payment Reminders
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Dues Collected</span>
                      <span className="text-sm font-medium">83%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-secondary overflow-hidden rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: "83%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">35 of 42 members paid</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Budget Used</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-secondary overflow-hidden rounded-full">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">$1,950 of $3,000 budget used</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Records</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {samplePayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.memberName}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={payment.status === "completed" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-amber-50 text-amber-700 border-amber-200"
                          }
                        >
                          {payment.status === "completed" ? "Completed" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Financial Reports</CardTitle>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">Annual Financial Summary</p>
                      <p className="text-sm text-muted-foreground">Academic Year 2023-2024</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </li>
                <li className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">Dues Collection Report</p>
                      <p className="text-sm text-muted-foreground">Spring 2024</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </li>
                <li className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">Expense Breakdown</p>
                      <p className="text-sm text-muted-foreground">Fall 2023</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">Budget Proposal</p>
                      <p className="text-sm text-muted-foreground">Academic Year 2024-2025</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
