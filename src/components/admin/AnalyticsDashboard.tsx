import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingCart, Eye, DollarSign, Download, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalyticsData {
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ name: string; revenue: number; quantity: number }>;
  conversionFunnel: Array<{ name: string; value: number; percentage: number }>;
  userGrowth: Array<{ date: string; total_users: number; new_users: number }>;
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--earth))", "hsl(var(--success))", "hsl(var(--warning))"];

export const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState("30");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const days = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch daily revenue and orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("total_amount, created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at");

      if (ordersError) throw ordersError;

      // Group by date
      const revenueByDate = new Map<string, { revenue: number; count: number }>();
      orders?.forEach((order) => {
        const date = new Date(order.created_at).toLocaleDateString();
        const existing = revenueByDate.get(date) || { revenue: 0, count: 0 };
        revenueByDate.set(date, {
          revenue: existing.revenue + Number(order.total_amount),
          count: existing.count + 1,
        });
      });

      const dailyRevenue = Array.from(revenueByDate.entries())
        .map(([date, data]) => ({
          date,
          revenue: data.revenue,
          orders: data.count,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Fetch top products
      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("product_id, quantity, price, products(name)")
        .gte("created_at", startDate.toISOString());

      if (itemsError) throw itemsError;

      const productRevenue = new Map<string, { name: string; revenue: number; quantity: number }>();
      orderItems?.forEach((item: any) => {
        const name = item.products?.name || "Unknown";
        const existing = productRevenue.get(name) || { name, revenue: 0, quantity: 0 };
        productRevenue.set(name, {
          name,
          revenue: existing.revenue + Number(item.price) * item.quantity,
          quantity: existing.quantity + item.quantity,
        });
      });

      const topProducts = Array.from(productRevenue.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Fetch conversion funnel
      const { data: events, error: eventsError } = await supabase
        .from("analytics_events")
        .select("event_name")
        .gte("created_at", startDate.toISOString());

      if (eventsError) throw eventsError;

      const eventCounts = new Map<string, number>();
      events?.forEach((event) => {
        eventCounts.set(event.event_name, (eventCounts.get(event.event_name) || 0) + 1);
      });

      const totalViews = eventCounts.get("page_view") || 1;
      const conversionFunnel = [
        { name: "Page Views", value: eventCounts.get("page_view") || 0, percentage: 100 },
        { name: "Product Views", value: eventCounts.get("product_view") || 0, percentage: ((eventCounts.get("product_view") || 0) / totalViews) * 100 },
        { name: "Add to Cart", value: eventCounts.get("add_to_cart") || 0, percentage: ((eventCounts.get("add_to_cart") || 0) / totalViews) * 100 },
        { name: "Checkout", value: eventCounts.get("checkout_start") || 0, percentage: ((eventCounts.get("checkout_start") || 0) / totalViews) * 100 },
        { name: "Orders", value: eventCounts.get("order_complete") || 0, percentage: ((eventCounts.get("order_complete") || 0) / totalViews) * 100 },
      ];

      // Fetch user growth
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at");

      if (profilesError) throw profilesError;

      const usersByDate = new Map<string, number>();
      profiles?.forEach((profile) => {
        const date = new Date(profile.created_at).toLocaleDateString();
        usersByDate.set(date, (usersByDate.get(date) || 0) + 1);
      });

      let cumulativeUsers = 0;
      const userGrowth = Array.from(usersByDate.entries())
        .map(([date, newUsers]) => {
          cumulativeUsers += newUsers;
          return { date, total_users: cumulativeUsers, new_users: newUsers };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setAnalytics({
        dailyRevenue,
        topProducts,
        conversionFunnel,
        userGrowth,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString()}.csv`;
    a.click();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive business insights and metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last 365 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics?.dailyRevenue.reduce((sum, day) => sum + day.revenue, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.dailyRevenue.reduce((sum, day) => sum + day.orders, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.conversionFunnel[4]?.percentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Eye className="h-4 w-4 text-earth" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.userGrowth[analytics.userGrowth.length - 1]?.total_users || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Orders Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue & Orders Over Time</CardTitle>
              <CardDescription>Daily revenue and order count trends</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportCSV(analytics?.dailyRevenue || [], "revenue-report")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" name="Revenue ($)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(var(--accent))" name="Orders" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
            <CardDescription>Best performing products in selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.topProducts}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>User journey from view to purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.conversionFunnel}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {analytics?.conversionFunnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Cumulative and new user registration trends</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV(analytics?.userGrowth || [], "user-growth-report")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                <Legend />
                <Line type="monotone" dataKey="total_users" stroke="hsl(var(--success))" name="Total Users" strokeWidth={2} />
                <Line type="monotone" dataKey="new_users" stroke="hsl(var(--earth))" name="New Users" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
