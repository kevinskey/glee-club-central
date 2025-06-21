import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";

interface Order {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  items: any[];
}

interface StoreItem {
  id: string;
  name: string;
  price: number;
  quantity_in_stock: number;
  tags: string[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function StoreAnalytics() {
  const { data: orders } = useQuery({
    queryKey: ["store-orders-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  const { data: items } = useQuery({
    queryKey: ["store-items-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("store_items").select("*");

      if (error) throw error;
      return data as StoreItem[];
    },
  });

  // Calculate analytics
  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.amount / 100, 0) || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders =
    orders?.filter((order) => order.status === "pending").length || 0;
  const completedOrders =
    orders?.filter((order) => order.status === "completed").length || 0;

  // Monthly revenue data
  const monthlyData = React.useMemo(() => {
    if (!orders) return [];

    const monthlyRevenue: { [key: string]: number } = {};
    orders.forEach((order) => {
      const month = new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.amount / 100;
    });

    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue: Math.round(revenue * 100) / 100,
    }));
  }, [orders]);

  // Top selling items
  const topSellingItems = React.useMemo(() => {
    if (!orders) return [];

    const itemCounts: {
      [key: string]: { name: string; count: number; revenue: number };
    } = {};

    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const key = item.name || item.id;
          if (!itemCounts[key]) {
            itemCounts[key] = {
              name: item.name || "Unknown Item",
              count: 0,
              revenue: 0,
            };
          }
          itemCounts[key].count += item.quantity || 1;
          itemCounts[key].revenue += (item.price || 0) * (item.quantity || 1);
        });
      }
    });

    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  // Order status distribution
  const orderStatusData = React.useMemo(() => {
    if (!orders) return [];

    const statusCounts: { [key: string]: number } = {};
    orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingOrders}
                </p>
              </div>
              <Package className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Order Value
                </p>
                <p className="text-2xl font-bold">
                  $
                  {totalOrders > 0
                    ? (totalRevenue / totalOrders).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSellingItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.count} sold • ${item.revenue.toFixed(2)} revenue
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{item.count} units</p>
                  <p className="text-sm text-gray-600">
                    ${item.revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            {topSellingItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No sales data available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
