
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';

export function StoreAnalytics() {
  const { data: orders } = useQuery({
    queryKey: ['store-analytics-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ['store-analytics-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  // Calculate monthly revenue
  const monthlyRevenue = React.useMemo(() => {
    if (!orders) return [];
    
    const revenueByMonth: { [key: string]: number } = {};
    
    orders
      .filter(order => order.status === 'completed')
      .forEach(order => {
        const month = new Date(order.created_at).toISOString().slice(0, 7); // YYYY-MM format
        revenueByMonth[month] = (revenueByMonth[month] || 0) + (order.amount / 100);
      });
    
    return Object.entries(revenueByMonth)
      .map(([month, revenue]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue
      }))
      .slice(-6); // Last 6 months
  }, [orders]);

  // Calculate product sales
  const productSales = React.useMemo(() => {
    if (!orders) return [];
    
    const salesByProduct: { [key: string]: number } = {};
    
    orders
      .filter(order => order.status === 'completed')
      .forEach(order => {
        order.items.forEach((item: any) => {
          const productName = item.product_name || item.description || 'Unknown Product';
          salesByProduct[productName] = (salesByProduct[productName] || 0) + (item.quantity || 1);
        });
      });
    
    return Object.entries(salesByProduct)
      .map(([product, sales]) => ({ product, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Top 5 products
  }, [orders]);

  const totalRevenue = orders?.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.amount, 0) / 100 || 0;
  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
  const activeProducts = products?.filter(p => p.is_active).length || 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">{completedOrders} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Orders completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productSales} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <div>
                    <p className="font-medium">{order.customer_email}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(order.amount / 100).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
