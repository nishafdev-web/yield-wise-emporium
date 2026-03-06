import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, ShoppingCart, TrendingUp, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealtime } from "@/hooks/useRealtime";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  newSignups: number;
}

interface RecentActivity {
  id: string;
  verb: string;
  object_type: string;
  created_at: string;
  actor_user_id: string;
}

const StatusDot = ({ status }: { status: string }) => {
  if (status === "connected") {
    return (
      <span className="flex items-center gap-1 text-xs" style={{ color: "hsl(142 71% 45%)" }}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "hsl(142 71% 45%)" }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "hsl(142 71% 45%)" }} />
        </span>
        Live
      </span>
    );
  }
  if (status === "connecting") {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <RefreshCw className="h-3 w-3 animate-spin" /> Connecting...
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-destructive">
      <WifiOff className="h-3 w-3" /> Offline
    </span>
  );
};

export { StatusDot };

export const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    newSignups: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [
        { count: usersCount },
        { data: ordersData },
        { count: newSignupsCount },
        { data: activityData },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total_amount, created_at"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
        supabase.from("events").select("*").order("created_at", { ascending: false }).limit(10),
      ]);

      const totalRevenue = ordersData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalRevenue,
        totalOrders: ordersData?.length || 0,
        newSignups: newSignupsCount || 0,
      });
      setRecentActivity(activityData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { status } = useRealtime("dashboard-overview", [
    {
      table: "orders",
      onChange: fetchDashboardData,
    },
    {
      table: "profiles",
      onChange: fetchDashboardData,
    },
    {
      table: "events",
      onInsert: (newRow) => {
        setRecentActivity((prev) => [newRow, ...prev].slice(0, 10));
      },
    },
  ]);

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, description: "Registered users" },
    { title: "Total Revenue", value: `Rs. ${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, description: "All time revenue" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, description: "All orders" },
    { title: "New Signups (7d)", value: stats.newSignups, icon: TrendingUp, description: "Last 7 days" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with live status */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Overview</h2>
        <div className="flex items-center gap-3">
          <StatusDot status={status} />
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="h-3 w-3 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <StatusDot status={status} />
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm border-l-2 border-primary pl-3 py-2 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="flex-1">
                    <p className="font-medium capitalize">
                      {activity.verb} {activity.object_type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
